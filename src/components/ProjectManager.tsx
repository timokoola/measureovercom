import { useState, useEffect } from 'preact/hooks';
import { getStoredProjects, deleteProject, type StoredProject } from '../utils/projectStorage';
import { t } from '../utils/i18n';

interface ProjectManagerProps {
  onSave: () => void;
  onLoad: (id: string) => void;
}

export function ProjectManager({ onSave, onLoad }: ProjectManagerProps) {
  const [projects, setProjects] = useState<StoredProject[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const refresh = () => setProjects(getStoredProjects());

  // Re-read on mount and whenever the list is opened. Reading only on mount
  // meant a project saved during the session never appeared until a full
  // remount — save, then "Show", and the project you just saved was missing.
  useEffect(() => {
    refresh();
  }, [isOpen]);

  const handleSave = () => {
    onSave();
    refresh();
  };

  const handleDelete = (id: string, e: Event) => {
    e.stopPropagation();
    if (confirm(t('deleteProject'))) {
      try {
        deleteProject(id);
      } catch {
        // Write refused; the list below reflects what is actually stored.
      }
      refresh();
    }
  };

  return (
    <div class="bg-white dark:bg-dark-surface rounded-xl shadow-xs border border-gray-200 dark:border-gray-800 p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {t('projects')}
        </h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          class="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          {isOpen ? t('hide') : t('show')}
        </button>
      </div>

      <button
        onClick={handleSave}
        class="w-full px-4 py-2 bg-burnt-orange text-white font-medium rounded-lg shadow-xs hover:bg-burnt-orange-hover hover:shadow-md focus:outline-hidden focus:ring-2 focus:ring-burnt-orange focus:ring-offset-2 transition-all text-sm"
      >
        {t('saveProject')}
      </button>

      {isOpen && projects.length > 0 && (
        <ul class="mt-4 space-y-2 max-h-48 overflow-y-auto">
          {projects.map((project) => (
            <li
              key={project.id}
              class="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-900/80 group focus-within:ring-2 focus-within:ring-burnt-orange"
            >
              {/*
                A real button, not a clickable div — keyboard users previously
                had no way at all to load a project.
              */}
              <button
                type="button"
                onClick={() => onLoad(project.id)}
                class="flex-1 min-w-0 text-left p-2 focus:outline-hidden"
              >
                <span class="block text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                  {project.name}
                </span>
                <span class="block text-xs text-gray-500 dark:text-gray-500">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </button>
              {/*
                Was opacity-0 until hover: invisible to keyboard users (who could
                still tab onto it) and permanently unreachable on touch, where
                hover does not exist. Now always visible on coarse pointers and
                on focus.
              */}
              <button
                type="button"
                onClick={(e) => handleDelete(project.id, e)}
                class="mr-2 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100 transition-opacity focus:outline-hidden focus-visible:ring-2 focus-visible:ring-red-500 rounded-sm"
                aria-label={`${t('deleteProjectAria')}: ${project.name}`}
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {isOpen && projects.length === 0 && (
        <p class="text-xs text-gray-500 dark:text-gray-500 mt-4 text-center">
          {t('noSavedProjects')}
        </p>
      )}
    </div>
  );
}
