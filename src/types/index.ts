export type PaperSize = 'a5' | 'a6' | 'a4' | 'us-letter';

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
