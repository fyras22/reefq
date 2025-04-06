'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { TrashIcon, ArrowPathIcon, CubeIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { ProductImage, ProductModel } from '@/types/product';

// Interface to handle file uploads that may not yet have all required properties
// This acts as a bridge between our upload UI and the defined ProductImage/ProductModel types
interface MediaFile {
  id?: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  type: string;
}

interface ProductMediaUploadProps {
  title?: string;
  description?: string;
  allowedTypes?: string[];
  maxFiles?: number;
  fileType: 'image' | 'model';
  uploadEndpoint: string;
  initialFiles?: MediaFile[];
  onChange: (files: MediaFile[]) => void;
}

export default function ProductMediaUpload({
  title = 'Media Upload',
  description = 'Upload files for your product',
  allowedTypes = ['image/jpeg', 'image/png'],
  maxFiles = 10,
  fileType,
  uploadEndpoint,
  initialFiles = [],
  onChange,
}: ProductMediaUploadProps) {
  const [files, setFiles] = useState<MediaFile[]>(initialFiles);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    setError(null);

    // Check if we would exceed the max files limit
    if (files.length + selectedFiles.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files`);
      setUploading(false);
      return;
    }

    // Check file types
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        setError(`File type ${file.type} is not allowed`);
        setUploading(false);
        return;
      }
    }

    try {
      // Upload each file
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append('file', file);
        
        // For models, determine if it's a 3D model or AR model based on file extension
        let fileTypeParam = fileType;
        if (fileType === 'model') {
          const fileExt = file.name.split('.').pop()?.toLowerCase();
          // Use 'model' type instead of '3d' or 'ar'
          fileTypeParam = 'model';
        }
        
        // When sending to the server, we might need different type values
        const serverFileType = fileType === 'model' 
          ? (file.name.endsWith('.usdz') ? 'model-ar' : 'model-3d')
          : 'image';
        
        formData.append('type', serverFileType);

        const response = await fetch(uploadEndpoint, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to upload ${fileType}`);
        }

        const data = await response.json();
        
        const newFile: MediaFile = {
          id: data.id || crypto.randomUUID(),
          url: data.url,
          alt: file.name.split('.')[0], // Use filename as alt text initially
          isPrimary: files.length === 0, // First file is primary by default
          type: fileType === 'model' ? 
                 (file.name.endsWith('.usdz') ? 'ar' : '3d') : 
                 'image'
        };
        
        const updatedFiles = [...files, newFile];
        setFiles(updatedFiles);
        onChange(updatedFiles);
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error(`Error uploading ${fileType}:`, err);
      setError(err instanceof Error ? err.message : `Failed to upload ${fileType}`);
    } finally {
      setUploading(false);
    }
  };

  const handleMakePrimary = (index: number) => {
    const updatedFiles = files.map((file, i) => ({
      ...file,
      isPrimary: i === index
    }));
    setFiles(updatedFiles);
    onChange(updatedFiles);
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...files];
    const removedFile = updatedFiles.splice(index, 1)[0];
    
    // If we removed the primary file and there are still files, make the first one primary
    if (removedFile.isPrimary && updatedFiles.length > 0) {
      updatedFiles[0].isPrimary = true;
    }
    
    setFiles(updatedFiles);
    onChange(updatedFiles);
  };

  const handleAltTextChange = (index: number, altText: string) => {
    const updatedFiles = files.map((file, i) => 
      i === index ? { ...file, alt: altText } : file
    );
    setFiles(updatedFiles);
    onChange(updatedFiles);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center"
        >
          {uploading ? (
            <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
          ) : fileType === 'image' ? (
            <PhotoIcon className="h-5 w-5 mr-2" />
          ) : (
            <CubeIcon className="h-5 w-5 mr-2" />
          )}
          Add {fileType === 'image' ? 'Image' : 'Model'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(',')}
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
      
      {files.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          {fileType === 'image' ? (
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          ) : (
            <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
          )}
          <p className="mt-2 text-sm text-gray-500">
            No {fileType === 'image' ? 'images' : 'models'} uploaded yet
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Click "Add {fileType === 'image' ? 'Image' : 'Model'}" to upload
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div 
              key={file.id || index} 
              className={`relative group border rounded-lg overflow-hidden ${
                file.isPrimary ? 'ring-2 ring-nile-teal' : ''
              }`}
            >
              <div className="aspect-square relative">
                {fileType === 'image' ? (
                  <Image
                    src={file.url}
                    alt={file.alt}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <CubeIcon className="h-12 w-12 text-gray-400" />
                    <span className="absolute bottom-2 right-2 text-xs font-medium px-2 py-1 bg-gray-200 rounded">
                      {file.type}
                    </span>
                  </div>
                )}
                {/* Hover overlay with actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex items-center justify-center w-full">
                    <button
                      type="button"
                      onClick={() => handleMakePrimary(index)}
                      disabled={file.isPrimary}
                      className={`p-1 rounded-full ${
                        file.isPrimary ? 'bg-nile-teal text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                      } mx-1`}
                      title={file.isPrimary ? 'Primary' : 'Make Primary'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="p-1 bg-white text-red-600 rounded-full hover:bg-red-100 mx-1"
                      title="Remove"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              {/* Alt text input field */}
              <div className="p-2 bg-white">
                <input
                  type="text"
                  value={file.alt}
                  onChange={(e) => handleAltTextChange(index, e.target.value)}
                  placeholder="Alt text"
                  className="w-full text-xs p-1 border border-gray-300 rounded"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 