import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface Props {
  image: File | null;
  currentImage?: string | null;
  onChange: (file: File | null) => void;
  onRemove?: () => void;
}

export default function ImageUpload({ image, currentImage, onChange, onRemove }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    }
  };

  const displayImage = preview || (currentImage ? `/storage/${currentImage}` : null);

  return (
    <div>
      {displayImage ? (
        <div className="relative">
          <img
            src={displayImage}
            alt="Featured"
            className="h-48 w-full rounded-lg object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white transition-colors hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-indigo-400 hover:bg-indigo-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-indigo-500 dark:hover:bg-gray-600"
        >
          <ImageIcon className="mb-3 h-12 w-12 text-gray-400 dark:text-gray-500" />
          <p className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Click to upload image
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG, GIF, WEBP up to 5MB
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {displayImage && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <Upload className="h-4 w-4" />
          Change Image
        </button>
      )}
    </div>
  );
}