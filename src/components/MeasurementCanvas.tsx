import { useEffect, useRef, useState } from 'preact/hooks';
import type { Line, Point, ImageAdjustments, PaperSize } from '../types';
import { findAllIntersections } from '../utils/math';
import { applyImageFilters } from '../utils/imageFilters';

interface MeasurementCanvasProps {
  image: HTMLImageElement | null;
  adjustments: ImageAdjustments;
  paperSize: PaperSize;
  onIntersectionsChange: (points: Point[]) => void;
}

export function MeasurementCanvas({
  image,
  adjustments,
  paperSize,
  onIntersectionsChange,
}: MeasurementCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<{ start: Point; end: Point } | null>(
    null
  );
  const [mousePos, setMousePos] = useState<Point | null>(null);

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

    // Apply filters if needed
    if (
      adjustments.grayscale ||
      adjustments.brightness !== 100 ||
      adjustments.contrast !== 100
    ) {
      applyImageFilters(canvas, adjustments);
    }

    // Draw lines
    ctx.strokeStyle = '#cc5500';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    lines.forEach((line) => {
      ctx.beginPath();
      ctx.moveTo(line.start.x, line.start.y);
      ctx.lineTo(line.end.x, line.end.y);
      ctx.stroke();
    });

    // Draw current line being drawn
    if (currentLine && mousePos) {
      ctx.beginPath();
      ctx.moveTo(currentLine.start.x, currentLine.start.y);
      ctx.strokeStyle = '#cc5500';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw intersection points
    const intersections = findAllIntersections(lines);
    ctx.fillStyle = '#cc5500';
    intersections.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Notify parent of intersections
    onIntersectionsChange(intersections);
  }, [image, lines, adjustments, currentLine, mousePos, onIntersectionsChange]);

  const getMousePos = (e: MouseEvent | TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handleStart = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const pos = getMousePos(e);
    setIsDrawing(true);
    setCurrentLine({ start: pos, end: pos });
    setMousePos(pos);
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    const pos = getMousePos(e);
    setMousePos(pos);
    if (isDrawing && currentLine) {
      e.preventDefault();
      setCurrentLine({ start: currentLine.start, end: pos });
    }
  };

  const handleEnd = (e: MouseEvent | TouchEvent) => {
    if (!isDrawing || !currentLine) return;
    e.preventDefault();
    const pos = getMousePos(e);
    // Only create line if it has meaningful length
    const dist = Math.sqrt(
      Math.pow(pos.x - currentLine.start.x, 2) +
        Math.pow(pos.y - currentLine.start.y, 2)
    );
    if (dist > 5) {
      const newLine: Line = {
        id: Date.now().toString(),
        start: currentLine.start,
        end: pos,
      };
      setLines([...lines, newLine]);
    }
    setIsDrawing(false);
    setCurrentLine(null);
    setMousePos(null);
  };

  const clearLines = () => {
    setLines([]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Clear lines with Escape key
      if (e.key === 'Escape' && lines.length > 0) {
        clearLines();
      }
      // Cancel drawing with Escape
      if (e.key === 'Escape' && isDrawing) {
        setIsDrawing(false);
        setCurrentLine(null);
        setMousePos(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lines.length, isDrawing]);

  return (
    <div class="relative" role="region" aria-label="Measurement canvas">
      {/* Drawing Toolbar */}
      <div class="mb-4 bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-burnt-orange/10 dark:bg-burnt-orange/20">
              <svg
                class="w-5 h-5 text-burnt-orange"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Drawing Tool
              </h3>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                Click and drag on the image to draw measurement lines
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            {lines.length > 0 && (
              <>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {lines.length} {lines.length === 1 ? 'line' : 'lines'}
                </span>
                <button
                  onClick={clearLines}
                  class="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-dark-surface border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-dark-surface/80 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm font-medium transition-all"
                  aria-label="Clear all lines"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Clear All
                </button>
              </>
            )}
            {isDrawing && (
              <div class="flex items-center gap-2 px-3 py-1.5 bg-burnt-orange/10 dark:bg-burnt-orange/20 rounded-md">
                <div class="w-2 h-2 bg-burnt-orange rounded-full animate-pulse"></div>
                <span class="text-xs font-medium text-burnt-orange">Drawing...</span>
              </div>
            )}
          </div>
        </div>
        {lines.length === 0 && (
          <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
            <div class="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
              <svg
                class="w-4 h-4 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p class="font-medium mb-1">How to draw:</p>
                <ul class="list-disc list-inside space-y-0.5 ml-2">
                  <li>Click and hold on the image where you want to start a line</li>
                  <li>Drag to where you want the line to end</li>
                  <li>Release to complete the line</li>
                  <li>Intersection points will appear automatically</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Canvas Container */}
      <div class="bg-white dark:bg-dark-surface rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-800 p-4 overflow-hidden hover:border-burnt-orange/50 dark:hover:border-burnt-orange/50 transition-colors">
        <canvas
          ref={canvasRef}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          class="max-w-full h-auto rounded-lg cursor-crosshair focus:outline-none focus:ring-2 focus:ring-burnt-orange focus:ring-offset-2 transition-all"
          style={{ touchAction: 'none' }}
          tabIndex={0}
          aria-label="Measurement canvas - draw lines by clicking and dragging. Press Escape to clear all lines."
        />
      </div>
      <div class="sr-only" aria-live="polite" aria-atomic="true">
        {lines.length === 0
          ? 'No lines drawn'
          : `${lines.length} line${lines.length === 1 ? '' : 's'} drawn`}
      </div>
    </div>
  );
}
