import type { PaperSize } from '../types';

interface PaperSizeSelectorProps {
  value: PaperSize;
  onChange: (size: PaperSize) => void;
}

const PAPER_LABELS: Record<PaperSize, string> = {
  a5: 'A5 (148 × 210 mm)',
  a6: 'A6 (105 × 148 mm)',
  a4: 'A4 (210 × 297 mm)',
  'us-letter': 'US Letter (8.5 × 11 in)',
};

export function PaperSizeSelector({ value, onChange }: PaperSizeSelectorProps) {
  return (
    <div class="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
      <label
        for="paper-size"
        class="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3"
      >
        Paper Size
      </label>
      <select
        id="paper-size"
        value={value}
        onChange={(e) => onChange(e.currentTarget.value as PaperSize)}
        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-burnt-orange focus:border-transparent transition-all shadow-sm hover:shadow-md"
        aria-label="Select paper size for coordinate scaling"
        aria-describedby="paper-size-description"
      >
        {(Object.keys(PAPER_LABELS) as PaperSize[]).map((size) => (
          <option key={size} value={size}>
            {PAPER_LABELS[size]}
          </option>
        ))}
      </select>
      <p id="paper-size-description" class="sr-only">
        Coordinates will be scaled to match the selected paper size
      </p>
    </div>
  );
}
