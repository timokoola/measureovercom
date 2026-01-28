import { useState, useEffect, useRef } from 'preact/hooks';
import { ImageUpload } from './ImageUpload';
import { MeasurementCanvas } from './MeasurementCanvas';
import { PaperSizeSelector } from './PaperSizeSelector';
import { ImageAdjustments } from './ImageAdjustments';
import { CoordinateDisplay } from './CoordinateDisplay';
import { GridControls } from './GridControls';
import { UnitSelector } from './UnitSelector';
import { ProjectManager } from './ProjectManager';
import { ThemeToggle } from './ThemeToggle';
import type {
  PaperSize,
  ImageAdjustments as ImageAdjustmentsType,
  Point,
  GridSettings,
  MeasurementUnit,
  Line,
  CanvasMode,
} from '../types';
import { getStoredTheme, applyTheme } from '../utils/theme';
import { UndoRedoManager } from '../utils/undoRedo';
import { saveProject, getStoredProjects, loadProject, deleteProject } from '../utils/projectStorage';
import { exportImageWithLines, downloadImage } from '../utils/imageExport';

export function MeasurementApp() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [paperSize, setPaperSize] = useState<PaperSize>('a5');
  const [unit, setUnit] = useState<MeasurementUnit>('mm');
  const [mode, setMode] = useState<CanvasMode>('draw');
  const [adjustments, setAdjustments] = useState<ImageAdjustmentsType>({
    grayscale: false,
    brightness: 100,
    contrast: 100,
    rotation: 0,
    crop: {
      enabled: false,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
  });
  const [gridSettings, setGridSettings] = useState<GridSettings>({
    enabled: false,
    opacity: 10,
    spacing: 50,
  });
  const [lines, setLines] = useState<Line[]>([]);
  const [intersections, setIntersections] = useState<Point[]>([]);
  const undoRedoRef = useRef(new UndoRedoManager());
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    // Apply theme on mount
    const theme = getStoredTheme();
    applyTheme(theme);
  }, []);

  const handleImageLoad = (img: HTMLImageElement) => {
    setImage(img);
    setLines([]);
    undoRedoRef.current.clear();
    // Initialize with empty state
    undoRedoRef.current.pushState({ lines: [] });
    setCanUndo(false);
    setCanRedo(false);
  };

  const handleLinesChange = (newLines: Line[]) => {
    // Only update if lines actually changed
    if (JSON.stringify(newLines) !== JSON.stringify(lines)) {
      setLines(newLines);
      // Push to undo/redo history
      undoRedoRef.current.pushState({ lines: newLines });
      setCanUndo(undoRedoRef.current.canUndo());
      setCanRedo(undoRedoRef.current.canRedo());
    }
  };

  const handleUndo = () => {
    const state = undoRedoRef.current.undo();
    if (state) {
      setLines(state.lines);
      setCanUndo(undoRedoRef.current.canUndo());
      setCanRedo(undoRedoRef.current.canRedo());
    }
  };

  const handleRedo = () => {
    const state = undoRedoRef.current.redo();
    if (state) {
      setLines(state.lines);
      setCanUndo(undoRedoRef.current.canUndo());
      setCanRedo(undoRedoRef.current.canRedo());
    }
  };

  const handleSaveProject = () => {
    const projectData = {
      lines,
      paperSize,
      adjustments,
      gridSettings,
      unit,
      timestamp: Date.now(),
    };
    const id = saveProject(projectData);
    alert('Project saved successfully!');
  };

  const handleLoadProject = (projectId: string) => {
    const projectData = loadProject(projectId);
    if (projectData) {
      setLines(projectData.lines);
      setPaperSize(projectData.paperSize);
      setAdjustments(projectData.adjustments);
      setGridSettings(projectData.gridSettings);
      setUnit(projectData.unit);
      undoRedoRef.current.clear();
      undoRedoRef.current.pushState({ lines: projectData.lines });
      setCanUndo(false);
      setCanRedo(false);
    }
  };

  const handleExportImage = async () => {
    if (!image) return;
    try {
      const dataUrl = await exportImageWithLines(image, lines, adjustments, gridSettings, paperSize);
      const paperName = paperSize.replace('-', '_');
      downloadImage(dataUrl, `measureover-${paperName}-${Date.now()}.png`);
    } catch (error) {
      alert('Failed to export image');
      console.error(error);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        if (canRedo) handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo]);

  return (
    <div class="min-h-screen bg-gradient-to-br from-broken-white via-white to-gray-50 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg">
      <div class="p-4 md:p-8">
        <header class="max-w-7xl mx-auto mb-12">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
                MeasureOver
              </h1>
              <p class="text-base text-gray-600 dark:text-gray-400">
                Professional image measurement tool for drawing guidance
              </p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main class="max-w-[95vw] xl:max-w-[98vw] mx-auto">
          {!image ? (
            <div class="max-w-3xl mx-auto">
              <ImageUpload onImageLoad={handleImageLoad} />
            </div>
          ) : (
            <div class="space-y-6">
              <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <div class="xl:col-span-3 space-y-4">
                  <MeasurementCanvas
                    image={image}
                    adjustments={adjustments}
                    paperSize={paperSize}
                    gridSettings={gridSettings}
                    mode={mode}
                    onModeChange={setMode}
                    onIntersectionsChange={setIntersections}
                    onLinesChange={handleLinesChange}
                  />
                  <div class="flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleUndo}
                      disabled={!canUndo}
                      class="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-surface border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-dark-surface/80 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-burnt-orange focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Undo (Ctrl+Z)"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      Undo
                    </button>
                    <button
                      onClick={handleRedo}
                      disabled={!canRedo}
                      class="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-surface border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-dark-surface/80 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-burnt-orange focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Redo (Ctrl+Y)"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                      </svg>
                      Redo
                    </button>
                    <button
                      onClick={handleExportImage}
                      class="inline-flex items-center gap-2 px-4 py-2 bg-burnt-orange text-white font-medium rounded-lg shadow-sm hover:bg-[#b84a00] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-burnt-orange focus:ring-offset-2 transition-all"
                      aria-label="Export image with lines"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4 4v12" />
                      </svg>
                      Export Image
                    </button>
                    <button
                      onClick={() => setImage(null)}
                      class="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-surface border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-dark-surface/80 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-burnt-orange focus:ring-offset-2 transition-all"
                      aria-label="Upload a different image"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      New Image
                    </button>
                  </div>
                </div>

                <div class="xl:col-span-1 space-y-4">
                  <PaperSizeSelector value={paperSize} onChange={setPaperSize} />
                  <UnitSelector value={unit} onChange={setUnit} />
                  <GridControls
                    gridSettings={gridSettings}
                    onChange={setGridSettings}
                  />
                  <ImageAdjustments
                    adjustments={adjustments}
                    onChange={setAdjustments}
                  />
                  <ProjectManager
                    onSave={handleSaveProject}
                    onLoad={handleLoadProject}
                  />
                </div>
              </div>

              {/* Coordinates Section - Prominent */}
              <CoordinateDisplay
                points={intersections}
                imageWidth={image.width}
                imageHeight={image.height}
                paperSize={paperSize}
                unit={unit}
              />
            </div>
          )}
        </main>

        <footer class="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p class="text-sm text-center text-gray-500 dark:text-gray-500">
            MeasureOver - Fast, lightweight image measurement tool
          </p>
        </footer>
      </div>
    </div>
  );
}
