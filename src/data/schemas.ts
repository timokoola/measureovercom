import { z } from 'zod';

/**
 * Content schemas — the single source of truth for authored page data.
 *
 * Imported by BOTH `src/content.config.ts` (so Astro validates at build time)
 * and `scripts/validate-content.ts` (so CI can validate without booting Astro).
 * Defining them once is the point; a second copy would drift.
 */

// Search targets, not hard limits everywhere: titles beyond ~60 chars get
// truncated in results, descriptions beyond ~160. Enforced as errors because a
// truncated title is a silent quality loss that nobody notices in review.
export const TITLE_MIN = 15;
export const TITLE_MAX = 65;
export const DESCRIPTION_MIN = 70;
export const DESCRIPTION_MAX = 165;
export const SUMMARY_MIN = 60;

const faq = z.object({
  q: z.string().min(10),
  a: z.string().min(40),
});

/** Fields every authored page must supply, whatever its type. */
export const baseContentSchema = z.object({
  title: z.string().min(TITLE_MIN).max(TITLE_MAX),
  /** Distinct from `title`: the <meta name="description"> text. */
  metaDescription: z.string().min(DESCRIPTION_MIN).max(DESCRIPTION_MAX),
  /** Defaults to `title` when omitted — pages may want a shorter on-page heading. */
  h1: z.string().min(5).max(90).optional(),
  /** Lead paragraph shown on the page and on hub cards. */
  summary: z.string().min(SUMMARY_MIN),
  lastUpdated: z.coerce.date(),
  draft: z.boolean().default(false),
  /** Slugs of related pages, `collection/slug` form for cross-type links. */
  related: z.array(z.string()).default([]),
  faqs: z.array(faq).default([]),
});

export const guideSchema = baseContentSchema.extend({
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  timeToComplete: z.string().min(3),
  tools: z.array(z.string()).default([]),
  steps: z
    .array(z.object({ title: z.string().min(5), body: z.string().min(30) }))
    .default([]),
});

export const useCaseSchema = baseContentSchema.extend({
  useCase: z.string().min(3),
  recommendedSettings: z
    .object({
      paperSize: z.string().optional(),
      unit: z.enum(['mm', 'cm', 'inches']).optional(),
      gridEnabled: z.boolean().optional(),
    })
    .default({}),
  exampleInputs: z.array(z.string()).default([]),
  expectedOutputs: z.array(z.string()).default([]),
});

export const glossarySchema = baseContentSchema.extend({
  term: z.string().min(2),
  definition: z.string().min(40),
  relatedTerms: z.array(z.string()).default([]),
});

/**
 * Optional prose overlay for a generated paper-size page. The dimensional facts
 * come from PAPER_SIZES in code — never from frontmatter — so a page exists and
 * is factually unique whether or not an author has written anything for it.
 */
export const paperSizeOverlaySchema = z.object({
  title: z.string().min(TITLE_MIN).max(TITLE_MAX).optional(),
  metaDescription: z.string().min(DESCRIPTION_MIN).max(DESCRIPTION_MAX).optional(),
  h1: z.string().min(5).max(90).optional(),
  summary: z.string().min(SUMMARY_MIN).optional(),
  lastUpdated: z.coerce.date().optional(),
  draft: z.boolean().default(false),
  related: z.array(z.string()).default([]),
  faqs: z.array(faq).default([]),
  commonUseCases: z.array(z.string()).default([]),
});

export const CONTENT_SCHEMAS = {
  guides: guideSchema,
  'use-cases': useCaseSchema,
  glossary: glossarySchema,
  'paper-sizes': paperSizeOverlaySchema,
} as const;

export type ContentCollectionName = keyof typeof CONTENT_SCHEMAS;
