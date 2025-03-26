'use client';

import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Upload, X, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  onImagesSelected: (files: File[]) => void;
  maxImages: number;
  maxFileSize: number;
  supportedFormats: string[];
}

interface ImagePreview {
  file: File;
  preview: string;
  error?: string;
}

export default function ImageUploader({
  onImagesSelected,
  maxImages,
  maxFileSize,
  supportedFormats,
}: ImageUploaderProps) {
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!supportedFormats.includes(file.type)) {
      return `Unsupported file format. Please upload ${supportedFormats.join(', ')} files.`;
    }
    if (file.size > maxFileSize) {
      return `File size exceeds ${maxFileSize / (1024 * 1024)}MB limit.`;
    }
    return null;
  };

  const processFiles = useCallback(async (files: File[]) => {
    setError(null);
    const newPreviews: ImagePreview[] = [];
    const errors: string[] = [];

    for (const file of files) {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
        continue;
      }

      try {
        const preview = await createPreview(file);
        newPreviews.push({ file, preview });
      } catch (err) {
        errors.push(`${file.name}: Failed to create preview`);
      }
    }

    if (errors.length > 0) {
      setError(errors.join('\n'));
    }

    if (newPreviews.length > 0) {
      setPreviews(prev => {
        const combined = [...prev, ...newPreviews].slice(0, maxImages);
        onImagesSelected(combined.map(p => p.file));
        return combined;
      });
    }
  }, [maxImages, onImagesSelected, supportedFormats, maxFileSize]);

  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setIsDragging(false);
      processFiles(acceptedFiles);
    },
    [processFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: supportedFormats.reduce((acc, format) => ({ ...acc, [format]: [] }), {}),
    maxSize: maxFileSize,
    multiple: true,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    setPreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      onImagesSelected(newPreviews.map(p => p.file));
      return newPreviews;
    });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(previews);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPreviews(items);
    onImagesSelected(items.map(p => p.file));
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200 ease-in-out
          ${isDragActive || isDragging
            ? 'border-brand-teal bg-brand-teal/5'
            : 'border-gray-300 hover:border-brand-teal/50'
          }
        `}
      >
        <input {...getInputProps()} ref={fileInputRef} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <Upload className="w-12 h-12 text-gray-400" />
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">
              {isDragActive || isDragging
                ? 'Drop the files here'
                : 'Drag and drop images here, or click to select files'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: {supportedFormats.join(', ')}
              <br />
              Max file size: {maxFileSize / (1024 * 1024)}MB
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div className="text-sm text-red-700 whitespace-pre-line">{error}</div>
        </div>
      )}

      {previews.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Selected Images ({previews.length}/{maxImages})
          </h3>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="images" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                >
                  {previews.map((preview, index) => (
                    <Draggable key={index} draggableId={`image-${index}`} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100"
                        >
                          <img
                            src={preview.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            aria-label="Remove image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                            Image {index + 1}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
    </div>
  );
} 