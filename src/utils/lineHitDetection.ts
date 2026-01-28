import type { Line, Point } from '../types';
import { extendLineToEdges } from './lineExtension';

const HIT_THRESHOLD = 15; // pixels - how close you need to be to click a line (increased for easier grabbing)

/**
 * Calculate distance from a point to a line segment
 */
function pointToLineDistance(
  point: Point,
  lineStart: Point,
  lineEnd: Point
): number {
  const A = point.x - lineStart.x;
  const B = point.y - lineStart.y;
  const C = lineEnd.x - lineStart.x;
  const D = lineEnd.y - lineStart.y;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx: number, yy: number;

  if (param < 0) {
    xx = lineStart.x;
    yy = lineStart.y;
  } else if (param > 1) {
    xx = lineEnd.x;
    yy = lineEnd.y;
  } else {
    xx = lineStart.x + param * C;
    yy = lineStart.y + param * D;
  }

  const dx = point.x - xx;
  const dy = point.y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Find which line (if any) was clicked on
 * Returns the line ID and the click offset from the line center
 */
export function findLineAtPoint(
  point: Point,
  lines: Line[],
  canvasWidth: number,
  canvasHeight: number
): { lineId: string; offset: Point } | null {
  for (const line of lines) {
    // Check against the extended line (since that's what's visually displayed)
    const extended = extendLineToEdges(line, canvasWidth, canvasHeight);
    const dx = extended.end.x - extended.start.x;
    const dy = extended.end.y - extended.start.y;
    const lineLength = Math.sqrt(dx * dx + dy * dy);
    
    if (lineLength < 1) continue; // Skip zero-length lines
    
    // Calculate distance to the extended line segment
    const distance = pointToLineDistance(point, extended.start, extended.end);
    
    if (distance <= HIT_THRESHOLD) {
      // Calculate offset from original line center (for movement calculation)
      const centerX = (line.start.x + line.end.x) / 2;
      const centerY = (line.start.y + line.end.y) / 2;
      const offset = {
        x: point.x - centerX,
        y: point.y - centerY,
      };
      return { lineId: line.id, offset };
    }
  }
  
  return null;
}

/**
 * Move a line by a delta amount, maintaining its orientation
 */
export function moveLine(
  line: Line,
  deltaX: number,
  deltaY: number
): Line {
  return {
    ...line,
    start: {
      x: line.start.x + deltaX,
      y: line.start.y + deltaY,
    },
    end: {
      x: line.end.x + deltaX,
      y: line.end.y + deltaY,
    },
  };
}
