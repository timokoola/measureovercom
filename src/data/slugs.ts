import { CATEGORY_PATHS, type CategoryName } from './types.ts';

/**
 * Slug rules.
 *
 * Authored slugs are the MDX **filename**, not a frontmatter field. That makes
 * uniqueness within a collection a filesystem guarantee rather than something
 * we have to police — two files cannot share a path. `assertUniqueSlugs` then
 * catches the cases the filesystem cannot: bad characters, and duplicates
 * across the generated and authored sets.
 */

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug) && slug.length >= 2 && slug.length <= 80;
}

/** Deterministic: the same input always yields the same slug. */
export function toSlug(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
}

export function canonicalPath(category: CategoryName, slug: string): string {
  return `/${CATEGORY_PATHS[category]}/${slug}/`;
}

export interface SlugCollision {
  path: string;
  sources: string[];
}

/**
 * Detect duplicate canonical paths across every category at once.
 *
 * Two pages resolving to one URL is the failure that silently halves a pSEO
 * build: one overwrites the other and the sitemap still claims both.
 */
export function findSlugCollisions(
  entries: { category: CategoryName; slug: string; source: string }[]
): SlugCollision[] {
  const byPath = new Map<string, string[]>();
  for (const entry of entries) {
    const path = canonicalPath(entry.category, entry.slug);
    const sources = byPath.get(path);
    if (sources) sources.push(entry.source);
    else byPath.set(path, [entry.source]);
  }

  return [...byPath.entries()]
    .filter(([, sources]) => sources.length > 1)
    .map(([path, sources]) => ({ path, sources }));
}
