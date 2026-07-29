import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  guideSchema,
  useCaseSchema,
  glossarySchema,
  paperSizeOverlaySchema,
} from './data/schemas';

/**
 * Content lives in `content/` at the repo root rather than `src/content/`, so
 * writing a page never means touching application code. The glob loader points
 * at it; entry `id` is the filename, which is what the slug is derived from.
 *
 * Schemas are imported from `src/data/schemas.ts` so the standalone validation
 * script can apply exactly the same rules without booting Astro.
 */

const guides = defineCollection({
  loader: glob({ base: './content/guides', pattern: '**/*.mdx' }),
  schema: guideSchema,
});

const useCases = defineCollection({
  loader: glob({ base: './content/use-cases', pattern: '**/*.mdx' }),
  schema: useCaseSchema,
});

const glossary = defineCollection({
  loader: glob({ base: './content/glossary', pattern: '**/*.mdx' }),
  schema: glossarySchema,
});

// Optional prose overlay only — the dimensional data is generated from
// PAPER_SIZES, so a sheet with no MDX file still gets a complete page.
const paperSizes = defineCollection({
  loader: glob({ base: './content/paper-sizes', pattern: '**/*.mdx' }),
  schema: paperSizeOverlaySchema,
});

export const collections = {
  guides,
  'use-cases': useCases,
  glossary,
  'paper-sizes': paperSizes,
};
