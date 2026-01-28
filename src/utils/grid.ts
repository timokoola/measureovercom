import type { Point } from '../types';

const SNAP_THRESHOLD = 8; // pixels - increased for better mobile snapping

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
 * Only snaps if the deviation from horizontal/vertical is small
 */
export function snapToAxis(
  start: Point,
  end: Point,
  threshold: number = SNAP_THRESHOLD,
  enabled: boolean = true
): Point {
  if (!enabled) return end;
  
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  // Only snap if there's meaningful movement
  if (absDx < 1 && absDy < 1) return end;

  // Force snapping on mobile (when threshold is very large >= 999)
  const forceSnap = threshold >= 999;

  if (forceSnap) {
    // On mobile: ALWAYS snap to the axis with larger movement
    // This ensures lines are always perfectly horizontal or vertical
    if (absDx >= absDy) {
      // More horizontal movement - snap to horizontal
      return { x: end.x, y: start.y };
    } else {
      // More vertical movement - snap to vertical
      return { x: start.x, y: end.y };
    }
  }

  // Desktop: Only snap if within threshold
  // Check if line is more horizontal than vertical
  if (absDx > absDy) {
    // Check if vertical deviation is small enough to snap to horizontal
    if (absDy < threshold) {
      return { x: end.x, y: start.y };
    }
  } else {
    // Check if horizontal deviation is small enough to snap to vertical
    if (absDx < threshold) {
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
  
  // Detect mobile for thicker grid lines
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = isMobile ? 3 : 1.5; // Much thicker on mobile for visibility

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
