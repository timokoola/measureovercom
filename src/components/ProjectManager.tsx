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

  useEffect(() => {
    setProjects(getStoredProjects());
  }, []);

  const handleDelete = (id: string, e: Event) => {
    e.stopPropagation();
    if (confirm(t('deleteProject'))) {
      deleteProject(id);
      setProjects(getStoredProjects());
    }
  };

  return (
    <div class="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
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
        onClick={onSave}
        class="w-full px-4 py-2 bg-burnt-orange text-white font-medium rounded-lg shadow-sm hover:bg-[#b84a00] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-burnt-orange focus:ring-offset-2 transition-all text-sm"
      >
        {t('saveProject')}
      </button>

      {isOpen && projects.length > 0 && (
        <div class="mt-4 space-y-2 max-h-48 overflow-y-auto">
          {projects.map((project) => (
            <div
              key={project.id}
              class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900/50 rounded hover:bg-gray-100 dark:hover:bg-gray-900/80 cursor-pointer group"
              onClick={() => onLoad(project.id)}
            >
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                  {project.name}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500">
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={(e) => handleDelete(project.id, e)}
                class="ml-2 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={t('deleteProjectAria')}
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {isOpen && projects.length === 0 && (
        <p class="text-xs text-gray-500 dark:text-gray-500 mt-4 text-center">
          {t('noSavedProjects')}
        </p>
      )}
    </div>
  );
}
