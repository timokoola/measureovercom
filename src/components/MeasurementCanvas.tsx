import { useEffect, useRef, useState } from 'preact/hooks';
import type { Line, Point, ImageAdjustments, PaperSize, GridSettings } from '../types';
import { findAllIntersections } from '../utils/math';
import { applyImageFilters } from '../utils/imageFilters';
import { drawGrid, calculateGridSpacing } from '../utils/grid';
import { extendLineToEdges } from '../utils/lineExtension';
import { findLineAtPoint } from '../utils/lineHitDetection';
import { t } from '../utils/i18n';

interface MeasurementCanvasProps {
  image: HTMLImageElement | null;
  adjustments: ImageAdjustments;
  paperSize: PaperSize;
  gridSettings: GridSettings;
  mode: 'cross' | 'line' | 'delete';
  onModeChange?: (mode: 'cross' | 'line' | 'delete') => void;
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
  const [mode, setMode] = useState<'cross' | 'line' | 'delete'>(externalMode || 'cross');
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<{ start: Point; end: Point } | null>(null);
  const [mousePos, setMousePos] = useState<Point | null>(null);
  const [pendingLineStart, setPendingLineStart] = useState<Point | null>(null);
  const [isDraggingHandle, setIsDraggingHandle] = useState(false);
  const [dragAxis, setDragAxis] = useState<'x' | 'y' | null>(null);
  const [dragPos, setDragPos] = useState<number | null>(null);
  const [hoveredLineId, setHoveredLineId] = useState<string | null>(null);
  const gridSpacingRef = useRef<number>(50);

  // Sync external mode changes
  useEffect(() => {
    if (externalMode !== undefined) {
      setMode(externalMode);
    }
  }, [externalMode]);

  useEffect(() => {
    if (mode !== 'line') {
      setPendingLineStart(null);
      setIsDrawing(false);
      setCurrentLine(null);
      setMousePos(null);
    }
    if (mode !== 'delete') {
      setHoveredLineId(null);
    }
    // Drag handles are always available; reset active drag when switching modes
    setIsDraggingHandle(false);
    setDragAxis(null);
    setDragPos(null);
  }, [mode]);

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

    // Detect mobile once for this render
    const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const imageWidth = image.naturalWidth || image.width;
    const imageHeight = image.naturalHeight || image.height;

    // Set canvas size to match image
    canvas.width = imageWidth;
    canvas.height = imageHeight;

    // Calculate grid spacing based on image dimensions
    if (imageWidth > 0 && imageHeight > 0) {
      gridSpacingRef.current = calculateGridSpacing(imageWidth, imageHeight);
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
    const baseLineWidth = gridSettings.lineThickness;
    const hoverLineWidth = Math.round(gridSettings.lineThickness * 1.5);
    
    ctx.strokeStyle = '#0066cc';
    ctx.lineWidth = baseLineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    lines.forEach((line) => {
      // Extend line to canvas edges
      const extended = extendLineToEdges(line, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(extended.start.x, extended.start.y);
      ctx.lineTo(extended.end.x, extended.end.y);
      
      if (mode === 'delete' && hoveredLineId === line.id) {
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = hoverLineWidth;
      } else {
        ctx.strokeStyle = '#0066cc';
        ctx.lineWidth = baseLineWidth;
      }
      ctx.stroke();
    });

    // Draw current preview line (line or drag mode)
    if (currentLine) {
      const tempLine: Line = {
        id: 'temp',
        start: currentLine.start,
        end: currentLine.end,
      };
      const extended = extendLineToEdges(tempLine, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(extended.start.x, extended.start.y);
      ctx.strokeStyle = '#0066cc';
      ctx.lineWidth = gridSettings.lineThickness;
      ctx.setLineDash([8, 4]);
      ctx.lineTo(extended.end.x, extended.end.y);
      ctx.stroke();
      ctx.setLineDash([]);
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
    const pointRadius = isMobileDevice ? 10 : 6;
    const pointInnerRadius = isMobileDevice ? 7 : 4;
    intersections.forEach((point) => {
      // White outline for contrast
      ctx.beginPath();
      ctx.arc(point.x, point.y, pointRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      // Blue center
      ctx.beginPath();
      ctx.arc(point.x, point.y, pointInnerRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#0066cc';
      ctx.fill();
    });

    // Notify parent of intersections
    onIntersectionsChange(intersections);
  }, [image, lines, adjustments, currentLine, mousePos, gridSettings, mode, hoveredLineId, onIntersectionsChange]);

  const getMousePos = (e: MouseEvent | TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;
    if ('touches' in e) {
      // For touch events, use touches if available, otherwise changedTouches (for touchend)
      const touch = e.touches && e.touches.length > 0 
        ? e.touches[0] 
        : (e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches[0] : null);
      if (!touch) return { x: 0, y: 0 };
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const createLineId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const addLine = (start: Point, end: Point) => {
    const newLine: Line = {
      id: createLineId(),
      start,
      end,
    };
    setLines((prev) => [...prev, newLine]);
  };

  const handleStart = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const pos = getMousePos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (mode === 'cross') {
      addLine({ x: pos.x, y: 0 }, { x: pos.x, y: canvas.height });
      addLine({ x: 0, y: pos.y }, { x: canvas.width, y: pos.y });
      return;
    }

    if (mode === 'delete') {
      const hitResult = findLineAtPoint(pos, lines, canvas.width, canvas.height);
      if (hitResult) {
        setLines(lines.filter((l) => l.id !== hitResult.lineId));
        setHoveredLineId(null);
      }
      return;
    }

    if (mode === 'line') {
      if (!pendingLineStart) {
        setPendingLineStart(pos);
        setIsDrawing(true);
        setCurrentLine({ start: pos, end: pos });
        setMousePos(pos);
        return;
      }

      const dist = Math.hypot(pos.x - pendingLineStart.x, pos.y - pendingLineStart.y);
      if (dist > 5) {
        addLine(pendingLineStart, pos);
      }
      setPendingLineStart(null);
      setIsDrawing(false);
      setCurrentLine(null);
      setMousePos(null);
    }
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    const pos = getMousePos(e);
    setMousePos(pos);
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (mode === 'delete') {
      const hitResult = findLineAtPoint(pos, lines, canvas.width, canvas.height);
      setHoveredLineId(hitResult?.lineId || null);
      return;
    }
    if (mode !== 'line' || !pendingLineStart) return;
    e.preventDefault();

    setCurrentLine({ start: pendingLineStart, end: pos });
  };

  const handleEnd = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    if (mode !== 'line') return;
  };

  const handleHandleStart = (axis: 'x' | 'y') => (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const pos = getMousePos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const nextPos = axis === 'x' ? pos.x : pos.y;
    setIsDraggingHandle(true);
    setDragAxis(axis);
    setDragPos(nextPos);
    if (axis === 'x') {
      setCurrentLine({ start: { x: nextPos, y: 0 }, end: { x: nextPos, y: canvas.height } });
    } else {
      setCurrentLine({ start: { x: 0, y: nextPos }, end: { x: canvas.width, y: nextPos } });
    }
  };

  useEffect(() => {
    if (!isDraggingHandle || !dragAxis) return;

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const pos = getMousePos(e);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const limit = dragAxis === 'x' ? canvas.width : canvas.height;
      const raw = dragAxis === 'x' ? pos.x : pos.y;
      const clamped = Math.max(0, Math.min(raw, limit));
      setDragPos(clamped);
      if (dragAxis === 'x') {
        setCurrentLine({ start: { x: clamped, y: 0 }, end: { x: clamped, y: canvas.height } });
      } else {
        setCurrentLine({ start: { x: 0, y: clamped }, end: { x: canvas.width, y: clamped } });
      }
    };

    const handleDragEnd = () => {
      const canvas = canvasRef.current;
      if (canvas && dragPos !== null) {
        if (dragAxis === 'x') {
          addLine({ x: dragPos, y: 0 }, { x: dragPos, y: canvas.height });
        } else {
          addLine({ x: 0, y: dragPos }, { x: canvas.width, y: dragPos });
        }
      }
      setIsDraggingHandle(false);
      setDragAxis(null);
      setDragPos(null);
      setCurrentLine(null);
    };

    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleDragMove, { passive: false });
    window.addEventListener('touchend', handleDragEnd);
    window.addEventListener('touchcancel', handleDragEnd);

    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
      window.removeEventListener('touchcancel', handleDragEnd);
    };
  }, [isDraggingHandle, dragAxis, dragPos]);

  const clearLines = () => {
    setLines([]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Clear lines with Escape key
      if (e.key === 'Escape' && lines.length > 0) {
        clearLines();
      }
      // Cancel pending line with Escape
      if (e.key === 'Escape' && isDrawing) {
        setIsDrawing(false);
        setPendingLineStart(null);
        setCurrentLine(null);
        setMousePos(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lines.length, isDrawing]);

  const [lineCancelStart, lineCancelEnd] = t('lineCancel').split('Esc');

  return (
    <div class="relative" role="region" aria-label={t('measurementCanvasLabel')}>
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
                {t('measurementTool')}
              </h3>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                {mode === 'cross'
                  ? t('crossMode')
                  : mode === 'line'
                  ? t('lineMode')
                  : t('deleteMode')}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            {/* Prominent Mode Toggle */}
            <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setMode('cross');
                  onModeChange?.('cross');
                }}
                class={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  mode === 'cross'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
                aria-label={`${t('switchToMode')} ${t('cross')}`}
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
                    d="M12 5v14m-7-7h14"
                  />
                </svg>
                {t('cross')}
              </button>
              <button
                onClick={() => {
                  setMode('line');
                  onModeChange?.('line');
                }}
                class={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  mode === 'line'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
                aria-label={`${t('switchToMode')} ${t('line')}`}
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
                    d="M4 20L20 4"
                  />
                </svg>
                {t('line')}
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
                aria-label={`${t('switchToMode')} ${t('delete')}`}
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
                {t('delete')}
              </button>
            </div>
            {lines.length > 0 && (
              <>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {lines.length}{' '}
                  {lines.length === 1 ? t('lineCount') : t('lineCountPlural')}
                </span>
                <button
                  onClick={clearLines}
                  class="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-dark-surface border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-dark-surface/80 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm font-medium transition-all"
                  aria-label={t('clearAll')}
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
                  {t('clearAll')}
                </button>
              </>
            )}
            {isDrawing && (
              <div class="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 dark:bg-blue-500/20 rounded-md">
                <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span class="text-xs font-medium text-blue-600 dark:text-blue-400">{t('linePending')}</span>
              </div>
            )}
            {isDraggingHandle && (
              <div class="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 dark:bg-green-500/20 rounded-md">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-xs font-medium text-green-600 dark:text-green-400">Dragging...</span>
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
                <p class="font-medium mb-1">
                  {mode === 'cross'
                    ? t('crossInstructionsTitle')
                    : mode === 'line'
                    ? t('lineInstructionsTitle')
                    : t('deleteInstructionsTitle')}
                </p>
                <ul class="list-disc list-inside space-y-0.5 ml-2">
                  {mode === 'cross' ? (
                    <>
                      <li>{t('crossClickOnce')}</li>
                      <li>{t('crossAddsLines')}</li>
                      <li>{t('linesAutoExtend')}</li>
                    </>
                  ) : mode === 'line' ? (
                    <>
                      <li>{t('lineClickFirst')}</li>
                      <li>{t('lineExactPlacement')}</li>
                      <li>
                        {lineCancelStart}
                        <kbd class="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Esc</kbd>
                        {lineCancelEnd || ''}
                      </li>
                    </>
                  ) : (
                    <>
                      <li>{t('deleteClickLine')}</li>
                      <li>{t('deleteHoverHint')}</li>
                    </>
                  )}
                  <li>{t('dragHandlesHint')}</li>
                  <li>{t('intersectionPointsAppear')}</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Canvas Container - Made more prominent */}
      <div class="bg-white dark:bg-dark-surface rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-800 p-2 overflow-hidden hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-colors relative">
        <canvas
          ref={canvasRef}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={(e) => {
            handleEnd(e);
          }}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          onTouchCancel={handleEnd}
          class={`rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all ${
            mode === 'delete' ? 'cursor-pointer' : 'cursor-crosshair'
          }`}
          style={{
            touchAction: 'none',
            maxWidth: '100%',
            maxHeight: '85vh',
            width: 'auto',
            height: 'auto',
            display: 'block',
            margin: '0 auto',
          }}
          tabIndex={0}
          aria-label={t('measurementCanvasLabel')}
        />
        <>
          <div class="absolute inset-x-0 top-1 flex items-center justify-center pointer-events-none">
            <div
              class="w-20 h-4 border border-blue-700 rounded-full pointer-events-auto cursor-row-resize shadow-sm"
              onMouseDown={handleHandleStart('y')}
              onTouchStart={handleHandleStart('y')}
              aria-label={t('dragHandleTop')}
              style={{
                backgroundColor: '#1d4ed8',
                backgroundImage:
                  'repeating-linear-gradient(135deg, rgba(255,255,255,0.35) 0 8px, rgba(255,255,255,0) 8px 16px)',
              }}
            />
          </div>
          <div class="absolute inset-x-0 bottom-1 flex items-center justify-center pointer-events-none">
            <div
              class="w-20 h-4 border border-blue-700 rounded-full pointer-events-auto cursor-row-resize shadow-sm"
              onMouseDown={handleHandleStart('y')}
              onTouchStart={handleHandleStart('y')}
              aria-label={t('dragHandleBottom')}
              style={{
                backgroundColor: '#1d4ed8',
                backgroundImage:
                  'repeating-linear-gradient(135deg, rgba(255,255,255,0.35) 0 8px, rgba(255,255,255,0) 8px 16px)',
              }}
            />
          </div>
          <div class="absolute inset-y-0 left-1 flex items-center justify-center pointer-events-none">
            <div
              class="h-20 w-4 border border-blue-700 rounded-full pointer-events-auto cursor-col-resize shadow-sm"
              onMouseDown={handleHandleStart('x')}
              onTouchStart={handleHandleStart('x')}
              aria-label={t('dragHandleLeft')}
              style={{
                backgroundColor: '#1d4ed8',
                backgroundImage:
                  'repeating-linear-gradient(135deg, rgba(255,255,255,0.35) 0 8px, rgba(255,255,255,0) 8px 16px)',
              }}
            />
          </div>
          <div class="absolute inset-y-0 right-1 flex items-center justify-center pointer-events-none">
            <div
              class="h-20 w-4 border border-blue-700 rounded-full pointer-events-auto cursor-col-resize shadow-sm"
              onMouseDown={handleHandleStart('x')}
              onTouchStart={handleHandleStart('x')}
              aria-label={t('dragHandleRight')}
              style={{
                backgroundColor: '#1d4ed8',
                backgroundImage:
                  'repeating-linear-gradient(135deg, rgba(255,255,255,0.35) 0 8px, rgba(255,255,255,0) 8px 16px)',
              }}
            />
          </div>
        </>
      </div>
      <div class="sr-only" aria-live="polite" aria-atomic="true">
        {lines.length === 0
          ? t('noLinesDrawn')
          : `${lines.length} ${t('linesDrawn')}`}
      </div>
    </div>
  );
}
