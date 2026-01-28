import type { ImageAdjustments } from '../types';

export function applyImageFilters(
  canvas: HTMLCanvasElement,
  adjustments: ImageAdjustments
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Grayscale
    if (adjustments.grayscale) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = g = b = gray;
    }

    // Brightness
    const brightnessFactor = adjustments.brightness / 100;
    r = Math.min(255, Math.max(0, r * brightnessFactor));
    g = Math.min(255, Math.max(0, g * brightnessFactor));
    b = Math.min(255, Math.max(0, b * brightnessFactor));

    // Contrast
    const contrastFactor = (adjustments.contrast - 100) / 100;
    const contrastAdjust = 128 * contrastFactor;
    r = Math.min(255, Math.max(0, r + contrastAdjust));
    g = Math.min(255, Math.max(0, g + contrastAdjust));
    b = Math.min(255, Math.max(0, b + contrastAdjust));

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }

  ctx.putImageData(imageData, 0, 0);
}
