'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductFormBasic from '@/components/admin/ProductFormBasic';
import ProductCategories from '@/components/admin/ProductCategories';
import ProductMediaUpload from '@/components/admin/ProductMediaUpload';
import ProductVariants from '@/components/admin/ProductVariants';
import { Toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Tab } from '@headlessui/react';
import { ProductFormData, ProductImage, ProductModel } from '@/types/product';

// MediaFile interface for uploads
interface MediaFile {
  id?: string;
  url: string;
  alt: string;
  type: string;
  isPrimary: boolean;
}

// Material interface matching ProductCategories
interface Material {
  name: string;
  color?: string;
  quality?: string;
  weight?: number;
  unit?: string;
}

// Variant interface 
interface Variant {
  id: string;
  name: string;
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  size?: string;
  color?: string;
  materials?: Material[];
  images?: MediaFile[];
}

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    // Basic info
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: 0,
    salePrice: 0,
    costPrice: 0,
    stock: 0,
    lowStockThreshold: 5,
    
    // Categories and attributes
    categories: [],
    type: 'ring',
    materials: [],
    tags: [],
    
    // Media
    images: [],
    models: [],
    
    // Variants
    variants: [],
    
    // Flags
    featured: false,
    new: true,
    bestseller: false,
    hasAR: false,
    has3D: false,
  });

  const handleBasicInfoChange = (info: any) => {
    setFormData(prev => ({
      ...prev,
      ...info
    }));
  };

  const handleCategoriesChange = (categoryData: any) => {
    setFormData(prev => ({
      ...prev,
      categories: categoryData.categories,
      type: categoryData.type,
      materials: categoryData.materials,
      tags: categoryData.tags
    }));
  };

  const handleImagesChange = (mediaFiles: MediaFile[]) => {
    // Convert MediaFile[] to ProductImage[]
    const productImages: ProductImage[] = mediaFiles.map(img => ({
      url: img.url,
      alt: img.alt,
      isPrimary: img.isPrimary
    }));
    
    setFormData(prev => ({
      ...prev,
      images: productImages
    }));
  };

  const handleModelsChange = (mediaFiles: MediaFile[]) => {
    // Convert MediaFile[] to ProductModel[]
    const productModels: ProductModel[] = mediaFiles.map(model => ({
      url: model.url,
      type: model.type === '3d' ? '3d' : 'ar',
      isPrimary: model.isPrimary,
      alt: model.alt
    }));
    
    setFormData(prev => ({
      ...prev,
      models: productModels,
      has3D: mediaFiles.some(m => m.type === '3d'),
      hasAR: mediaFiles.some(m => m.type === 'ar')
    }));
  };

  const handleVariantsChange = (newVariants: any) => {
    setFormData(prev => ({
      ...prev,
      variants: newVariants
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      setToast({
        message: 'Product created successfully!',
        type: 'success',
      });

      // Redirect to products list after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/admin/products');
      }, 2000);
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : 'An error occurred',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert product types to MediaFile type for the upload component
  const imagesAsMediaFiles: MediaFile[] = formData.images.map(img => ({
    id: crypto.randomUUID(),
    url: img.url,
    alt: img.alt,
    type: 'image',
    isPrimary: img.isPrimary
  }));
  
  const modelsAsMediaFiles: MediaFile[] = formData.models.map(model => ({
    id: crypto.randomUUID(),
    url: model.url,
    alt: model.alt || '',
    type: model.type,
    isPrimary: model.isPrimary
  }));

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">New Product</h1>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          {isSubmitting ? 'Saving...' : 'Save Product'}
        </Button>
      </div>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <Tab.Group>
        <Tab.List className="flex space-x-2 rounded-xl bg-gray-100 p-1 mb-6">
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
             ${selected ? 'bg-white shadow' : 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-900'}`
          }>
            Basic Info
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
             ${selected ? 'bg-white shadow' : 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-900'}`
          }>
            Categories
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
             ${selected ? 'bg-white shadow' : 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-900'}`
          }>
            Media
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
             ${selected ? 'bg-white shadow' : 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-900'}`
          }>
            Variants
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <ProductFormBasic
              initialData={formData}
              onSubmit={handleBasicInfoChange}
              isSubmitting={isSubmitting}
            />
          </Tab.Panel>
          <Tab.Panel>
            <ProductCategories
              initialCategories={formData.categories}
              initialType={formData.type}
              initialMaterials={formData.materials}
              initialTags={formData.tags}
              onCategoriesChange={(categories) => setFormData(prev => ({ ...prev, categories }))}
              onTypeChange={(type) => setFormData(prev => ({ ...prev, type }))}
              onMaterialsChange={(materials) => setFormData(prev => ({ ...prev, materials }))}
              onTagsChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
            />
          </Tab.Panel>
          <Tab.Panel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ProductMediaUpload
                  title="Product Images"
                  description="Upload product images. First image will be used as the main product image."
                  allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                  maxFiles={10}
                  initialFiles={imagesAsMediaFiles}
                  onChange={handleImagesChange}
                  uploadEndpoint="/api/uploads/images"
                  fileType="image"
                />
              </div>
              <div>
                <ProductMediaUpload
                  title="3D Models & AR Files"
                  description="Upload 3D models (GLB/GLTF) and AR files (USDZ) for interactive product views."
                  allowedTypes={['model/gltf-binary', 'model/gltf+json', 'application/octet-stream']}
                  maxFiles={5}
                  initialFiles={modelsAsMediaFiles}
                  onChange={handleModelsChange}
                  uploadEndpoint="/api/uploads/models"
                  fileType="model"
                />
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <ProductVariants
              initialVariants={formData.variants}
              productType={formData.type}
              productMaterials={formData.materials}
              productImages={formData.images}
              onVariantsChange={handleVariantsChange}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
} 