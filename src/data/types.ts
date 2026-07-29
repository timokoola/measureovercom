import type { PaperSize } from '../types/index.ts';

/** URL segment each content type lives under. */
export const CATEGORY_PATHS = {
  guides: 'guides',
  'use-cases': 'use-cases',
  glossary: 'glossary',
  'paper-sizes': 'paper-sizes',
} as const;

export type CategoryName = keyof typeof CATEGORY_PATHS;

export const ALL_CATEGORIES: CategoryName[] = [
  'paper-sizes',
  'guides',
  'use-cases',
  'glossary',
];

/** Human labels for hubs, breadcrumbs and nav. */
export const CATEGORY_LABELS: Record<CategoryName, string> = {
  guides: 'Guides',
  'use-cases': 'Use cases',
  glossary: 'Glossary',
  'paper-sizes': 'Paper sizes',
};

export const CATEGORY_DESCRIPTIONS: Record<CategoryName, string> = {
  guides: 'Step-by-step walkthroughs for scaling and transferring drawings from a photo.',
  'use-cases': 'How MeasureOver is used for stencils, patterns, murals and other real jobs.',
  glossary: 'Plain-language definitions of the measurement and drawing terms used here.',
  'paper-sizes': 'Exact dimensions, aspect ratios and 300 DPI pixel sizes for every supported sheet.',
};

export interface FAQ {
  q: string;
  a: string;
}

/**
 * Lightweight tier — safe to hold for every page at once.
 *
 * Everything needed for sitemaps, hub listings, related-page cards, breadcrumbs
 * and metadata, with no body text. Roughly 0.5 KB per page.
 */
export interface PageIndex {
  slug: string;
  category: CategoryName;
  canonicalPath: string;
  title: string;
  metaDescription: string;
  h1: string;
  summary: string;
  lastModified: string; // ISO date, for sitemap lastmod
  draft: boolean;
}

/**
 * Heavy tier — one page at a time.
 *
 * `body` is the raw MDX source; templates render it through Astro's `render()`
 * rather than reading this directly. Generated pages have no body at all.
 */
export interface BaseSEOContent extends PageIndex {
  faqs: FAQ[];
  relatedSlugs: string[];
  body: string | null;
}

export interface GuidePage extends BaseSEOContent {
  category: 'guides';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeToComplete: string;
  tools: string[];
  steps: { title: string; body: string }[];
}

export interface UseCasePage extends BaseSEOContent {
  category: 'use-cases';
  useCase: string;
  recommendedSettings: {
    paperSize?: string;
    unit?: 'mm' | 'cm' | 'inches';
    gridEnabled?: boolean;
  };
  exampleInputs: string[];
  expectedOutputs: string[];
}

export interface GlossaryPage extends BaseSEOContent {
  category: 'glossary';
  term: string;
  definition: string;
  relatedTerms: string[];
}

/**
 * Paper-size pages are generated from the PAPER_SIZES constant, so these facts
 * are derived rather than authored and cannot contradict the tool.
 */
export interface PaperSizePage extends BaseSEOContent {
  category: 'paper-sizes';
  paperSize: PaperSize;
  label: string;
  widthMm: number;
  heightMm: number;
  widthIn: number;
  heightIn: number;
  aspectRatio: string;
  pixelsAt300Dpi: { width: number; height: number };
  series: 'ISO A' | 'US';
  commonUseCases: string[];
}

export type AnyPage = GuidePage | UseCasePage | GlossaryPage | PaperSizePage;
