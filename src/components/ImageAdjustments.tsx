import { useRef, useCallback, useEffect } from 'preact/hooks';
import type { ImageAdjustments } from '../types';
import { t } from '../utils/i18n';

interface ImageAdjustmentsProps {
  adjustments: ImageAdjustments;
  onChange: (adjustments: ImageAdjustments) => void;
}

export function ImageAdjustments({
  adjustments,
  onChange,
}: ImageAdjustmentsProps) {
  const timeoutRef = useRef<number | null>(null);
  // The authoritative in-flight value. Building each update from the
  // `adjustments` prop meant a change made while a debounced one was pending
  // was built from pre-pending state: moving brightness then contrast within
  // 100 ms silently dropped the brightness change, and toggling grayscale
  // mid-drag fired an immediate update that the stale pending timer then
  // reverted.
  const latestRef = useRef<ImageAdjustments>(adjustments);

  // Only accept the prop as truth when nothing is pending, otherwise the
  // parent's not-yet-updated value would clobber the in-flight edit.
  useEffect(() => {
    if (timeoutRef.current === null) {
      latestRef.current = adjustments;
    }
  }, [adjustments]);

  // A pending commit must not fire after unmount (e.g. clicking "New image"
  // mid-drag).
  useEffect(
    () => () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    },
    []
  );

  const updateAdjustment = useCallback(
    <K extends keyof ImageAdjustments>(
      key: K,
      value: ImageAdjustments[K],
      immediate = false
    ) => {
      const newAdjustments = { ...latestRef.current, [key]: value };
      latestRef.current = newAdjustments;

      // Any update supersedes a pending one.
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (immediate || key === 'grayscale') {
        onChange(newAdjustments);
      } else {
        // Debounce slider inputs for better performance
        timeoutRef.current = window.setTimeout(() => {
          timeoutRef.current = null;
          onChange(latestRef.current);
        }, 100);
      }
    },
    [onChange]
  );

  return (
    <div class="bg-white dark:bg-dark-surface rounded-xl shadow-xs border border-gray-200 dark:border-gray-800 p-5">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {t('imageAdjustments')}
      </h3>

      <div class="space-y-5">
        <label class="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={adjustments.grayscale}
            onChange={(e) =>
              updateAdjustment('grayscale', e.currentTarget.checked)
            }
            class="w-5 h-5 text-burnt-orange focus:ring-burnt-orange rounded-sm border-gray-300 dark:border-gray-600"
          />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
            {t('grayscale')}
          </span>
        </label>

        <div class="flex flex-col gap-3">
          <div class="flex justify-between items-center">
            <label
              for="brightness"
              class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t('brightness')}
            </label>
            <span class="text-sm font-mono text-gray-600 dark:text-gray-400">
              {adjustments.brightness}%
            </span>
          </div>
          <input
            id="brightness"
            type="range"
            min="0"
            max="200"
            value={adjustments.brightness}
            onInput={(e) =>
              updateAdjustment('brightness', parseInt(e.currentTarget.value), false)
            }
            class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-burnt-orange hover:accent-burnt-orange-hover transition-colors"
            aria-label={t('brightnessAria')}
          />
        </div>

        <div class="flex flex-col gap-3">
          <div class="flex justify-between items-center">
            <label
              for="contrast"
              class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t('contrast')}
            </label>
            <span class="text-sm font-mono text-gray-600 dark:text-gray-400">
              {adjustments.contrast}%
            </span>
          </div>
          <input
            id="contrast"
            type="range"
            min="0"
            max="200"
            value={adjustments.contrast}
            onInput={(e) =>
              updateAdjustment('contrast', parseInt(e.currentTarget.value), false)
            }
            class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-burnt-orange hover:accent-burnt-orange-hover transition-colors"
            aria-label={t('contrastAria')}
          />
        </div>

        <div class="flex flex-col gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <label
              for="rotation"
              class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t('rotation')}
            </label>
            <span class="text-sm font-mono text-gray-600 dark:text-gray-400">
              {adjustments.rotation}°
            </span>
          </div>
          <input
            id="rotation"
            type="range"
            min="0"
            max="360"
            step="1"
            value={adjustments.rotation}
            onInput={(e) =>
              updateAdjustment('rotation', parseInt(e.currentTarget.value), false)
            }
            class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-burnt-orange hover:accent-burnt-orange-hover transition-colors"
            aria-label={t('rotationAria')}
          />
          <div class="flex gap-2">
            <button
              onClick={() => updateAdjustment('rotation', (adjustments.rotation - 90 + 360) % 360, true)}
              class="flex-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label={t('rotateCcwAria')}
            >
              ↺ -90°
            </button>
            <button
              onClick={() => updateAdjustment('rotation', (adjustments.rotation + 90) % 360, true)}
              class="flex-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label={t('rotateCwAria')}
            >
              ↻ +90°
            </button>
            <button
              onClick={() => updateAdjustment('rotation', 0, true)}
              class="flex-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label={t('resetRotationAria')}
            >
              {t('reset')}
            </button>
          </div>
        </div>

        {/*
          The crop control was removed. It only ever exposed an "enable"
          checkbox whose defaults (0,0,100%,100%) redrew the identical full
          frame, so it did nothing — and had it ever produced real crop values,
          convertPixelsToMM still measured against the full image, which would
          have made every printed coordinate wrong. Reinstate it together with
          crop-aware coordinate maths, not before.
        */}
      </div>
    </div>
  );
}
