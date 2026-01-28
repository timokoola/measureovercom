import type { MeasurementUnit } from '../types';

interface UnitSelectorProps {
  value: MeasurementUnit;
  onChange: (unit: MeasurementUnit) => void;
}

export function UnitSelector({ value, onChange }: UnitSelectorProps) {
  return (
    <div class="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
      <label
        for="measurement-unit"
        class="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3"
      >
        Measurement Unit
      </label>
      <select
        id="measurement-unit"
        value={value}
        onChange={(e) => onChange(e.currentTarget.value as MeasurementUnit)}
        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-burnt-orange focus:border-transparent transition-all shadow-sm hover:shadow-md"
        aria-label="Select measurement unit"
      >
        <option value="mm">Millimeters (mm)</option>
        <option value="cm">Centimeters (cm)</option>
        <option value="inches">Inches (in)</option>
      </select>
    </div>
  );
}
