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
      <canvas
        ref={canvasRef}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        class="max-w-full h-auto border border-gray-300 dark:border-gray-600 rounded-lg cursor-crosshair focus:outline-none focus:ring-2 focus:ring-burnt-orange focus:ring-offset-2"
        style={{ touchAction: 'none' }}
        tabIndex={0}
        aria-label="Measurement canvas - draw lines by clicking and dragging. Press Escape to clear all lines."
      />
      {lines.length > 0 && (
        <button
          onClick={clearLines}
          class="absolute top-2 right-2 px-3 py-1 bg-burnt-orange text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-burnt-orange focus:ring-offset-2 text-sm"
          aria-label="Clear all lines (or press Escape)"
        >
          Clear Lines
        </button>
      )}
      <div class="sr-only" aria-live="polite" aria-atomic="true">
        {lines.length === 0
          ? 'No lines drawn'
          : `${lines.length} line${lines.length === 1 ? '' : 's'} drawn`}
      </div>
    </div>
  );
}
