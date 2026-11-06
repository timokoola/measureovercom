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

const ISO_ORDER: PaperSize[] = ['a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6'];
const US_ORDER: PaperSize[] = ['us-letter', 'us-legal', 'us-tabloid'];

/** The sheet in the other system with the closest area. */
function nearestCounterpart(size: PaperSize): PaperSize {
  const area = (s: PaperSize) => PAPER_SIZES[s].width * PAPER_SIZES[s].height;
  const pool = size.startsWith('us-') ? ISO_ORDER : US_ORDER;
  return pool.reduce((best, s) =>
    Math.abs(area(s) - area(size)) < Math.abs(area(best) - area(size)) ? s : best
  );
}

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function generatedComparisons(size: PaperSize): string[] {
  const { width, height } = PAPER_SIZES[size];
  const label = PAPER_LABELS[size];
  const areaM2 = (width * height) / 1_000_000;
  const out: string[] = [];

  const i = ISO_ORDER.indexOf(size);
  if (i > 0) {
    out.push(`Two ${label} sheets side by side make one ${PAPER_LABELS[ISO_ORDER[i - 1]]}; ${label} is ${PAPER_LABELS[ISO_ORDER[i - 1]]} folded in half.`);
  }
  if (i >= 0 && i < ISO_ORDER.length - 1) {
    out.push(`Fold ${label} in half across its long side and you get ${PAPER_LABELS[ISO_ORDER[i + 1]]}, the same shape at half the area.`);
  }
  if (i >= 0) {
    out.push(`Its area is ${Number(areaM2.toPrecision(3))} m² — A0 is defined as 1 m², and each step down halves it.`);
  } else {
    out.push(`Its area is ${(areaM2 * 10_000).toFixed(0)} cm² (${round2((width * height) / 645.16)} in²).`);
  }

  const other = nearestCounterpart(size);
  const o = PAPER_SIZES[other];
  // Only worth saying when the two are genuine alternatives for the same job.
  const ratio = (width * height) / (o.width * o.height);
  if (ratio < 0.75 || ratio > 1.33) return out;
  const dw = width - o.width;
  const dh = height - o.height;
  const side = (d: number, wide: string, narrow: string) =>
    Math.abs(d) < 0.05 ? `the same ${wide === 'wider' ? 'width' : 'height'}` : `${fmt(Math.abs(d))} mm ${d > 0 ? wide : narrow}`;
  out.push(
    `The closest ${other.startsWith('us-') ? 'US' : 'ISO'} sheet is ${PAPER_LABELS[other]} (${o.width} × ${o.height} mm): ${label} is ${side(dw, 'wider', 'narrower')} and ${side(dh, 'taller', 'shorter')}, so a layout made for one will not drop onto the other without rescaling.`
  );
  return out;
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
    comparisons: generatedComparisons(size),
  };
}

export function allPaperSizeSlugs(): PaperSize[] {
  return [...PAPER_ORDER];
}
