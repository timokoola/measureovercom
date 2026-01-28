import { useRef, useState, useEffect } from 'preact/hooks';
import { t, getLanguage } from '../utils/i18n';

interface ImageUploadProps {
  onImageLoad: (image: HTMLImageElement) => void;
}

export function ImageUpload({ onImageLoad }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [lang, setLang] = useState(getLanguage());

  useEffect(() => {
    const handleLangChange = () => {
      setLang(getLanguage());
    };
    window.addEventListener('languagechange', handleLangChange);
    return () => window.removeEventListener('languagechange', handleLangChange);
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        onImageLoad(img);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer?.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      class={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
        dragActive
          ? 'border-burnt-orange bg-burnt-orange/5 shadow-lg scale-[1.02]'
          : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface shadow-sm hover:shadow-md hover:border-gray-400 dark:hover:border-gray-600'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        class="hidden"
        aria-label="Upload image file"
      />
      <div class="mb-6">
        <svg
          class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {t('uploadImage')}
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {t('dragDropOrClick')}
      </p>
      <button
        onClick={() => fileInputRef.current?.click()}
        class="inline-flex items-center gap-2 px-6 py-3 bg-burnt-orange text-white font-medium rounded-lg shadow-sm hover:bg-[#b84a00] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-burnt-orange focus:ring-offset-2 dark:focus:ring-offset-dark-bg transition-all duration-200"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        {t('selectImage')}
      </button>
    </div>
  );
}
