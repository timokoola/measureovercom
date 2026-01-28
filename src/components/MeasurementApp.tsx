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
    <div class="min-h-screen p-4 md:p-8">
      <header class="max-w-7xl mx-auto mb-8">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            MeasureOver
          </h1>
          <ThemeToggle />
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Upload an image and draw measurement lines to guide your drawing
        </p>
      </header>

      <main class="max-w-7xl mx-auto">
        {!image ? (
          <div class="max-w-2xl mx-auto">
            <ImageUpload onImageLoad={handleImageLoad} />
          </div>
        ) : (
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-6">
              <MeasurementCanvas
                image={image}
                adjustments={adjustments}
                paperSize={paperSize}
                onIntersectionsChange={setIntersections}
              />
              <button
                onClick={() => setImage(null)}
                class="px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
                aria-label="Upload a different image"
              >
                Upload Different Image
              </button>
            </div>

            <div class="space-y-6">
              <PaperSizeSelector value={paperSize} onChange={setPaperSize} />
              <ImageAdjustments
                adjustments={adjustments}
                onChange={setAdjustments}
              />
              <CoordinateDisplay
                points={intersections}
                imageWidth={image.width}
                imageHeight={image.height}
                paperSize={paperSize}
              />
            </div>
          </div>
        )}
      </main>

      <footer class="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-300 dark:border-gray-700">
        <p class="text-sm text-center text-gray-600 dark:text-gray-400">
          MeasureOver - Fast, lightweight image measurement tool
        </p>
      </footer>
    </div>
  );
}
