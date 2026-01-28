import type { Line, Point } from '../types';

export function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function lineIntersection(l1: Line, l2: Line): Point | null {
  const { start: p1, end: p2 } = l1;
  const { start: p3, end: p4 } = l2;

  const denom = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  if (Math.abs(denom) < 1e-10) {
    return null; // Lines are parallel
  }

  const t =
    ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / denom;
  const u =
    -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / denom;

  // Check if intersection is within both line segments
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return {
      x: p1.x + t * (p2.x - p1.x),
      y: p1.y + t * (p2.y - p1.y),
    };
  }

  return null;
}

export function findAllIntersections(lines: Line[]): Point[] {
  const intersections: Point[] = [];
  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      const intersection = lineIntersection(lines[i], lines[j]);
      if (intersection) {
        intersections.push(intersection);
      }
    }
  }
  return intersections;
}
