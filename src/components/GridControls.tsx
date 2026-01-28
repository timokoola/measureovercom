import type { GridSettings } from '../types';

interface GridControlsProps {
  gridSettings: GridSettings;
  onChange: (settings: GridSettings) => void;
}

export function GridControls({ gridSettings, onChange }: GridControlsProps) {
  const updateSetting = <K extends keyof GridSettings>(
    key: K,
    value: GridSettings[K]
  ) => {
    onChange({ ...gridSettings, [key]: value });
  };

  return (
    <div class="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Grid Overlay
      </h3>

      <div class="space-y-4">
        <label class="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={gridSettings.enabled}
            onChange={(e) => updateSetting('enabled', e.currentTarget.checked)}
            class="w-5 h-5 text-burnt-orange focus:ring-burnt-orange rounded border-gray-300 dark:border-gray-600"
          />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
            Show Grid
          </span>
        </label>

        {gridSettings.enabled && (
          <div class="flex flex-col gap-3 pl-8 border-l-2 border-gray-200 dark:border-gray-700">
            <div class="flex flex-col gap-2">
              <div class="flex justify-between items-center">
                <label
                  for="grid-opacity"
                  class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Opacity
                </label>
                <span class="text-sm font-mono text-gray-600 dark:text-gray-400">
                  {gridSettings.opacity}%
                </span>
              </div>
              <input
                id="grid-opacity"
                type="range"
                min="0"
                max="100"
                value={gridSettings.opacity}
                onInput={(e) =>
                  updateSetting('opacity', parseInt(e.currentTarget.value))
                }
                class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-burnt-orange hover:accent-[#b84a00] transition-colors"
                aria-label="Adjust grid opacity"
              />
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-500 pt-1">
              Lines snap to horizontal or vertical when drawing
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
