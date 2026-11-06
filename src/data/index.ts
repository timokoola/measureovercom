import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import {
  ALL_CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_DESCRIPTIONS,
  type AnyPage,
  type CategoryName,
  type GlossaryPage,
  type GuidePage,
  type PageIndex,
  type UseCasePage,
} from './types.ts';
import { canonicalPath, isValidSlug } from './slugs.ts';
import { PAPER_ORDER, buildPaperSizePage } from './paperSizes.ts';
import type { PaperSize } from '../types/index.ts';

/**
 * The public data API. Templates and sitemaps talk to this module only — never
 * to `astro:content` or the filesystem directly — so the storage decision
 * (MDX today, a database later) stays swappable.
 *
 * Two tiers, deliberately:
 *   - `PageIndex` for anything that touches every page at once (sitemap, hubs,
 *     related cards). ~0.5 KB each.
 *   - `AnyPage` for the page being rendered right now. Carries body and FAQs.
 *
 * Scale note: this is a build-time, in-memory layer, appropriate up to roughly
 * 10K pages. This site's honest ceiling is ~150, so it is not close. Past that,
 * see the pseo-scale skill — do not paper over it here.
 */

// Memoised for the build: getCollection is called by every route's
// getStaticPaths, and re-reading and re-validating on each is pure waste.
let indexCache: PageIndex[] | null = null;
const pageCache = new Map<string, AnyPage | null>();

function cacheKey(category: CategoryName, slug: string): string {
  return `${category}/${slug}`;
}

/** Trim an entry down to the lightweight tier. */
function toIndex(
  category: CategoryName,
  slug: string,
  data: {
    title: string;
    metaDescription: string;
    h1?: string;
    summary: string;
    lastUpdated: Date;
    draft: boolean;
  }
): PageIndex {
  return {
    slug,
    category,
    canonicalPath: canonicalPath(category, slug),
    title: data.title,
    metaDescription: data.metaDescription,
    h1: data.h1 ?? data.title,
    summary: data.summary,
    lastModified: data.lastUpdated.toISOString().slice(0, 10),
    draft: data.draft,
  };
}

/** Drafts never reach production; keep them visible in dev. */
function isPublished(draft: boolean): boolean {
  return !draft || !import.meta.env.PROD;
}

async function authoredEntries<T extends 'guides' | 'use-cases' | 'glossary'>(
  collection: T
): Promise<CollectionEntry<T>[]> {
  const entries = await getCollection(collection);
  return entries.filter((e) => isValidSlug(e.id) && isPublished(e.data.draft));
}

/** Overlay MDX for paper sizes, keyed by slug. Missing files are expected. */
async function paperSizeOverlays(): Promise<Map<string, CollectionEntry<'paper-sizes'>>> {
  const entries = await getCollection('paper-sizes');
  return new Map(entries.filter((e) => isValidSlug(e.id)).map((e) => [e.id, e]));
}

/**
 * Lightweight index for every published page, all categories.
 * Safe to call repeatedly — memoised.
 */
export async function getAllPageIndexes(): Promise<PageIndex[]> {
  if (indexCache) return indexCache;

  const overlays = await paperSizeOverlays();
  const paperPages: PageIndex[] = PAPER_ORDER.map((size) => {
    const overlay = overlays.get(size);
    const page = buildPaperSizePage(size, overlay?.data);
    return {
      slug: page.slug,
      category: page.category,
      canonicalPath: page.canonicalPath,
      title: page.title,
      metaDescription: page.metaDescription,
      h1: page.h1,
      summary: page.summary,
      lastModified: page.lastModified,
      draft: page.draft,
    };
  }).filter((p) => isPublished(p.draft));

  const [guides, useCases, glossary] = await Promise.all([
    authoredEntries('guides'),
    authoredEntries('use-cases'),
    authoredEntries('glossary'),
  ]);

  indexCache = [
    ...paperPages,
    ...guides.map((e) => toIndex('guides', e.id, e.data)),
    ...useCases.map((e) => toIndex('use-cases', e.id, e.data)),
    ...glossary.map((e) => toIndex('glossary', e.id, e.data)),
  ];
  return indexCache;
}

/** Every published slug, for static generation. */
export async function getAllSlugs(): Promise<
  { category: CategoryName; slug: string; path: string }[]
> {
  const pages = await getAllPageIndexes();
  return pages.map((p) => ({
    category: p.category,
    slug: p.slug,
    path: p.canonicalPath,
  }));
}

export async function getSlugsForCategory(category: CategoryName): Promise<string[]> {
  const pages = await getAllPageIndexes();
  return pages.filter((p) => p.category === category).map((p) => p.slug);
}

/** Full content for a single page. Returns null for unknown slugs — callers 404. */
export async function getPageData(
  category: CategoryName,
  slug: string
): Promise<AnyPage | null> {
  const key = cacheKey(category, slug);
  if (pageCache.has(key)) return pageCache.get(key) ?? null;

  const page = await loadPage(category, slug);
  pageCache.set(key, page);
  return page;
}

async function loadPage(category: CategoryName, slug: string): Promise<AnyPage | null> {
  if (!isValidSlug(slug)) return null;

  if (category === 'paper-sizes') {
    if (!PAPER_ORDER.includes(slug as PaperSize)) return null;
    // Look up through the overlay map: getEntry warns on every sheet that has
    // no MDX file, and most of them deliberately do not.
    const overlay = (await paperSizeOverlays()).get(slug);
    const page = buildPaperSizePage(slug as PaperSize, {
      ...overlay?.data,
      body: overlay?.body ?? null,
    });
    return isPublished(page.draft) ? page : null;
  }

  if (category === 'guides') {
    const entry = await getEntry('guides', slug);
    if (!entry || !isPublished(entry.data.draft)) return null;
    const page: GuidePage = {
      ...toIndex('guides', entry.id, entry.data),
      category: 'guides',
      faqs: entry.data.faqs,
      relatedSlugs: entry.data.related,
      body: entry.body ?? null,
      difficulty: entry.data.difficulty,
      timeToComplete: entry.data.timeToComplete,
      tools: entry.data.tools,
      steps: entry.data.steps,
    };
    return page;
  }

  if (category === 'use-cases') {
    const entry = await getEntry('use-cases', slug);
    if (!entry || !isPublished(entry.data.draft)) return null;
    const page: UseCasePage = {
      ...toIndex('use-cases', entry.id, entry.data),
      category: 'use-cases',
      faqs: entry.data.faqs,
      relatedSlugs: entry.data.related,
      body: entry.body ?? null,
      useCase: entry.data.useCase,
      recommendedSettings: entry.data.recommendedSettings,
      exampleInputs: entry.data.exampleInputs,
      expectedOutputs: entry.data.expectedOutputs,
    };
    return page;
  }

  const entry = await getEntry('glossary', slug);
  if (!entry || !isPublished(entry.data.draft)) return null;
  const page: GlossaryPage = {
    ...toIndex('glossary', entry.id, entry.data),
    category: 'glossary',
    faqs: entry.data.faqs,
    relatedSlugs: entry.data.related,
    body: entry.body ?? null,
    term: entry.data.term,
    definition: entry.data.definition,
    relatedTerms: entry.data.relatedTerms,
  };
  return page;
}

export interface CategoryQuery {
  limit?: number;
  offset?: number;
}

/** Pages in one category, for hub pages. Index tier only. */
export async function getPagesByCategory(
  category: CategoryName,
  opts: CategoryQuery = {}
): Promise<PageIndex[]> {
  const pages = (await getAllPageIndexes()).filter((p) => p.category === category);
  const offset = opts.offset ?? 0;
  return opts.limit === undefined
    ? pages.slice(offset)
    : pages.slice(offset, offset + opts.limit);
}

/**
 * Related pages for internal linking.
 *
 * Explicit `related:` entries win; the remainder is filled from the same
 * category so that no page is ever a dead end, which is what orphans a
 * generated site.
 */
export async function getRelatedPages(
  category: CategoryName,
  slug: string,
  limit = 4
): Promise<PageIndex[]> {
  const [all, page] = await Promise.all([
    getAllPageIndexes(),
    getPageData(category, slug),
  ]);
  const byPath = new Map(all.map((p) => [p.canonicalPath, p]));
  const selfPath = canonicalPath(category, slug);

  const picked: PageIndex[] = [];
  const seen = new Set<string>([selfPath]);

  for (const ref of page?.relatedSlugs ?? []) {
    // `category/slug` for cross-type links, bare `slug` for same-category.
    const [maybeCategory, maybeSlug] = ref.includes('/') ? ref.split('/') : [category, ref];
    const target = byPath.get(
      canonicalPath(maybeCategory as CategoryName, maybeSlug as string)
    );
    if (target && !seen.has(target.canonicalPath)) {
      picked.push(target);
      seen.add(target.canonicalPath);
    }
    if (picked.length >= limit) return picked;
  }

  for (const candidate of all) {
    if (picked.length >= limit) break;
    if (candidate.category !== category) continue;
    if (seen.has(candidate.canonicalPath)) continue;
    picked.push(candidate);
    seen.add(candidate.canonicalPath);
  }

  return picked;
}

export interface CategorySummary {
  name: CategoryName;
  label: string;
  description: string;
  path: string;
  count: number;
}

export async function getAllCategories(): Promise<CategorySummary[]> {
  const pages = await getAllPageIndexes();
  return ALL_CATEGORIES.map((name) => ({
    name,
    label: CATEGORY_LABELS[name],
    description: CATEGORY_DESCRIPTIONS[name],
    path: `/${name}/`,
    count: pages.filter((p) => p.category === name).length,
  }));
}

export async function getPageCount(): Promise<number> {
  return (await getAllPageIndexes()).length;
}

export { canonicalPath, isValidSlug } from './slugs.ts';
export * from './types.ts';
