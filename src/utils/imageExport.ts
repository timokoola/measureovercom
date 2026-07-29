import type { Line, ImageAdjustments, GridSettings, PaperSize } from '../types';
import { extendLineToEdges } from './lineExtension';
import { drawGrid, calculateGridSpacing } from './grid';
import { applyImageFilters, needsFilters, getRotatedSize } from './imageFilters';
import { getPaperSize } from './paperSizes';
import { isTouchDevice } from './device';

// Standard DPI for print quality
const EXPORT_DPI = 300;
const MM_TO_INCHES = 25.4;

/**
 * Browsers cap canvas area. Past the cap `drawImage` silently no-ops and
 * `toBlob` yields null or an empty file, so the user downloads a blank PNG with
 * no error at all. A0 at 300 DPI is 9933x14043 ~= 139 megapixels (~556 MB RGBA),
 * far beyond every mobile limit. Stay under the cap and drop DPI instead.
 */
const MAX_EXPORT_PIXELS_TOUCH = 16_777_216; // ~16.7 MP, the historical iOS Safari ceiling
const MAX_EXPORT_PIXELS_DESKTOP = 67_108_864; // ~67 MP

export function getMaxExportPixels(): number {
  return isTouchDevice() ? MAX_EXPORT_PIXELS_TOUCH : MAX_EXPORT_PIXELS_DESKTOP;
}

/**
 * Target pixel size for a sheet, reduced below 300 DPI only when the full-DPI
 * canvas would exceed what this browser can actually rasterise.
 */
function calculateExportDimensions(paperSize: PaperSize): {
  width: number;
  height: number;
  dpi: number;
} {
  const paper = getPaperSize(paperSize);
  const widthInches = paper.width / MM_TO_INCHES;
  const heightInches = paper.height / MM_TO_INCHES;

  const maxPixels = getMaxExportPixels();
  const fullPixels = widthInches * EXPORT_DPI * heightInches * EXPORT_DPI;
  // Area scales with dpi^2, so the DPI factor is the square root.
  const dpi =
    fullPixels > maxPixels
      ? Math.max(72, Math.floor(EXPORT_DPI * Math.sqrt(maxPixels / fullPixels)))
      : EXPORT_DPI;

  return {
    width: Math.round(widthInches * dpi),
    height: Math.round(heightInches * dpi),
    dpi,
  };
}

export async function exportImageWithLines(
  image: HTMLImageElement,
  lines: Line[],
  adjustments: ImageAdjustments,
  gridSettings: GridSettings,
  paperSize: PaperSize
): Promise<Blob> {
  // Calculate target dimensions based on paper size
  const targetDimensions = calculateExportDimensions(paperSize);

  // Rotation changes the drawn footprint, so the aspect fit must use the
  // rotated bounding box — otherwise a rotated image is squashed and its
  // lines no longer line up with the pixels.
  const sourceW = image.naturalWidth || image.width;
  const sourceH = image.naturalHeight || image.height;
  const rotated = getRotatedSize(sourceW, sourceH, adjustments.rotation);

  // Calculate scale factors to maintain aspect ratio
  const imageAspect = rotated.width / rotated.height;
  const targetAspect = targetDimensions.width / targetDimensions.height;
  
  let exportWidth: number;
  let exportHeight: number;
  let offsetX = 0;
  let offsetY = 0;
  
  if (imageAspect > targetAspect) {
    // Image is wider - fit to width
    exportWidth = targetDimensions.width;
    exportHeight = Math.round(targetDimensions.width / imageAspect);
    offsetY = (targetDimensions.height - exportHeight) / 2;
  } else {
    // Image is taller - fit to height
    exportHeight = targetDimensions.height;
    exportWidth = Math.round(targetDimensions.height * imageAspect);
    offsetX = (targetDimensions.width - exportWidth) / 2;
  }
  
  // Scale factors map canvas-space line coordinates onto the exported sheet.
  // Lines live in the rotated canvas space, so scale against that, not the raw image.
  const scaleX = exportWidth / rotated.width;
  const scaleY = exportHeight / rotated.height;

  // Create a new canvas for export at target paper size
  const canvas = document.createElement('canvas');
  canvas.width = targetDimensions.width;
  canvas.height = targetDimensions.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context');

  // Fill with white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Temp canvas is sized to the rotated bounding box so rotation isn't clipped.
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = rotated.width;
  tempCanvas.height = rotated.height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) throw new Error('Could not get temp canvas context');

  if (needsFilters(adjustments)) {
    applyImageFilters(tempCanvas, adjustments, image);
  } else {
    tempCtx.drawImage(image, 0, 0);
  }

  // Draw scaled image to export canvas
  ctx.drawImage(tempCanvas, offsetX, offsetY, exportWidth, exportHeight);

  // Draw grid if enabled (scaled to match original grid)
  if (gridSettings.enabled) {
    const isDarkMode = document.documentElement.classList.contains('dark');
    // Calculate grid spacing based on original image dimensions
    const originalGridSpacing = calculateGridSpacing(rotated.width, rotated.height);
    // Scale the grid spacing proportionally - use average scale to maintain grid appearance
    // This ensures the grid lines align with the scaled image
    const scaleFactor = (scaleX + scaleY) / 2;
    const scaledGridSpacing = originalGridSpacing * scaleFactor;
    // Draw grid only over the image area
    ctx.save();
    ctx.translate(offsetX, offsetY);
    drawGrid(ctx, exportWidth, exportHeight, scaledGridSpacing, gridSettings.opacity, isDarkMode);
    ctx.restore();
  }

  // Draw lines (scaled to match image)
  // Use gridSettings.lineThickness if available, otherwise default
  const baseThickness = gridSettings.lineThickness || 3;
  ctx.strokeStyle = '#0066cc';
  ctx.lineWidth = Math.max(2, baseThickness * Math.min(scaleX, scaleY)); // Scale line width proportionally
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  lines.forEach((line) => {
    // Scale line coordinates into image-area space (no offset yet —
    // extendLineToEdges works in a 0,0..exportWidth,exportHeight box).
    const scaledStart = {
      x: line.start.x * scaleX,
      y: line.start.y * scaleY,
    };
    const scaledEnd = {
      x: line.end.x * scaleX,
      y: line.end.y * scaleY,
    };

    // Extend line to edges of the image area
    const extended = extendLineToEdges(
      { ...line, start: scaledStart, end: scaledEnd },
      exportWidth,
      exportHeight
    );
    // Shift into page space — applied exactly once, here.
    const finalStart = {
      x: extended.start.x + offsetX,
      y: extended.start.y + offsetY,
    };
    const finalEnd = {
      x: extended.end.x + offsetX,
      y: extended.end.y + offsetY,
    };
    
    ctx.beginPath();
    ctx.moveTo(finalStart.x, finalStart.y);
    ctx.lineTo(finalEnd.x, finalEnd.y);
    ctx.stroke();
  });

  // Draw intersection points (scaled)
  const intersections = calculateIntersections(lines, rotated.width, rotated.height);
  const pointRadius = Math.max(3, 4 * Math.min(scaleX, scaleY));
  intersections.forEach((point) => {
    const scaledX = point.x * scaleX + offsetX;
    const scaledY = point.y * scaleY + offsetY;
    
    // White outline
    ctx.beginPath();
    ctx.arc(scaledX, scaledY, pointRadius + 2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    // Blue center
    ctx.beginPath();
    ctx.arc(scaledX, scaledY, pointRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0066cc';
    ctx.fill();
  });

  // toBlob rather than toDataURL: no base64 copy in memory, and a null/empty
  // result tells us the canvas exceeded the browser's limit instead of silently
  // handing the user a blank download.
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/png');
  });

  if (!blob || blob.size === 0) {
    throw new Error(
      `Export failed: the browser could not render a ${canvas.width}x${canvas.height} canvas. Try a smaller paper size.`
    );
  }

  return blob;
}

import { findAllIntersections } from './math';

function calculateIntersections(lines: Line[], width: number, height: number): Array<{ x: number; y: number }> {
  const extendedLines = lines.map((line) => {
    const extended = extendLineToEdges(line, width, height);
    return {
      id: line.id,
      start: extended.start,
      end: extended.end,
    };
  });
  return findAllIntersections(extendedLines);
}

export function downloadImage(blob: Blob, filename: string = 'measureover-export.png'): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
  // Revoke on the next tick — immediate revocation can cancel the download in
  // some browsers, and never revoking retains the whole blob for the session.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
