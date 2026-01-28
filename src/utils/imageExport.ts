import type { Line, ImageAdjustments, GridSettings, PaperSize } from '../types';
import { extendLineToEdges } from './lineExtension';
import { drawGrid, calculateGridSpacing } from './grid';
import { applyImageFilters } from './imageFilters';
import { getPaperSize } from './paperSizes';

// Standard DPI for print quality
const EXPORT_DPI = 300;
const MM_TO_INCHES = 25.4;

function calculateExportDimensions(paperSize: PaperSize): { width: number; height: number } {
  const paper = getPaperSize(paperSize);
  // Convert mm to inches, then to pixels at target DPI
  const widthInches = paper.width / MM_TO_INCHES;
  const heightInches = paper.height / MM_TO_INCHES;
  return {
    width: Math.round(widthInches * EXPORT_DPI),
    height: Math.round(heightInches * EXPORT_DPI),
  };
}

export async function exportImageWithLines(
  image: HTMLImageElement,
  lines: Line[],
  adjustments: ImageAdjustments,
  gridSettings: GridSettings,
  paperSize: PaperSize
): Promise<string> {
  // Calculate target dimensions based on paper size
  const targetDimensions = calculateExportDimensions(paperSize);
  
  // Calculate scale factors to maintain aspect ratio
  const imageAspect = image.width / image.height;
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
  
  // Calculate scale factor for lines
  const scaleX = exportWidth / image.width;
  const scaleY = exportHeight / image.height;
  
  // Create a new canvas for export at target paper size
  const canvas = document.createElement('canvas');
  canvas.width = targetDimensions.width;
  canvas.height = targetDimensions.height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');

  // Fill with white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Create a temporary canvas for image processing
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = image.width;
  tempCanvas.height = image.height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) throw new Error('Could not get temp canvas context');
  
  // Draw original image to temp canvas
  tempCtx.drawImage(image, 0, 0);

  // Apply image filters (including rotation and crop) to temp canvas
  if (
    adjustments.grayscale ||
    adjustments.brightness !== 100 ||
    adjustments.contrast !== 100 ||
    adjustments.rotation !== 0 ||
    adjustments.crop.enabled
  ) {
    applyImageFilters(tempCanvas, adjustments, image);
  }

  // Draw scaled image to export canvas
  ctx.drawImage(tempCanvas, offsetX, offsetY, exportWidth, exportHeight);

  // Draw grid if enabled (scaled to export dimensions)
  if (gridSettings.enabled) {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const gridSpacing = calculateGridSpacing(exportWidth, exportHeight);
    // Draw grid only over the image area
    ctx.save();
    ctx.translate(offsetX, offsetY);
    drawGrid(ctx, exportWidth, exportHeight, gridSpacing, gridSettings.opacity, isDarkMode);
    ctx.restore();
  }

  // Draw lines (scaled to match image)
  ctx.strokeStyle = '#0066cc';
  ctx.lineWidth = Math.max(2, 3 * Math.min(scaleX, scaleY)); // Scale line width proportionally
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  lines.forEach((line) => {
    // Scale line coordinates
    const scaledStart = {
      x: line.start.x * scaleX + offsetX,
      y: line.start.y * scaleY + offsetY,
    };
    const scaledEnd = {
      x: line.end.x * scaleX + offsetX,
      y: line.end.y * scaleY + offsetY,
    };
    
    // Extend line to edges of the image area
    const extended = extendLineToEdges(
      { start: scaledStart, end: scaledEnd },
      exportWidth,
      exportHeight
    );
    // Adjust for offset
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
  const intersections = calculateIntersections(lines, image.width, image.height);
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

  return canvas.toDataURL('image/png');
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

export function downloadImage(dataUrl: string, filename: string = 'measureover-export.png'): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
