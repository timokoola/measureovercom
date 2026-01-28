import type { Point } from '../types';

const SNAP_THRESHOLD = 10; // pixels

/**
 * Calculate grid spacing based on image dimensions
 * Returns a reasonable grid spacing (e.g., 10% of smaller dimension)
 */
export function calculateGridSpacing(width: number, height: number): number {
  const minDimension = Math.min(width, height);
  return Math.max(20, Math.floor(minDimension / 20)); // At least 20px, or ~5% of smaller dimension
}

/**
 * Snap a point to the nearest grid line
 */
export function snapToGrid(point: Point, gridSpacing: number): Point {
  return {
    x: Math.round(point.x / gridSpacing) * gridSpacing,
    y: Math.round(point.y / gridSpacing) * gridSpacing,
  };
}

/**
 * Snap a line to horizontal or vertical if it's close enough
 * Returns the snapped end point
 */
export function snapToAxis(
  start: Point,
  end: Point,
  threshold: number = SNAP_THRESHOLD
): Point {
  const dx = Math.abs(end.x - start.x);
  const dy = Math.abs(end.y - start.y);

  // If line is more horizontal than vertical
  if (dx > dy) {
    // Check if we're close enough to horizontal
    if (Math.abs(end.y - start.y) < threshold) {
      return { x: end.x, y: start.y };
    }
  } else {
    // Check if we're close enough to vertical
    if (Math.abs(end.x - start.x) < threshold) {
      return { x: start.x, y: end.y };
    }
  }

  return end;
}

/**
 * Draw grid on canvas with better contrast
 */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spacing: number,
  opacity: number,
  isDarkMode: boolean = false
): void {
  ctx.save();
  // Use high-contrast colors: dark gray/black for light mode, light gray/white for dark mode
  const gridColor = isDarkMode 
    ? `rgba(255, 255, 255, ${Math.max(0.15, opacity / 100)})` // White for dark mode, minimum 15% opacity
    : `rgba(0, 0, 0, ${Math.max(0.2, opacity / 100)})`; // Black for light mode, minimum 20% opacity
  
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1.5; // Slightly thicker for better visibility

  // Draw vertical lines
  for (let x = 0; x <= width; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Draw horizontal lines
  for (let y = 0; y <= height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.restore();
}
