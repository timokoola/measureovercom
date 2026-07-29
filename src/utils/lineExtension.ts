import type { Line, Point } from '../types';

/**
 * Extend a line to the edges of the canvas
 * Returns the extended line endpoints
 */
export function extendLineToEdges(
  line: Line,
  canvasWidth: number,
  canvasHeight: number
): { start: Point; end: Point } {
  const { start, end } = line;
  
  // Calculate line direction
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  
  // Handle edge case: vertical line (or very close to vertical)
  // Use larger threshold to catch near-vertical lines from snapping
  if (Math.abs(dx) < 0.1) {
    return {
      start: { x: start.x, y: 0 },
      end: { x: end.x, y: canvasHeight },
    };
  }
  
  // Handle edge case: horizontal line (or very close to horizontal)
  // Use larger threshold to catch near-horizontal lines from snapping
  if (Math.abs(dy) < 0.1) {
    return {
      start: { x: 0, y: start.y },
      end: { x: canvasWidth, y: end.y },
    };
  }
  
  // Calculate slope
  const slope = dy / dx;
  const intercept = start.y - slope * start.x;
  
  // Find intersections with canvas edges
  const intersections: Point[] = [];
  
  // Top edge (y = 0)
  const xAtTop = -intercept / slope;
  if (xAtTop >= 0 && xAtTop <= canvasWidth) {
    intersections.push({ x: xAtTop, y: 0 });
  }
  
  // Bottom edge (y = canvasHeight)
  const xAtBottom = (canvasHeight - intercept) / slope;
  if (xAtBottom >= 0 && xAtBottom <= canvasWidth) {
    intersections.push({ x: xAtBottom, y: canvasHeight });
  }
  
  // Left edge (x = 0)
  const yAtLeft = intercept;
  if (yAtLeft >= 0 && yAtLeft <= canvasHeight) {
    intersections.push({ x: 0, y: yAtLeft });
  }
  
  // Right edge (x = canvasWidth)
  const yAtRight = slope * canvasWidth + intercept;
  if (yAtRight >= 0 && yAtRight <= canvasHeight) {
    intersections.push({ x: canvasWidth, y: yAtRight });
  }

  // Pick the two most distant edge points rather than the first two. A diagonal
  // passing exactly through a corner satisfies two edge tests at that corner, so
  // intersections[0] and [1] can be the same point — yielding a zero-length line
  // that then fails hit detection and produces no intersections.
  if (intersections.length >= 2) {
    let best = { start: intersections[0], end: intersections[1] };
    let bestDistSq = -1;
    for (let i = 0; i < intersections.length; i++) {
      for (let j = i + 1; j < intersections.length; j++) {
        const dxe = intersections[j].x - intersections[i].x;
        const dye = intersections[j].y - intersections[i].y;
        const distSq = dxe * dxe + dye * dye;
        if (distSq > bestDistSq) {
          bestDistSq = distSq;
          best = { start: intersections[i], end: intersections[j] };
        }
      }
    }
    if (bestDistSq > 0) return best;
  }

  // Fallback: return original line if we can't extend
  return { start, end };
}
