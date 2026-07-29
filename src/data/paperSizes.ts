import { PAPER_SIZES } from '../utils/paperSizes.ts';
import type { PaperSize } from '../types/index.ts';
import type { PaperSizePage, FAQ } from './types.ts';
import { canonicalPath } from './slugs.ts';

/**
 * Paper-size pages are DERIVED, not authored.
 *
 * The dimensional facts come from PAPER_SIZES — the same constant the tool
 * measures with — so a page can never claim a size the app does not support, or
 * quote a width the app disagrees with. Authors may overlay prose via an
 * optional MDX file (see `paperSizeOverlaySchema`); everything below is
 * generated and is enough on its own for a factually unique page.
 */

const EXPORT_DPI = 300;
const MM_TO_INCHES = 25.4;

export const PAPER_LABELS: Record<PaperSize, string> = {
  a6: 'A6',
  a5: 'A5',
  a4: 'A4',
  a3: 'A3',
  a2: 'A2',
  a1: 'A1',
  a0: 'A0',
  'us-letter': 'US Letter',
  'us-legal': 'US Legal',
  'us-tabloid': 'US Tabloid',
};

/** Presentation order: ISO A ascending, then US sheets. */
export const PAPER_ORDER: PaperSize[] = [
  'a6', 'a5', 'a4', 'a3', 'a2', 'a1', 'a0',
  'us-letter', 'us-legal', 'us-tabloid',
];

/** What each sheet is actually reached for — the one genuinely editorial bit. */
const DEFAULT_USE_CASES: Record<PaperSize, string[]> = {
  a6: ['Postcards and greetings cards', 'Small studies and thumbnails', 'Index cards'],
  a5: ['Sketchbook pages', 'Notebooks and journals', 'Small prints'],
  a4: ['Everyday printing', 'Portrait studies', 'Pattern pieces and templates'],
  a3: ['Larger drawings and portfolio sheets', 'Posters', 'Technical drawings'],
  a2: ['Display posters', 'Large figure drawing', 'Architectural details'],
  a1: ['Exhibition prints', 'Full architectural drawings', 'Large-format patterns'],
  a0: ['Technical and engineering drawings', 'Mural cartoons', 'Full-size templates'],
  'us-letter': ['Everyday US printing', 'Portrait studies', 'Templates and worksheets'],
  'us-legal': ['Long-format documents', 'Tall compositions', 'Extended templates'],
  'us-tabloid': ['Spreads and layouts', 'Larger drawings', 'Ledger and plan sheets'],
};

const round2 = (n: number) => Math.round(n * 100) / 100;
const toInches = (mm: number) => round2(mm / MM_TO_INCHES);
const toPixels = (mm: number) => Math.round((mm / MM_TO_INCHES) * EXPORT_DPI);

/** Reduce a ratio to `1:n` form, which is how paper aspect is normally quoted. */
function aspectRatio(width: number, height: number): string {
  return `1:${round2(height / width)}`;
}

function seriesOf(size: PaperSize): 'ISO A' | 'US' {
  return size.startsWith('us-') ? 'US' : 'ISO A';
}

function generatedFaqs(size: PaperSize): FAQ[] {
  const { width, height } = PAPER_SIZES[size];
  const label = PAPER_LABELS[size];
  return [
    {
      q: `What size is ${label} in millimetres and inches?`,
      a: `${label} measures ${width} × ${height} mm, which is ${toInches(width)} × ${toInches(height)} inches. MeasureOver uses these exact dimensions when it converts guide-line intersections into real measurements.`,
    },
    {
      q: `What pixel size is ${label} at 300 DPI?`,
      a: `${toPixels(width)} × ${toPixels(height)} pixels. That is the resolution MeasureOver exports at for ${label}, which is the normal standard for printed line work.`,
    },
    {
      q: `How do I scale a photo to ${label}?`,
      a: `Open the photo in MeasureOver, choose ${label} as the paper size, and place guide lines over the features you want to locate. Each intersection is reported as a measurement on the ${label} sheet, so you can mark the same points on paper or print the overlay directly.`,
    },
  ];
}

/**
 * Build the full page record for one sheet. `overlay` carries optional authored
 * prose; generated defaults fill every field it does not provide.
 */
export function buildPaperSizePage(
  size: PaperSize,
  overlay?: {
    title?: string;
    metaDescription?: string;
    h1?: string;
    summary?: string;
    lastUpdated?: Date;
    draft?: boolean;
    related?: string[];
    faqs?: FAQ[];
    commonUseCases?: string[];
    body?: string | null;
  }
): PaperSizePage {
  const { width, height } = PAPER_SIZES[size];
  const label = PAPER_LABELS[size];
  const widthIn = toInches(width);
  const heightIn = toInches(height);
  const px = { width: toPixels(width), height: toPixels(height) };

  return {
    slug: size,
    category: 'paper-sizes',
    canonicalPath: canonicalPath('paper-sizes', size),
    title: overlay?.title ?? `${label} Paper Size — ${width} × ${height} mm`,
    metaDescription:
      overlay?.metaDescription ??
      `${label} is ${width} × ${height} mm (${widthIn} × ${heightIn} in), a ${aspectRatio(width, height)} sheet that prints at ${px.width} × ${px.height} px at 300 DPI. Scale a drawing from a photo to ${label}.`,
    h1: overlay?.h1 ?? `${label} paper size`,
    summary:
      overlay?.summary ??
      `${label} measures ${width} × ${height} mm (${widthIn} × ${heightIn} inches), an aspect ratio of ${aspectRatio(width, height)}. Exported at 300 DPI it is ${px.width} × ${px.height} pixels.`,
    lastModified: (overlay?.lastUpdated ?? new Date('2026-07-29')).toISOString().slice(0, 10),
    draft: overlay?.draft ?? false,
    faqs: overlay?.faqs?.length ? overlay.faqs : generatedFaqs(size),
    relatedSlugs: overlay?.related ?? [],
    body: overlay?.body ?? null,
    paperSize: size,
    label,
    widthMm: width,
    heightMm: height,
    widthIn,
    heightIn,
    aspectRatio: aspectRatio(width, height),
    pixelsAt300Dpi: px,
    series: seriesOf(size),
    commonUseCases: overlay?.commonUseCases?.length
      ? overlay.commonUseCases
      : DEFAULT_USE_CASES[size],
  };
}

export function allPaperSizeSlugs(): PaperSize[] {
  return [...PAPER_ORDER];
}
