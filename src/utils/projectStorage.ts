import type { ProjectData, ImageAdjustments, GridSettings, Line, MeasurementUnit, PaperSize } from '../types';
import { PAPER_SIZES } from './paperSizes';
import { isTouchDevice } from './device';

const STORAGE_KEY = 'measureover-projects';
const MAX_PROJECTS = 10;

export interface StoredProject {
  id: string;
  name: string;
  data: ProjectData;
  createdAt: number;
}

/** Thrown when the browser refuses the write (quota full, Safari private mode). */
export class StorageWriteError extends Error {
  constructor(cause?: unknown) {
    super('Could not write to localStorage');
    this.name = 'StorageWriteError';
    this.cause = cause;
  }
}

function num(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function normalizeLines(value: unknown): Line[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (l): l is Line =>
        !!l &&
        typeof l === 'object' &&
        !!(l as Line).start &&
        !!(l as Line).end &&
        Number.isFinite((l as Line).start?.x) &&
        Number.isFinite((l as Line).start?.y) &&
        Number.isFinite((l as Line).end?.x) &&
        Number.isFinite((l as Line).end?.y)
    )
    .map((l, i) => ({
      id: typeof l.id === 'string' && l.id ? l.id : `restored-${i}`,
      start: { x: l.start.x, y: l.start.y },
      end: { x: l.end.x, y: l.end.y },
    }));
}

function normalizeAdjustments(value: unknown): ImageAdjustments {
  const a = (value ?? {}) as Partial<ImageAdjustments>;
  return {
    grayscale: bool(a.grayscale, false),
    brightness: num(a.brightness, 100),
    contrast: num(a.contrast, 100),
    rotation: num(a.rotation, 0),
  };
}

function normalizeGridSettings(value: unknown): GridSettings {
  const g = (value ?? {}) as Partial<GridSettings>;
  return {
    enabled: bool(g.enabled, false),
    opacity: num(g.opacity, 10),
    lineThickness: num(g.lineThickness, isTouchDevice() ? 8 : 3),
  };
}

/**
 * Fill in every field a stored project might be missing.
 *
 * Projects saved by older versions predate `rotation` and `lineThickness`.
 * Reading those straight back produced `ctx.rotate(NaN)` (blank canvas) or a
 * TypeError on `crop.enabled` that took down the whole Preact island.
 */
export function normalizeProjectData(value: unknown): ProjectData | null {
  if (!value || typeof value !== 'object') return null;
  const d = value as Partial<ProjectData>;

  const paperSize: PaperSize =
    typeof d.paperSize === 'string' && d.paperSize in PAPER_SIZES
      ? (d.paperSize as PaperSize)
      : 'a5';
  const unit: MeasurementUnit =
    d.unit === 'mm' || d.unit === 'cm' || d.unit === 'inches' ? d.unit : 'mm';

  return {
    lines: normalizeLines(d.lines),
    paperSize,
    adjustments: normalizeAdjustments(d.adjustments),
    gridSettings: normalizeGridSettings(d.gridSettings),
    unit,
    timestamp: num(d.timestamp, Date.now()),
  };
}

function writeProjects(projects: StoredProject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    // QuotaExceededError, or Safari private mode refusing writes entirely.
    throw new StorageWriteError(error);
  }
}

/** @throws {StorageWriteError} when the browser refuses the write. */
export function saveProject(projectData: ProjectData, name?: string): string {
  const projects = getStoredProjects();
  const id = `project-${Date.now()}`;
  const project: StoredProject = {
    id,
    name: name || `Project ${new Date().toLocaleDateString()}`,
    data: projectData,
    createdAt: Date.now(),
  };

  projects.unshift(project);

  // Keep only the most recent projects
  if (projects.length > MAX_PROJECTS) {
    projects.pop();
  }

  writeProjects(projects);
  return id;
}

export function getStoredProjects(): StoredProject[] {
  if (typeof window === 'undefined') return [];

  let stored: string | null = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    return [];
  }
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p): p is StoredProject => !!p && typeof p === 'object' && typeof p.id === 'string'
    );
  } catch {
    return [];
  }
}

export function loadProject(id: string): ProjectData | null {
  const projects = getStoredProjects();
  const project = projects.find((p) => p.id === id);
  if (!project) return null;
  return normalizeProjectData(project.data);
}

/** @throws {StorageWriteError} when the browser refuses the write. */
export function deleteProject(id: string): void {
  const projects = getStoredProjects();
  writeProjects(projects.filter((p) => p.id !== id));
}
