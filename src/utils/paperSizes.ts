import type { PaperDimensions, PaperSize } from '../types';

export const PAPER_SIZES: Record<PaperSize, PaperDimensions> = {
  a6: { width: 105, height: 148 }, // mm
  a5: { width: 148, height: 210 }, // mm
  a4: { width: 210, height: 297 }, // mm
  a3: { width: 297, height: 420 }, // mm
  a2: { width: 420, height: 594 }, // mm
  a1: { width: 594, height: 841 }, // mm
  a0: { width: 841, height: 1189 }, // mm
  'us-letter': { width: 215.9, height: 279.4 }, // mm
  'us-legal': { width: 215.9, height: 355.6 }, // mm
  'us-tabloid': { width: 279.4, height: 431.8 }, // mm
};

export function getPaperSize(size: PaperSize): PaperDimensions {
  return PAPER_SIZES[size];
}

export function convertPixelsToMM(
  pixels: number,
  imageWidth: number,
  imageHeight: number,
  paperSize: PaperSize
): number {
  const paper = getPaperSize(paperSize);
  // Assume image fills the paper size proportionally
  const scaleX = paper.width / imageWidth;
  const scaleY = paper.height / imageHeight;
  const scale = Math.min(scaleX, scaleY); // Use the smaller scale to maintain aspect ratio
  return pixels * scale;
}

export function convertMMToPixels(
  mm: number,
  imageWidth: number,
  imageHeight: number,
  paperSize: PaperSize
): number {
  const paper = getPaperSize(paperSize);
  const scaleX = paper.width / imageWidth;
  const scaleY = paper.height / imageHeight;
  const scale = Math.min(scaleX, scaleY);
  return mm / scale;
}
