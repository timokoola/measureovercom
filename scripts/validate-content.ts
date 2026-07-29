/**
 * Content integrity check.
 *
 * Runs standalone (`npm run validate:content`) without booting Astro, using the
 * same Zod schemas the content collections use, so CI can fail on bad content
 * before a build is attempted. Node runs this .ts file directly.
 *
 * Checks:
 *   - frontmatter matches the schema for its collection
 *   - slugs are URL-safe and unique across all categories
 *   - title / description lengths are inside search-result limits
 *   - every `related:` reference resolves to a real page
 *   - no page is orphaned (unreachable from any other page or hub)
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import matter from 'gray-matter';
import {
  CONTENT_SCHEMAS,
  TITLE_MAX,
  DESCRIPTION_MIN,
  DESCRIPTION_MAX,
  type ContentCollectionName,
} from '../src/data/schemas.ts';
import { isValidSlug, findSlugCollisions, canonicalPath } from '../src/data/slugs.ts';
import { ALL_CATEGORIES, type CategoryName } from '../src/data/types.ts';
import { PAPER_ORDER, buildPaperSizePage } from '../src/data/paperSizes.ts';

const CONTENT_ROOT = 'content';

interface Problem {
  file: string;
  message: string;
}

const errors: Problem[] = [];
const warnings: Problem[] = [];

function mdxFilesIn(dir: string): string[] {
  const full = join(CONTENT_ROOT, dir);
  if (!existsSync(full)) return [];
  return readdirSync(full).filter((f) => f.endsWith('.mdx'));
}

interface LoadedPage {
  category: CategoryName;
  slug: string;
  source: string;
  related: string[];
  hasBody: boolean;
}

const loaded: LoadedPage[] = [];

for (const category of ALL_CATEGORIES) {
  const schema = CONTENT_SCHEMAS[category as ContentCollectionName];

  for (const file of mdxFilesIn(category)) {
    const source = `${category}/${file}`;
    const slug = basename(file, '.mdx');

    if (!isValidSlug(slug)) {
      errors.push({
        file: source,
        message: `filename "${slug}" is not a valid slug (lowercase letters, digits and single hyphens only)`,
      });
      continue;
    }

    const raw = readFileSync(join(CONTENT_ROOT, category, file), 'utf8');
    const { data, content } = matter(raw);

    const result = schema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push({
          file: source,
          message: `${issue.path.join('.') || '(root)'}: ${issue.message}`,
        });
      }
      continue;
    }

    // Frontmatter that no schema consumes is almost always a stale field left
    // behind by a rename — silently ignored by Zod, so surface it.
    const known = new Set(Object.keys(result.data));
    for (const key of Object.keys(data)) {
      if (!known.has(key)) {
        warnings.push({ file: source, message: `unknown frontmatter field "${key}" is ignored` });
      }
    }

    loaded.push({
      category,
      slug,
      source,
      related: (result.data as { related?: string[] }).related ?? [],
      hasBody: content.trim().length > 0,
    });
  }
}

// Generated paper-size pages exist whether or not an MDX overlay does.
const generatedPaperPages: LoadedPage[] = PAPER_ORDER.filter(
  (size) => !loaded.some((p) => p.category === 'paper-sizes' && p.slug === size)
).map((size) => ({
  category: 'paper-sizes' as CategoryName,
  slug: size,
  source: `(generated) paper-sizes/${size}`,
  related: [],
  hasBody: false,
}));

const allPages = [...loaded, ...generatedPaperPages];

// --- generated paper-size pages ---
// These bypass Zod entirely (nothing is authored), so their title and
// description lengths are unchecked unless we check them here. A longer label
// or an extra clause in the template silently pushes them past the limit.
for (const size of PAPER_ORDER) {
  const page = buildPaperSizePage(size);
  const where = `(generated) paper-sizes/${size}`;

  if (page.title.length > TITLE_MAX) {
    errors.push({
      file: where,
      message: `generated title is ${page.title.length} chars, limit ${TITLE_MAX}`,
    });
  }
  if (page.metaDescription.length > DESCRIPTION_MAX) {
    errors.push({
      file: where,
      message: `generated metaDescription is ${page.metaDescription.length} chars, limit ${DESCRIPTION_MAX}`,
    });
  }
  if (page.metaDescription.length < DESCRIPTION_MIN) {
    errors.push({
      file: where,
      message: `generated metaDescription is only ${page.metaDescription.length} chars, minimum ${DESCRIPTION_MIN}`,
    });
  }
  // Warn before it becomes an error, since the template is shared by all ten.
  if (page.metaDescription.length > DESCRIPTION_MAX - 10) {
    warnings.push({
      file: where,
      message: `generated metaDescription is ${page.metaDescription.length} chars, within 10 of the ${DESCRIPTION_MAX} limit`,
    });
  }
}

// --- uniqueness ---
for (const collision of findSlugCollisions(allPages)) {
  errors.push({
    file: collision.sources.join(' + '),
    message: `duplicate canonical path ${collision.path}`,
  });
}

// --- related references resolve ---
const knownPaths = new Set(allPages.map((p) => canonicalPath(p.category, p.slug)));
const linkedTo = new Set<string>();

for (const page of allPages) {
  for (const ref of page.related) {
    const [cat, slug] = ref.includes('/') ? ref.split('/') : [page.category, ref];
    const target = canonicalPath(cat as CategoryName, slug as string);
    if (!knownPaths.has(target)) {
      errors.push({ file: page.source, message: `related: "${ref}" does not resolve (${target})` });
    } else {
      linkedTo.add(target);
    }
  }
}

// --- orphans ---
// Paper sizes are exempt: they are reachable from the homepage table and their
// own hub by construction.
for (const page of allPages) {
  const path = canonicalPath(page.category, page.slug);
  if (page.category === 'paper-sizes') continue;
  if (!linkedTo.has(path)) {
    warnings.push({
      file: page.source,
      message: 'orphan: no other page links here via related:',
    });
  }
}

// --- report ---
const byCategory = ALL_CATEGORIES.map((c) => {
  const n = allPages.filter((p) => p.category === c).length;
  return `${c}=${n}`;
}).join('  ');

console.log(`\ncontent: ${allPages.length} pages  (${byCategory})`);
console.log(`  authored MDX: ${loaded.length}   generated: ${generatedPaperPages.length}`);

if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  ! ${w.file}: ${w.message}`);
}

if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  for (const e of errors) console.error(`  ✗ ${e.file}: ${e.message}`);
  console.error('');
  process.exit(1);
}

console.log('\n✓ content valid\n');
