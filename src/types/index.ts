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
  crop: {
    enabled: boolean;
    x: number; // 0-100, percentage
    y: number; // 0-100, percentage
    width: number; // 0-100, percentage
    height: number; // 0-100, percentage
  };
}

export interface Theme {
  mode: 'light' | 'dark';
  color: 'default' | 'high-contrast';
}

export interface GridSettings {
  enabled: boolean;
  opacity: number; // 0-100
  spacing: number; // pixels between grid lines
}

export type CanvasMode = 'draw' | 'move' | 'delete';

export type MeasurementUnit = 'mm' | 'cm' | 'inches';

export interface ProjectData {
  lines: Line[];
  paperSize: PaperSize;
  adjustments: ImageAdjustments;
  gridSettings: GridSettings;
  unit: MeasurementUnit;
  timestamp: number;
}
