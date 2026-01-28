import { useRef, useCallback } from 'preact/hooks';
import type { ImageAdjustments } from '../types';

interface ImageAdjustmentsProps {
  adjustments: ImageAdjustments;
  onChange: (adjustments: ImageAdjustments) => void;
}

export function ImageAdjustments({
  adjustments,
  onChange,
}: ImageAdjustmentsProps) {
  const timeoutRef = useRef<number | null>(null);

  const updateAdjustment = useCallback(
    <K extends keyof ImageAdjustments>(
      key: K,
      value: ImageAdjustments[K],
      immediate = false
    ) => {
      const newAdjustments = { ...adjustments, [key]: value };
      
      if (immediate || key === 'grayscale') {
        onChange(newAdjustments);
      } else {
        // Debounce slider inputs for better performance
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
          onChange(newAdjustments);
        }, 100);
      }
    },
    [adjustments, onChange]
  );

  return (
    <div class="flex flex-col gap-4 p-4 bg-broken-white dark:bg-dark-surface rounded-lg">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
        Image Adjustments
      </h3>

      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={adjustments.grayscale}
          onChange={(e) =>
            updateAdjustment('grayscale', e.currentTarget.checked)
          }
          class="w-4 h-4 text-burnt-orange focus:ring-burnt-orange rounded"
        />
        <span class="text-sm text-gray-700 dark:text-gray-300">
          Grayscale
        </span>
      </label>

      <div class="flex flex-col gap-2">
        <label
          for="brightness"
          class="text-sm text-gray-700 dark:text-gray-300"
        >
          Brightness: {adjustments.brightness}%
        </label>
        <input
          id="brightness"
          type="range"
          min="0"
          max="200"
          value={adjustments.brightness}
          onInput={(e) =>
            updateAdjustment('brightness', parseInt(e.currentTarget.value), false)
          }
          class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-burnt-orange"
          aria-label="Adjust brightness"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label
          for="contrast"
          class="text-sm text-gray-700 dark:text-gray-300"
        >
          Contrast: {adjustments.contrast}%
        </label>
        <input
          id="contrast"
          type="range"
          min="0"
          max="200"
          value={adjustments.contrast}
          onInput={(e) =>
            updateAdjustment('contrast', parseInt(e.currentTarget.value), false)
          }
          class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-burnt-orange"
          aria-label="Adjust contrast"
        />
      </div>
    </div>
  );
}
