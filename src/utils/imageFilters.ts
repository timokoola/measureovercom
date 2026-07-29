import type { ImageAdjustments } from '../types';

/** True when any adjustment actually changes pixels — worth the filter pass. */
export function needsFilters(adjustments: ImageAdjustments): boolean {
  return (
    adjustments.grayscale ||
    adjustments.brightness !== 100 ||
    adjustments.contrast !== 100 ||
    adjustments.rotation !== 0
  );
}

/**
 * Size of the axis-aligned bounding box of a w x h rectangle rotated by `degrees`.
 *
 * Rotation used to be drawn into a canvas that kept the *unrotated* dimensions,
 * so a 90-degree turn of any non-square image drew H x W content into a W x H
 * canvas: the overflow was clipped and blank wedges appeared in the corners.
 * Callers must size their canvas with this before calling applyImageFilters.
 */
export function getRotatedSize(
  width: number,
  height: number,
  degrees: number
): { width: number; height: number } {
  if (!Number.isFinite(degrees) || degrees % 360 === 0) {
    return { width, height };
  }
  const rad = (degrees * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));
  return {
    width: Math.max(1, Math.round(width * cos + height * sin)),
    height: Math.max(1, Math.round(width * sin + height * cos)),
  };
}

export function applyImageFilters(
  canvas: HTMLCanvasElement,
  adjustments: ImageAdjustments,
  sourceImage?: HTMLImageElement
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const rotation = Number.isFinite(adjustments.rotation) ? adjustments.rotation : 0;

  if (sourceImage) {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (rotation % 360 !== 0) {
      // Rotate about the centre of the (already bounding-box-sized) canvas and
      // draw the image centred, so nothing is clipped at any angle.
      const srcW = sourceImage.naturalWidth || sourceImage.width;
      const srcH = sourceImage.naturalHeight || sourceImage.height;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(sourceImage, -srcW / 2, -srcH / 2);
    } else {
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
