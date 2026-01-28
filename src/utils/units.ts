import type { MeasurementUnit } from '../types';

export function convertMMToUnit(value: number, unit: MeasurementUnit): number {
  switch (unit) {
    case 'mm':
      return value;
    case 'cm':
      return value / 10;
    case 'inches':
      return value / 25.4;
    default:
      return value;
  }
}

export function getUnitLabel(unit: MeasurementUnit): string {
  switch (unit) {
    case 'mm':
      return 'mm';
    case 'cm':
      return 'cm';
    case 'inches':
      return 'in';
    default:
      return 'mm';
  }
}

export function formatValue(value: number, unit: MeasurementUnit, decimals: number = 1): string {
  const converted = convertMMToUnit(value, unit);
  return `${converted.toFixed(decimals)} ${getUnitLabel(unit)}`;
}
