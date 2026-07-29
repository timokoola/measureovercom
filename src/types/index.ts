export type PaperSize = 'a5' | 'a6' | 'a4' | 'a3' | 'a2' | 'a1' | 'a0' | 'us-letter' | 'us-legal' | 'us-tabloid';

export interface PaperDimensions {
  width: number; // mm
  height: number; // mm
}

export interface Point {
  x: number;
  y: number;
}

export interface Line {
  id: string;
  start: Point;
  end: Point;
}

export interface ImageAdjustments {
  grayscale: boolean;
  brightness: number; // 0-200, 100 = normal
  contrast: number; // 0-200, 100 = normal
  rotation: number; // 0-360 degrees
}

export interface Theme {
  mode: 'light' | 'dark';
  color: 'default' | 'high-contrast';
}

export interface GridSettings {
  enabled: boolean;
  opacity: number; // 0-100
  lineThickness: number; // 1-20 pixels, default 8 on touch devices, 3 on desktop
}

export type CanvasMode = 'cross' | 'line' | 'delete';

export type MeasurementUnit = 'mm' | 'cm' | 'inches';

export interface ProjectData {
  lines: Line[];
  paperSize: PaperSize;
  adjustments: ImageAdjustments;
  gridSettings: GridSettings;
  unit: MeasurementUnit;
  timestamp: number;
}
