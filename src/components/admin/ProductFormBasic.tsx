'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface ProductFormBasicProps {
  initialData?: {
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    price: number;
    salePrice?: number;
    costPrice?: number;
    stock: number;
    lowStockThreshold?: number;
  };
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export default function ProductFormBasic({
  initialData,
  onSubmit,
  isSubmitting
}: ProductFormBasicProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    shortDescription: initialData?.shortDescription || '',
    price: initialData?.price || 0,
    salePrice: initialData?.salePrice || 0,
    costPrice: initialData?.costPrice || 0,
    stock: initialData?.stock || 0,
    lowStockThreshold: initialData?.lowStockThreshold || 5,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (['price', 'salePrice', 'costPrice', 'stock', 'lowStockThreshold'].includes(name)) {
      setFormData({
        ...formData,
        [name]: value === '' ? '' : Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });

      // Auto-generate slug from name
      if (name === 'name' && !initialData?.slug) {
        setFormData(prev => ({
          ...prev,
          slug: value
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-'),
        }));
      }
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than zero';
    if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative';
    
    if (formData.salePrice > 0 && formData.salePrice >= formData.price) {
      newErrors.salePrice = 'Sale price must be less than regular price';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm ${
              errors.name ? 'border-red-500' : ''
            }`}
            placeholder="e.g. Diamond Engagement Ring"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        
        <div className="space-y-1">
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm ${
              errors.slug ? 'border-red-500' : ''
            }`}
            placeholder="e.g. diamond-engagement-ring"
          />
          {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
          <p className="text-xs text-gray-500 mt-1">URL-friendly version of the product name</p>
        </div>
        
        <div className="space-y-1 md:col-span-2">
          <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">
            Short Description <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="shortDescription"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm ${
              errors.shortDescription ? 'border-red-500' : ''
            }`}
            placeholder="Brief product description (shown in listings)"
            maxLength={200}
          />
          {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription}</p>}
          <p className="text-xs text-gray-500 mt-1">
            {formData.shortDescription.length}/200 characters
          </p>
        </div>
        
        <div className="space-y-1 md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Full Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm ${
              errors.description ? 'border-red-500' : ''
            }`}
            placeholder="Detailed product description (shown on product page)"
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>
        
        <div className="space-y-1">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Regular Price <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className={`block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-nile-teal focus:ring-nile-teal sm:text-sm ${
                errors.price ? 'border-red-500' : ''
              }`}
              placeholder="0.00"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">USD</span>
            </div>
          </div>
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
        </div>
        
        <div className="space-y-1">
          <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700">
            Sale Price
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="salePrice"
              name="salePrice"
              min="0"
              step="0.01"
              value={formData.salePrice}
              onChange={handleChange}
              className={`block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-nile-teal focus:ring-nile-teal sm:text-sm ${
                errors.salePrice ? 'border-red-500' : ''
              }`}
              placeholder="0.00"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">USD</span>
            </div>
          </div>
          {errors.salePrice && <p className="text-red-500 text-xs mt-1">{errors.salePrice}</p>}
        </div>
        
        <div className="space-y-1">
          <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700">
            Cost Price
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="costPrice"
              name="costPrice"
              min="0"
              step="0.01"
              value={formData.costPrice}
              onChange={handleChange}
              className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
              placeholder="0.00"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">USD</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Internal use only (not displayed to customers)</p>
        </div>
        
        <div className="space-y-1">
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
            Stock Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            min="0"
            step="1"
            value={formData.stock}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm ${
              errors.stock ? 'border-red-500' : ''
            }`}
            placeholder="0"
          />
          {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
        </div>
        
        <div className="space-y-1">
          <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700">
            Low Stock Threshold
          </label>
          <input
            type="number"
            id="lowStockThreshold"
            name="lowStockThreshold"
            min="0"
            step="1"
            value={formData.lowStockThreshold}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
            placeholder="5"
          />
          <p className="text-xs text-gray-500 mt-1">Alerts when stock falls below this number</p>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            'Save Product Information'
          )}
        </Button>
      </div>
    </form>
  );
} 