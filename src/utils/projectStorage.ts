import type { ProjectData } from '../types';

const STORAGE_KEY = 'measureover-projects';
const MAX_PROJECTS = 10;

export interface StoredProject {
  id: string;
  name: string;
  data: ProjectData;
  createdAt: number;
}

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

  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  return id;
}

export function getStoredProjects(): StoredProject[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as StoredProject[];
    } catch {
      return [];
    }
  }
  return [];
}

export function loadProject(id: string): ProjectData | null {
  const projects = getStoredProjects();
  const project = projects.find((p) => p.id === id);
  return project ? project.data : null;
}

export function deleteProject(id: string): void {
  const projects = getStoredProjects();
  const filtered = projects.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
