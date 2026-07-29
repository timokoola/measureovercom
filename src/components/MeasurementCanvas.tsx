import { useEffect, useRef, useState } from 'preact/hooks';
import type { Line, Point, ImageAdjustments, GridSettings, CanvasMode } from '../types';
import { findAllIntersections } from '../utils/math';
import { applyImageFilters, needsFilters, getRotatedSize } from '../utils/imageFilters';
import { drawGrid, calculateGridSpacing } from '../utils/grid';
import { extendLineToEdges } from '../utils/lineExtension';
import { findLineAtPoint } from '../utils/lineHitDetection';
import { isTouchDevice, canHover } from '../utils/device';
import { t } from '../utils/i18n';

interface MeasurementCanvasProps {
  image: HTMLImageElement | null;
  adjustments: ImageAdjustments;
  gridSettings: GridSettings;
  lines: Line[];
  mode: CanvasMode;
  onModeChange: (mode: CanvasMode) => void;
  onIntersectionsChange: (points: Point[]) => void;
  onLinesChange: (lines: Line[]) => void;
}

export function MeasurementCanvas({
  image,
  adjustments,
  gridSettings,
  lines,
  mode,
  onModeChange,
  onIntersectionsChange,
  onLinesChange,
}: MeasurementCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<{ start: Point; end: Point } | null>(null);
  const [pendingLineStart, setPendingLineStart] = useState<Point | null>(null);
  const [isDraggingHandle, setIsDraggingHandle] = useState(false);
  const [dragAxis, setDragAxis] = useState<'x' | 'y' | null>(null);
  const [hoveredLineId, setHoveredLineId] = useState<string | null>(null);
  const gridSpacingRef = useRef<number>(50);
  // Read inside handlers without re-subscribing window listeners on every move.
  const dragPosRef = useRef<number | null>(null);
  // Offscreen copy of the filtered image, reused until the image or the
  // adjustments actually change.
  const filteredRef = useRef<{
    image: HTMLImageElement;
    adjustments: ImageAdjustments;
    canvas: HTMLCanvasElement;
  } | null>(null);

  useEffect(() => {
    if (mode !== 'line') {
      setPendingLineStart(null);
      setIsDrawing(false);
      setCurrentLine(null);
    }
    if (mode !== 'delete') {
      setHoveredLineId(null);
    }
    // Drag handles are always available; reset active drag when switching modes
    setIsDraggingHandle(false);
    setDragAxis(null);
    dragPosRef.current = null;
  }, [mode]);

  const setLines = (nextLines: Line[]) => {
    onLinesChange(nextLines);
  };

  /** Filtered image, memoised — the filter pass is a full getImageData/putImageData. */
  const getFilteredImage = (
    src: HTMLImageElement,
    adj: ImageAdjustments,
    width: number,
    height: number
  ): HTMLCanvasElement => {
    const cached = filteredRef.current;
    if (
      cached &&
      cached.image === src &&
      cached.adjustments === adj &&
      cached.canvas.width === width &&
      cached.canvas.height === height
    ) {
      return cached.canvas;
    }

    const off = document.createElement('canvas');
    off.width = width;
    off.height = height;
    if (needsFilters(adj)) {
      applyImageFilters(off, adj, src);
    } else {
      off.getContext('2d')?.drawImage(src, 0, 0);
    }
    filteredRef.current = { image: src, adjustments: adj, canvas: off };
    return off;
  };

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isTouch = isTouchDevice();

    const imageWidth = image.naturalWidth || image.width;
    const imageHeight = image.naturalHeight || image.height;

    // Size the canvas to the rotated bounding box so rotation never clips.
    const { width: canvasWidth, height: canvasHeight } = getRotatedSize(
      imageWidth,
      imageHeight,
      adjustments.rotation
    );
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Calculate grid spacing based on canvas dimensions
    if (canvasWidth > 0 && canvasHeight > 0) {
      gridSpacingRef.current = calculateGridSpacing(canvasWidth, canvasHeight);
    }

    // Draw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(getFilteredImage(image, adjustments, canvasWidth, canvasHeight), 0, 0);

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
    const pointRadius = isTouch ? 10 : 6;
    const pointInnerRadius = isTouch ? 7 : 4;
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
    // `mousePos` used to sit in this list while never being read by the effect.
    // Every mousemove set it, so merely hovering the canvas re-ran the whole
    // draw — clear, drawImage, a full-image getImageData/putImageData filter
    // pass, O(n^2) intersections, and a parent re-render. It is gone entirely.
  }, [image, lines, adjustments, currentLine, gridSettings, mode, hoveredLineId, onIntersectionsChange]);

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

  const clampToCanvas = (value: number, axis: 'x' | 'y'): number => {
    const canvas = canvasRef.current;
    if (!canvas) return value;
    const limit = axis === 'x' ? canvas.width : canvas.height;
    return Math.max(0, Math.min(value, limit));
  };

  const createLineId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const createLine = (start: Point, end: Point): Line => ({
    id: createLineId(),
    start,
    end,
  });

  const addLines = (newLines: Line[]) => {
    setLines([...lines, ...newLines]);
  };

  const addLine = (start: Point, end: Point) => {
    addLines([createLine(start, end)]);
  };

  const handleStart = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const pos = getMousePos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (mode === 'cross') {
      const vertical = createLine({ x: pos.x, y: 0 }, { x: pos.x, y: canvas.height });
      const horizontal = createLine({ x: 0, y: pos.y }, { x: canvas.width, y: pos.y });
      addLines([vertical, horizontal]);
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
        return;
      }

      const dist = Math.hypot(pos.x - pendingLineStart.x, pos.y - pendingLineStart.y);
      if (dist > 5) {
        addLine(pendingLineStart, pos);
      }
      setPendingLineStart(null);
      setIsDrawing(false);
      setCurrentLine(null);
    }
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pos = getMousePos(e);

    if (mode === 'delete') {
      const hitResult = findLineAtPoint(pos, lines, canvas.width, canvas.height);
      setHoveredLineId(hitResult?.lineId || null);
      return;
    }
    if (mode !== 'line' || !pendingLineStart) return;
    e.preventDefault();

    setCurrentLine({ start: pendingLineStart, end: pos });
  };

  const previewForAxis = (axis: 'x' | 'y', value: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return axis === 'x'
      ? { start: { x: value, y: 0 }, end: { x: value, y: canvas.height } }
      : { start: { x: 0, y: value }, end: { x: canvas.width, y: value } };
  };

  const commitAxisLine = (axis: 'x' | 'y', value: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (axis === 'x') {
      addLine({ x: value, y: 0 }, { x: value, y: canvas.height });
    } else {
      addLine({ x: 0, y: value }, { x: canvas.width, y: value });
    }
  };

  const beginHandleDrag = (axis: 'x' | 'y', rawValue: number) => {
    // Clamp on the way in. Handles sit in the container padding, outside the
    // canvas rect, so a plain tap used to commit a line at e.g. y = -4.
    const clamped = clampToCanvas(rawValue, axis);
    setIsDraggingHandle(true);
    setDragAxis(axis);
    dragPosRef.current = clamped;
    setCurrentLine(previewForAxis(axis, clamped));
  };

  const handleHandleStart = (axis: 'x' | 'y') => (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const pos = getMousePos(e);
    beginHandleDrag(axis, axis === 'x' ? pos.x : pos.y);
  };

  useEffect(() => {
    if (!isDraggingHandle || !dragAxis) return;

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const pos = getMousePos(e);
      const clamped = clampToCanvas(dragAxis === 'x' ? pos.x : pos.y, dragAxis);
      dragPosRef.current = clamped;
        setCurrentLine(previewForAxis(dragAxis, clamped));
    };

    const handleDragEnd = () => {
      const finalPos = dragPosRef.current;
      if (finalPos !== null) commitAxisLine(dragAxis, finalPos);
      setIsDraggingHandle(false);
      setDragAxis(null);
        dragPosRef.current = null;
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
    // dragPos is deliberately NOT a dependency — it changes on every pointer
    // move, which tore down and re-attached all five listeners per frame.
  }, [isDraggingHandle, dragAxis]);

  const clearLines = () => {
    setLines([]);
  };

  /**
   * Keyboard placement via the drag handles: arrows move a preview line along
   * the axis, Enter/Space commits it, Escape cancels. Without this the app's
   * core function is unreachable without a pointer.
   */
  const handleHandleKeyDown = (axis: 'x' | 'y') => (e: KeyboardEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const limit = axis === 'x' ? canvas.width : canvas.height;
    const step = e.shiftKey ? limit / 10 : limit / 100;

    const active = isDraggingHandle && dragAxis === axis;
    const current = active && dragPosRef.current !== null ? dragPosRef.current : limit / 2;

    const decrease = axis === 'x' ? 'ArrowLeft' : 'ArrowUp';
    const increase = axis === 'x' ? 'ArrowRight' : 'ArrowDown';

    if (e.key === decrease || e.key === increase) {
      e.preventDefault();
      const next = clampToCanvas(current + (e.key === increase ? step : -step), axis);
      if (!active) beginHandleDrag(axis, next);
      else {
        dragPosRef.current = next;
        setCurrentLine(previewForAxis(axis, next));
      }
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      commitAxisLine(axis, active ? current : limit / 2);
      setIsDraggingHandle(false);
      setDragAxis(null);
        dragPosRef.current = null;
      setCurrentLine(null);
      return;
    }

    if (e.key === 'Escape' && active) {
      e.preventDefault();
      setIsDraggingHandle(false);
      setDragAxis(null);
        dragPosRef.current = null;
      setCurrentLine(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // Escape cancels the pending line — which is what the on-screen hint
      // says it does. It used to ALSO run clearLines() in the same keypress
      // whenever any line existed, so cancelling a 6th line silently deleted
      // the first five. Clearing everything is the "Clear all" button's job.
      if (isDrawing) {
        setIsDrawing(false);
        setPendingLineStart(null);
        setCurrentLine(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawing]);

  const [lineCancelStart, lineCancelEnd] = t('lineCancel').split('Esc');

  return (
    <div class="relative" role="region" aria-label={t('measurementCanvasLabel')}>
      {/* Drawing Toolbar */}
      <div class="mb-4 bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-gray-800 p-4 shadow-xs">
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
                onClick={() => onModeChange('cross')}
                class={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  mode === 'cross'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-xs'
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
                onClick={() => onModeChange('line')}
                class={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  mode === 'line'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-xs'
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
                onClick={() => onModeChange('delete')}
                class={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  mode === 'delete'
                    ? 'bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 shadow-xs'
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
                  class="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-dark-surface border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-dark-surface/80 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm font-medium transition-all"
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
                class="w-4 h-4 mt-0.5 shrink-0"
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
                        <kbd class="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-sm text-xs">Esc</kbd>
                        {lineCancelEnd || ''}
                      </li>
                    </>
                  ) : (
                    <>
                      <li>{t('deleteClickLine')}</li>
                      {canHover() && <li>{t('deleteHoverHint')}</li>}
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
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          class={`rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all ${
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
            <button
              type="button"
              class="w-20 h-4 border border-blue-700 rounded-full pointer-events-auto cursor-row-resize shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onMouseDown={handleHandleStart('y')}
              onTouchStart={handleHandleStart('y')}
              onKeyDown={handleHandleKeyDown('y')}
              aria-label={`${t('dragHandleTop')} — ${t('handleKeyboardHint')}`}
              style={{
                backgroundColor: '#1d4ed8',
                backgroundImage:
                  'repeating-linear-gradient(135deg, rgba(255,255,255,0.35) 0 8px, rgba(255,255,255,0) 8px 16px)',
              }}
            />
          </div>
          <div class="absolute inset-x-0 bottom-1 flex items-center justify-center pointer-events-none">
            <button
              type="button"
              class="w-20 h-4 border border-blue-700 rounded-full pointer-events-auto cursor-row-resize shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onMouseDown={handleHandleStart('y')}
              onTouchStart={handleHandleStart('y')}
              onKeyDown={handleHandleKeyDown('y')}
              aria-label={`${t('dragHandleBottom')} — ${t('handleKeyboardHint')}`}
              style={{
                backgroundColor: '#1d4ed8',
                backgroundImage:
                  'repeating-linear-gradient(135deg, rgba(255,255,255,0.35) 0 8px, rgba(255,255,255,0) 8px 16px)',
              }}
            />
          </div>
          <div class="absolute inset-y-0 left-1 flex items-center justify-center pointer-events-none">
            <button
              type="button"
              class="h-20 w-4 border border-blue-700 rounded-full pointer-events-auto cursor-col-resize shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onMouseDown={handleHandleStart('x')}
              onTouchStart={handleHandleStart('x')}
              onKeyDown={handleHandleKeyDown('x')}
              aria-label={`${t('dragHandleLeft')} — ${t('handleKeyboardHint')}`}
              style={{
                backgroundColor: '#1d4ed8',
                backgroundImage:
                  'repeating-linear-gradient(135deg, rgba(255,255,255,0.35) 0 8px, rgba(255,255,255,0) 8px 16px)',
              }}
            />
          </div>
          <div class="absolute inset-y-0 right-1 flex items-center justify-center pointer-events-none">
            <button
              type="button"
              class="h-20 w-4 border border-blue-700 rounded-full pointer-events-auto cursor-col-resize shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onMouseDown={handleHandleStart('x')}
              onTouchStart={handleHandleStart('x')}
              onKeyDown={handleHandleKeyDown('x')}
              aria-label={`${t('dragHandleRight')} — ${t('handleKeyboardHint')}`}
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
