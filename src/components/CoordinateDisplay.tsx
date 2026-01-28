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
      <div class="bg-white dark:bg-dark-surface rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-800 p-6">
        <div class="flex items-center gap-3 mb-3">
          <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-burnt-orange/10 dark:bg-burnt-orange/20">
            <svg
              class="w-6 h-6 text-burnt-orange"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">
              Measurement Coordinates
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-500">
              Draw lines to see intersection coordinates
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class="bg-white dark:bg-dark-surface rounded-xl shadow-lg border-2 border-burnt-orange/30 dark:border-burnt-orange/30 p-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-burnt-orange/10 dark:bg-burnt-orange/20">
            <svg
              class="w-6 h-6 text-burnt-orange"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">
              Measurement Coordinates
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-500">
              Intersection points in millimeters
            </p>
          </div>
        </div>
        <span class="text-sm font-bold text-burnt-orange bg-burnt-orange/10 dark:bg-burnt-orange/20 px-4 py-2 rounded-lg">
          {points.length} {points.length === 1 ? 'point' : 'points'}
        </span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
              class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-4 hover:border-burnt-orange/50 dark:hover:border-burnt-orange/50 transition-all hover:shadow-md"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Point {index + 1}
                </span>
                <div class="w-2 h-2 bg-burnt-orange rounded-full"></div>
              </div>
              <div class="space-y-1">
                <div class="flex items-baseline gap-2">
                  <span class="text-xs text-gray-500 dark:text-gray-500 font-medium">X:</span>
                  <span class="text-lg font-bold font-mono text-gray-900 dark:text-gray-100">
                    {xMM.toFixed(1)}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-500">mm</span>
                </div>
                <div class="flex items-baseline gap-2">
                  <span class="text-xs text-gray-500 dark:text-gray-500 font-medium">Y:</span>
                  <span class="text-lg font-bold font-mono text-gray-900 dark:text-gray-100">
                    {yMM.toFixed(1)}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-500">mm</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
