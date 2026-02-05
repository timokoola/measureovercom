import type { PaperSize } from '../types';
import { t, type Translations } from '../utils/i18n';

interface PaperSizeSelectorProps {
  value: PaperSize;
  onChange: (size: PaperSize) => void;
}

const PAPER_KEYS: Record<PaperSize, keyof Translations> = {
  a6: 'a6',
  a5: 'a5',
  a4: 'a4',
  a3: 'a3',
  a2: 'a2',
  a1: 'a1',
  a0: 'a0',
  'us-letter': 'usLetter',
  'us-legal': 'usLegal',
  'us-tabloid': 'usTabloid',
};

export function PaperSizeSelector({ value, onChange }: PaperSizeSelectorProps) {
  return (
    <div class="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
      <label
        for="paper-size"
        class="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3"
      >
        {t('paperSize')}
      </label>
      <select
        id="paper-size"
        value={value}
        onChange={(e) => onChange(e.currentTarget.value as PaperSize)}
        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-burnt-orange focus:border-transparent transition-all shadow-sm hover:shadow-md"
        aria-label={t('paperSizeAria')}
        aria-describedby="paper-size-description"
      >
        {(Object.keys(PAPER_KEYS) as PaperSize[]).map((size) => (
          <option key={size} value={size}>
            {t(PAPER_KEYS[size])}
          </option>
        ))}
      </select>
      <p id="paper-size-description" class="sr-only">
        {t('paperSizeDescription')}
      </p>
    </div>
  );
}
