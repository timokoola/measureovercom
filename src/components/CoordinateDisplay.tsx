import type { Point, PaperSize } from '../types';
import { convertPixelsToMM } from '../utils/paperSizes';

interface CoordinateDisplayProps {
  points: Point[];
  imageWidth: number;
  imageHeight: number;
  paperSize: PaperSize;
}

export function CoordinateDisplay({
  points,
  imageWidth,
  imageHeight,
  paperSize,
}: CoordinateDisplayProps) {
  if (points.length === 0) {
    return (
      <div class="p-4 bg-broken-white dark:bg-dark-surface rounded-lg">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Coordinates
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Draw lines to see intersection coordinates
        </p>
      </div>
    );
  }

  return (
    <div class="p-4 bg-broken-white dark:bg-dark-surface rounded-lg max-h-64 overflow-y-auto">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Coordinates ({points.length} points)
      </h3>
      <div class="space-y-1">
        {points.map((point, index) => {
          const xMM = convertPixelsToMM(
            point.x,
            imageWidth,
            imageHeight,
            paperSize
          );
          const yMM = convertPixelsToMM(
            point.y,
            imageWidth,
            imageHeight,
            paperSize
          );
          return (
            <div
              key={index}
              class="text-xs font-mono text-gray-700 dark:text-gray-300 py-1"
            >
              Point {index + 1}: ({xMM.toFixed(1)}, {yMM.toFixed(1)}) mm
            </div>
          );
        })}
      </div>
    </div>
  );
}
