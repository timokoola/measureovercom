import { useState, useEffect } from 'preact/hooks';
import { ImageUpload } from './ImageUpload';
import { MeasurementCanvas } from './MeasurementCanvas';
import { PaperSizeSelector } from './PaperSizeSelector';
import { ImageAdjustments } from './ImageAdjustments';
import { CoordinateDisplay } from './CoordinateDisplay';
import { ThemeToggle } from './ThemeToggle';
import type {
  PaperSize,
  ImageAdjustments as ImageAdjustmentsType,
  Point,
} from '../types';
import { getStoredTheme, applyTheme } from '../utils/theme';

export function MeasurementApp() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [paperSize, setPaperSize] = useState<PaperSize>('a5');
  const [adjustments, setAdjustments] = useState<ImageAdjustmentsType>({
    grayscale: false,
    brightness: 100,
    contrast: 100,
  });
  const [intersections, setIntersections] = useState<Point[]>([]);

  useEffect(() => {
    // Apply theme on mount
    const theme = getStoredTheme();
    applyTheme(theme);
  }, []);

  const handleImageLoad = (img: HTMLImageElement) => {
    setImage(img);
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-broken-white via-white to-gray-50 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg">
      <div class="p-4 md:p-8">
        <header class="max-w-7xl mx-auto mb-12">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
                MeasureOver
              </h1>
              <p class="text-base text-gray-600 dark:text-gray-400">
                Professional image measurement tool for drawing guidance
              </p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main class="max-w-7xl mx-auto">
          {!image ? (
            <div class="max-w-3xl mx-auto">
              <ImageUpload onImageLoad={handleImageLoad} />
            </div>
          ) : (
            <div class="space-y-8">
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-6">
                  <MeasurementCanvas
                    image={image}
                    adjustments={adjustments}
                    paperSize={paperSize}
                    onIntersectionsChange={setIntersections}
                  />
                  <button
                    onClick={() => setImage(null)}
                    class="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-dark-surface border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-dark-surface/80 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-burnt-orange focus:ring-offset-2 transition-all duration-200"
                    aria-label="Upload a different image"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Upload Different Image
                  </button>
                </div>

                <div class="space-y-6">
                  <PaperSizeSelector value={paperSize} onChange={setPaperSize} />
                  <ImageAdjustments
                    adjustments={adjustments}
                    onChange={setAdjustments}
                  />
                </div>
              </div>

              {/* Coordinates Section - Prominent */}
              <CoordinateDisplay
                points={intersections}
                imageWidth={image.width}
                imageHeight={image.height}
                paperSize={paperSize}
              />
            </div>
          )}
        </main>

        <footer class="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p class="text-sm text-center text-gray-500 dark:text-gray-500">
            MeasureOver - Fast, lightweight image measurement tool
          </p>
        </footer>
      </div>
    </div>
  );
}
