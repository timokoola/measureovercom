import { isTouchDevice } from './device';

/**
 * Calculate grid spacing based on image dimensions
 * Returns a reasonable grid spacing (e.g., 5% of smaller dimension)
 */
export function calculateGridSpacing(width: number, height: number): number {
  const minDimension = Math.min(width, height);
  return Math.max(20, Math.floor(minDimension / 20)); // At least 20px, or ~5% of smaller dimension
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
  if (spacing <= 0) return;

  ctx.save();
  // Honour the requested opacity. This used to be floored at 0.15/0.2, which
  // made the slider lie: every value from 0% to 20% rendered identically, and
  // "0%" still drew a clearly visible grid.
  const alpha = Math.min(1, Math.max(0, opacity / 100));
  const gridColor = isDarkMode ? `rgba(255, 255, 255, ${alpha})` : `rgba(0, 0, 0, ${alpha})`;

  ctx.strokeStyle = gridColor;
  ctx.lineWidth = isTouchDevice() ? 3 : 1.5; // Thicker on touch screens for visibility

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
