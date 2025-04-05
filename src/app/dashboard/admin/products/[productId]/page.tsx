'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductFormBasic from '@/components/admin/ProductFormBasic';
import ProductCategories from '@/components/admin/ProductCategories';
import ProductMediaUpload from '@/components/admin/ProductMediaUpload';
import { Toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Tab } from '@headlessui/react';

// Match the MediaFile interface from ProductMediaUpload
interface MediaFile {
  url: string;
  alt: string;
  isPrimary: boolean;
  type: string;
}

// Material interface matching ProductCategories
interface Material {
  name: string;
  color?: string;
  quality?: string;
  weight?: number;
  unit?: string;
}

interface ProductFormData {
  // Basic info
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice: number;
  costPrice: number;
  stock: number;
  lowStockThreshold: number;
  
  // Categories and attributes
  categories: string[];
  type: string;
  materials: Material[];
  tags: string[];
  
  // Media
  images: MediaFile[];
  models: MediaFile[];
  
  // Flags
  featured: boolean;
  new: boolean;
  bestseller: boolean;
  hasAR: boolean;
  has3D: boolean;
}

interface EditProductPageProps {
  params: {
    productId: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const { productId } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
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
    
    // Flags
    featured: false,
    new: true,
    bestseller: false,
    hasAR: false,
    has3D: false,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const product = await response.json();
        
        // Transform API response to form data format
        setFormData({
          name: product.name || '',
          slug: product.slug || '',
          description: product.description || '',
          shortDescription: product.shortDescription || '',
          price: product.price || 0,
          salePrice: product.salePrice || 0,
          costPrice: product.costPrice || 0,
          stock: product.stock || 0,
          lowStockThreshold: product.lowStockThreshold || 5,
          
          categories: product.categories || [],
          type: product.type || 'ring',
          materials: product.materials || [],
          tags: product.tags || [],
          
          images: product.images || [],
          models: product.models || [],
          
          featured: product.featured || false,
          new: product.new || false,
          bestseller: product.bestseller || false,
          hasAR: product.hasAR || false,
          has3D: product.has3D || false,
        });
        
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch product data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);

  const handleBasicInfoChange = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleCategoriesChange = (categories: string[]) => {
    setFormData(prev => ({ ...prev, categories }));
  };

  const handleTypeChange = (type: string) => {
    setFormData(prev => ({ ...prev, type }));
  };

  const handleMaterialsChange = (materials: Material[]) => {
    setFormData(prev => ({ ...prev, materials }));
  };

  const handleTagsChange = (tags: string[]) => {
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleImagesChange = (images: MediaFile[]) => {
    setFormData(prev => ({ 
      ...prev, 
      images,
      hasAR: prev.hasAR || false,
    }));
  };

  const handleModelsChange = (models: MediaFile[]) => {
    const has3D = models.some(model => model.type === '3d');
    const hasAR = models.some(model => model.type === 'ar');
    
    setFormData(prev => ({ 
      ...prev, 
      models,
      has3D,
      hasAR,
    }));
  };

  const handleFlagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Validate before submission
      if (!formData.name.trim()) {
        throw new Error('Product name is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Product description is required');
      }
      if (!formData.shortDescription.trim()) {
        throw new Error('Short description is required');
      }
      if (formData.price <= 0) {
        throw new Error('Price must be greater than zero');
      }
      if (formData.categories.length === 0) {
        throw new Error('At least one category is required');
      }
      if (formData.materials.length === 0) {
        throw new Error('At least one material is required');
      }
      
      // Submit form data to API
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        // Get the error message from the server
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update product');
      }
      
      // Show success toast
      setToast({
        message: 'Product updated successfully',
        type: 'success',
      });
      
      // Hide the toast after 3 seconds
      setTimeout(() => {
        setToast(null);
      }, 3000);
      
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error updating product:', error);
      setToast({
        message: error instanceof Error ? error.message : 'Failed to update product',
        type: 'error',
      });
      setIsSubmitting(false);
    }
  };

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-16 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-nile-teal"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-16 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 p-4 rounded-md">
            <h2 className="text-lg font-medium text-red-800">Error</h2>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <div className="mt-4">
              <Button onClick={() => router.push('/dashboard/admin/products')}>
                Back to Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast notification */}
        {toast && (
          <div className="fixed top-4 right-4 z-50">
            <Toast
              message={toast.message}
              type={toast.type}
              isVisible={true}
              onClose={() => setToast(null)}
            />
          </div>
        )}
        
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="mt-2 text-sm text-gray-600">
            Update your product information
          </p>
        </div>
        
        {/* Form tabs */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Tab.Group>
            <Tab.List className="flex border-b border-gray-200">
              {['Basic Info', 'Categories & Attributes', 'Media', 'Settings'].map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    classNames(
                      'py-4 px-6 text-sm font-medium border-b-2 focus:outline-none',
                      selected
                        ? 'text-nile-teal border-nile-teal'
                        : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                    )
                  }
                >
                  {category}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
              {/* Basic Info */}
              <Tab.Panel className="p-6">
                <ProductFormBasic
                  initialData={formData}
                  onSubmit={handleBasicInfoChange}
                  isSubmitting={isSubmitting}
                />
              </Tab.Panel>
              
              {/* Categories & Attributes */}
              <Tab.Panel className="p-6">
                <ProductCategories
                  initialCategories={formData.categories}
                  initialType={formData.type}
                  initialMaterials={formData.materials}
                  initialTags={formData.tags}
                  onCategoriesChange={handleCategoriesChange}
                  onTypeChange={handleTypeChange}
                  onMaterialsChange={handleMaterialsChange}
                  onTagsChange={handleTagsChange}
                />
              </Tab.Panel>
              
              {/* Media */}
              <Tab.Panel className="p-6">
                <ProductMediaUpload
                  initialImages={formData.images}
                  initialModels={formData.models}
                  onImagesChange={handleImagesChange}
                  onModelsChange={handleModelsChange}
                />
              </Tab.Panel>
              
              {/* Settings */}
              <Tab.Panel className="p-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Product Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="featured"
                          name="featured"
                          type="checkbox"
                          checked={formData.featured}
                          onChange={handleFlagChange}
                          className="h-4 w-4 text-nile-teal focus:ring-nile-teal border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="featured" className="font-medium text-gray-700">Featured Product</label>
                        <p className="text-gray-500">Featured products appear on the homepage and get more visibility.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="new"
                          name="new"
                          type="checkbox"
                          checked={formData.new}
                          onChange={handleFlagChange}
                          className="h-4 w-4 text-nile-teal focus:ring-nile-teal border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="new" className="font-medium text-gray-700">New Arrival</label>
                        <p className="text-gray-500">Mark this product as a new arrival. It will appear in the "New Arrivals" section.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="bestseller"
                          name="bestseller"
                          type="checkbox"
                          checked={formData.bestseller}
                          onChange={handleFlagChange}
                          className="h-4 w-4 text-nile-teal focus:ring-nile-teal border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="bestseller" className="font-medium text-gray-700">Bestseller</label>
                        <p className="text-gray-500">Mark this product as a bestseller. It will be highlighted in search results.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="has3D"
                          name="has3D"
                          type="checkbox"
                          checked={formData.has3D}
                          onChange={handleFlagChange}
                          disabled={formData.models.some(model => model.type === '3d')}
                          className="h-4 w-4 text-nile-teal focus:ring-nile-teal border-gray-300 rounded disabled:opacity-50"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="has3D" className="font-medium text-gray-700">Has 3D Model</label>
                        <p className="text-gray-500">
                          {formData.models.some(model => model.type === '3d')
                            ? 'Automatically marked as having a 3D model based on your uploads.'
                            : 'Check this if you have a 3D model for this product.'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="hasAR"
                          name="hasAR"
                          type="checkbox"
                          checked={formData.hasAR}
                          onChange={handleFlagChange}
                          disabled={formData.models.some(model => model.type === 'ar')}
                          className="h-4 w-4 text-nile-teal focus:ring-nile-teal border-gray-300 rounded disabled:opacity-50"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="hasAR" className="font-medium text-gray-700">Has AR Model</label>
                        <p className="text-gray-500">
                          {formData.models.some(model => model.type === 'ar')
                            ? 'Automatically marked as having an AR model based on your uploads.'
                            : 'Check this if you have an AR model for this product.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
          
          {/* Form actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="mr-3"
              onClick={() => router.push('/dashboard/admin/products')}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating Product...
                </>
              ) : (
                'Update Product'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 