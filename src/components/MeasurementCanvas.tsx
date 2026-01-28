import { useEffect, useRef, useState } from 'preact/hooks';
import type { Line, Point, ImageAdjustments, PaperSize, GridSettings } from '../types';
import { findAllIntersections } from '../utils/math';
import { applyImageFilters } from '../utils/imageFilters';
import { drawGrid, snapToAxis, calculateGridSpacing } from '../utils/grid';
import { extendLineToEdges } from '../utils/lineExtension';
import { findLineAtPoint, moveLine } from '../utils/lineHitDetection';

interface MeasurementCanvasProps {
  image: HTMLImageElement | null;
  adjustments: ImageAdjustments;
  paperSize: PaperSize;
  gridSettings: GridSettings;
  mode: 'draw' | 'move' | 'delete';
  onModeChange?: (mode: 'draw' | 'move' | 'delete') => void;
  onIntersectionsChange: (points: Point[]) => void;
  onLinesChange?: (lines: Line[]) => void;
}

export function MeasurementCanvas({
  image,
  adjustments,
  paperSize,
  gridSettings,
  mode: externalMode,
  onModeChange,
  onIntersectionsChange,
  onLinesChange,
}: MeasurementCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [mode, setMode] = useState<'draw' | 'move' | 'delete'>(externalMode || 'draw');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [movingLineId, setMovingLineId] = useState<string | null>(null);
  const [moveOffset, setMoveOffset] = useState<Point | null>(null);
  const [hoveredLineId, setHoveredLineId] = useState<string | null>(null);
  const [currentLine, setCurrentLine] = useState<{ start: Point; end: Point } | null>(
    null
  );
  const [mousePos, setMousePos] = useState<Point | null>(null);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const gridSpacingRef = useRef<number>(50);
  const longPressTimerRef = useRef<number | null>(null);
  const touchStartPosRef = useRef<Point | null>(null);

  // Sync external mode changes
  useEffect(() => {
    if (externalMode !== undefined) {
      setMode(externalMode);
    }
  }, [externalMode]);

  // Notify parent of line changes
  useEffect(() => {
    if (onLinesChange) {
      onLinesChange(lines);
    }
  }, [lines, onLinesChange]);

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = image.width;
    canvas.height = image.height;

    // Calculate grid spacing based on image dimensions
    if (image.width > 0 && image.height > 0) {
      gridSpacingRef.current = calculateGridSpacing(image.width, image.height);
    }

    // Draw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply filters if needed (including rotation and crop)
    if (
      adjustments.grayscale ||
      adjustments.brightness !== 100 ||
      adjustments.contrast !== 100 ||
      adjustments.rotation !== 0 ||
      adjustments.crop.enabled
    ) {
      applyImageFilters(canvas, adjustments, image);
    } else {
      ctx.drawImage(image, 0, 0);
    }

    // Check if dark mode is active
    const isDarkMode = document.documentElement.classList.contains('dark');

    // Draw grid overlay if enabled
    if (gridSettings.enabled) {
      drawGrid(ctx, canvas.width, canvas.height, gridSpacingRef.current, gridSettings.opacity, isDarkMode);
    }

    // Draw lines - use blue color for better color-blind accessibility
    // Blue (#0066cc) is distinguishable for all types of color blindness
    ctx.strokeStyle = '#0066cc';
    ctx.lineWidth = 3; // Slightly thicker for better visibility
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    lines.forEach((line) => {
      // Extend line to canvas edges
      const extended = extendLineToEdges(line, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(extended.start.x, extended.start.y);
      ctx.lineTo(extended.end.x, extended.end.y);
      
      // Highlight hovered line in move/delete mode
      if ((mode === 'move' || mode === 'delete') && hoveredLineId === line.id) {
        ctx.strokeStyle = mode === 'delete' ? '#ff4444' : '#0088ff';
        ctx.lineWidth = 4;
      } else {
        ctx.strokeStyle = '#0066cc';
        ctx.lineWidth = 3;
      }
      
      ctx.stroke();
    });

    // Draw current line being drawn
    if (currentLine && mousePos) {
      // Apply snapping to the end point (only if enabled)
      const snappedEnd = snapToAxis(currentLine.start, mousePos, 5, snapEnabled);
      // Create temporary line for extension
      const tempLine: Line = {
        id: 'temp',
        start: currentLine.start,
        end: snappedEnd,
      };
      // Extend to edges
      const extended = extendLineToEdges(tempLine, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(extended.start.x, extended.start.y);
      ctx.strokeStyle = '#0066cc';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 4]);
      ctx.lineTo(extended.end.x, extended.end.y);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Show snap indicator if snapping occurred
      if (snapEnabled && (snappedEnd.x !== mousePos.x || snappedEnd.y !== mousePos.y)) {
        ctx.beginPath();
        ctx.arc(snappedEnd.x, snappedEnd.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#ff8800';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Calculate intersections from extended lines
    const extendedLines: Line[] = lines.map((line) => {
      const extended = extendLineToEdges(line, canvas.width, canvas.height);
      return {
        id: line.id,
        start: extended.start,
        end: extended.end,
      };
    });
    const intersections = findAllIntersections(extendedLines);
    
    // Draw intersection points - use blue with white outline for visibility
    intersections.forEach((point) => {
      // White outline for contrast
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      // Blue center
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#0066cc';
      ctx.fill();
    });

    // Notify parent of intersections
    onIntersectionsChange(intersections);
  }, [image, lines, adjustments, currentLine, mousePos, gridSettings, isMoving, mode, hoveredLineId, onIntersectionsChange]);

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
    const canvas = canvasRef.current;
    
    if (!canvas) return;
    
    const isTouch = 'touches' in e;
    touchStartPosRef.current = pos;
    
    if (mode === 'delete') {
      // In delete mode, delete the line if clicked
      const hitResult = findLineAtPoint(pos, lines, canvas.width, canvas.height);
      if (hitResult) {
        setLines(lines.filter((l) => l.id !== hitResult.lineId));
        setHoveredLineId(null);
      }
    } else if (mode === 'move') {
      // In move mode, check if clicking on a line
      const hitResult = findLineAtPoint(pos, lines, canvas.width, canvas.height);
      
      if (hitResult) {
        if (isTouch) {
          // On touch devices, require a short delay to prevent accidental moves
          longPressTimerRef.current = window.setTimeout(() => {
            setIsMoving(true);
            setMovingLineId(hitResult.lineId);
            setMoveOffset(hitResult.offset);
            setMousePos(pos);
            setHoveredLineId(null);
          }, 200); // 200ms delay for touch
        } else {
          // On mouse, start moving immediately
          setIsMoving(true);
          setMovingLineId(hitResult.lineId);
          setMoveOffset(hitResult.offset);
          setMousePos(pos);
          setHoveredLineId(null);
        }
      }
    } else {
      // In draw mode, always start drawing
      setIsDrawing(true);
      setCurrentLine({ start: pos, end: pos });
      setMousePos(pos);
    }
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    const pos = getMousePos(e);
    setMousePos(pos);
    const canvas = canvasRef.current;
    
    if (!canvas) return;
    
    // Cancel long press if user moves too far (on touch)
    if (longPressTimerRef.current && touchStartPosRef.current) {
      const dist = Math.sqrt(
        Math.pow(pos.x - touchStartPosRef.current.x, 2) +
        Math.pow(pos.y - touchStartPosRef.current.y, 2)
      );
      if (dist > 10) {
        // Moved more than 10 pixels, cancel long press
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }
    
    if (isMoving && movingLineId && moveOffset) {
      e.preventDefault();
      // Move the line
      const lineIndex = lines.findIndex((l) => l.id === movingLineId);
      if (lineIndex !== -1) {
        const line = lines[lineIndex];
        const centerX = (line.start.x + line.end.x) / 2;
        const centerY = (line.start.y + line.end.y) / 2;
        const newCenterX = pos.x - moveOffset.x;
        const newCenterY = pos.y - moveOffset.y;
        const deltaX = newCenterX - centerX;
        const deltaY = newCenterY - centerY;
        
        const updatedLines = [...lines];
        updatedLines[lineIndex] = moveLine(line, deltaX, deltaY);
        setLines(updatedLines);
      }
    } else if (isDrawing && currentLine) {
      e.preventDefault();
      // Apply snapping while drawing (only if enabled)
      const snappedPos = snapToAxis(currentLine.start, pos, 5, snapEnabled);
      setCurrentLine({ start: currentLine.start, end: snappedPos });
    } else if ((mode === 'move' || mode === 'delete') && !isMoving) {
      // Update hover state in move/delete mode
      const hitResult = findLineAtPoint(pos, lines, canvas.width, canvas.height);
      setHoveredLineId(hitResult?.lineId || null);
    }
  };

  const handleEnd = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    
    // Cancel any pending long press
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    if (isMoving) {
      // Finish moving the line
      setIsMoving(false);
      setMovingLineId(null);
      setMoveOffset(null);
      setMousePos(null);
      touchStartPosRef.current = null;
      return;
    }
    
    if (!isDrawing || !currentLine) {
      touchStartPosRef.current = null;
      return;
    }
    
    const pos = getMousePos(e);
    // Apply snapping to final position (only if enabled)
    const snappedEnd = snapToAxis(currentLine.start, pos, 5, snapEnabled);
    // Only create line if it has meaningful length
    const dist = Math.sqrt(
      Math.pow(snappedEnd.x - currentLine.start.x, 2) +
        Math.pow(snappedEnd.y - currentLine.start.y, 2)
    );
    if (dist > 5) {
      const newLine: Line = {
        id: Date.now().toString(),
        start: currentLine.start,
        end: snappedEnd,
      };
      setLines([...lines, newLine]);
    }
    setIsDrawing(false);
    setCurrentLine(null);
    setMousePos(null);
    touchStartPosRef.current = null;
  };

  const clearLines = () => {
    setLines([]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle snapping with Shift key
      if (e.key === 'Shift') {
        setSnapEnabled(false);
      }
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

    const handleKeyUp = (e: KeyboardEvent) => {
      // Re-enable snapping when Shift is released
      if (e.key === 'Shift') {
        setSnapEnabled(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
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
                Measurement Tool
              </h3>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                {mode === 'draw' 
                  ? 'Draw mode: Click and drag to create lines'
                  : 'Move mode: Click and drag lines to reposition them'}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            {/* Snap Toggle */}
            {mode === 'draw' && (
              <button
                onClick={() => setSnapEnabled(!snapEnabled)}
                class={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all border ${
                  snapEnabled
                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                }`}
                aria-label={snapEnabled ? 'Disable snapping' : 'Enable snapping'}
                title={snapEnabled ? 'Snapping enabled - Hold Shift to disable temporarily' : 'Snapping disabled'}
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {snapEnabled ? 'Snap' : 'No Snap'}
              </button>
            )}
            {/* Prominent Mode Toggle */}
            <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setMode('draw');
                  onModeChange?.('draw');
                }}
                class={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  mode === 'draw'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
                aria-label="Draw mode"
              >
                <svg
                  class="w-3.5 h-3.5"
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
                Draw
              </button>
              <button
                onClick={() => {
                  setMode('move');
                  onModeChange?.('move');
                }}
                class={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  mode === 'move'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
                aria-label="Move mode"
              >
                <svg
                  class="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
                Move
              </button>
              <button
                onClick={() => {
                  setMode('delete');
                  onModeChange?.('delete');
                }}
                class={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  mode === 'delete'
                    ? 'bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                }`}
                aria-label="Delete mode"
              >
                <svg
                  class="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </div>
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
              <div class="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 dark:bg-blue-500/20 rounded-md">
                <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span class="text-xs font-medium text-blue-600 dark:text-blue-400">Drawing...</span>
              </div>
            )}
            {isMoving && (
              <div class="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 dark:bg-green-500/20 rounded-md">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-xs font-medium text-green-600 dark:text-green-400">Moving...</span>
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
                  {mode === 'draw' ? (
                    <>
                      <li>Click and drag to draw a new measurement line</li>
                      <li>Lines automatically extend to canvas edges</li>
                      <li>Hold <kbd class="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Shift</kbd> to disable snapping for diagonal lines</li>
                      <li>Orange dot appears when snapping is active</li>
                    </>
                  ) : mode === 'move' ? (
                    <>
                      <li>Click and drag on a line to move it</li>
                      <li>On mobile: Long press (200ms) then drag</li>
                      <li>Hover over lines to see which one will be moved</li>
                    </>
                  ) : (
                    <>
                      <li>Click on a line to delete it</li>
                      <li>Hover over lines to see which one will be deleted</li>
                      <li>Deleted lines are highlighted in red</li>
                    </>
                  )}
                  <li>Intersection points appear automatically</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Canvas Container - Made more prominent */}
      <div class="bg-white dark:bg-dark-surface rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-800 p-2 overflow-hidden hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-colors">
        <canvas
          ref={canvasRef}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={(e) => {
            handleEnd(e);
            setHoveredLineId(null);
          }}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          class={`w-full h-auto rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all ${
            mode === 'move' ? 'cursor-move' : mode === 'delete' ? 'cursor-pointer' : 'cursor-crosshair'
          }`}
          style={{ touchAction: 'none', maxHeight: '85vh', objectFit: 'contain' }}
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
