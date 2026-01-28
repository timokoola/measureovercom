import type { ImageAdjustments } from '../types';

export function applyImageFilters(
  canvas: HTMLCanvasElement,
  adjustments: ImageAdjustments,
  sourceImage?: HTMLImageElement
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Always draw the source image first if provided (needed for pixel-level filters)
  if (sourceImage) {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Handle rotation and crop transformations
    if (adjustments.rotation !== 0 && !adjustments.crop.enabled) {
      // Simple rotation - draw rotated image
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      ctx.translate(centerX, centerY);
      ctx.rotate((adjustments.rotation * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);
      ctx.drawImage(sourceImage, 0, 0);
    } else if (adjustments.crop.enabled) {
      // Crop - draw cropped portion
      const cropX = (adjustments.crop.x / 100) * sourceImage.width;
      const cropY = (adjustments.crop.y / 100) * sourceImage.height;
      const cropW = (adjustments.crop.width / 100) * sourceImage.width;
      const cropH = (adjustments.crop.height / 100) * sourceImage.height;
      ctx.drawImage(sourceImage, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);
    } else {
      // Normal draw - no transformations
      ctx.drawImage(sourceImage, 0, 0);
    }
    
    ctx.restore();
  }

  // Apply pixel-level filters (grayscale, brightness, contrast)
  if (
    adjustments.grayscale ||
    adjustments.brightness !== 100 ||
    adjustments.contrast !== 100
  ) {
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
}
