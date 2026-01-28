import { useRef, useState } from 'preact/hooks';

interface ImageUploadProps {
  onImageLoad: (image: HTMLImageElement) => void;
}

export function ImageUpload({ onImageLoad }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

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
      class={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragActive
          ? 'border-burnt-orange bg-burnt-orange/10'
          : 'border-gray-300 dark:border-gray-600'
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
      <p class="text-gray-700 dark:text-gray-300 mb-4">
        Drag and drop an image here, or
      </p>
      <button
        onClick={() => fileInputRef.current?.click()}
        class="px-4 py-2 bg-burnt-orange text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-burnt-orange focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
      >
        Choose File
      </button>
    </div>
  );
}
