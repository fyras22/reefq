'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { ProductVariant, ProductMaterial, ProductImage } from '@/types/product';

interface ProductVariantsProps {
  initialVariants?: ProductVariant[];
  productType: string;
  productMaterials: ProductMaterial[];
  productImages: ProductImage[];
  onVariantsChange: (variants: ProductVariant[]) => void;
}

export default function ProductVariants({
  initialVariants = [],
  productType,
  productMaterials,
  productImages,
  onVariantsChange,
}: ProductVariantsProps) {
  const [variants, setVariants] = useState<ProductVariant[]>(initialVariants);
  const [isAddingVariant, setIsAddingVariant] = useState(false);

  // New variant form state
  const [newVariant, setNewVariant] = useState<ProductVariant>({
    id: crypto.randomUUID(),
    name: '',
    sku: '',
    price: 0,
    salePrice: 0,
    stock: 0,
    materials: [],
    images: [],
  });

  // Size options based on product type
  const getSizeOptions = () => {
    switch (productType) {
      case 'ring':
        return [...Array(15)].map((_, i) => (i + 4).toString());
      case 'bracelet':
        return ['XS', 'S', 'M', 'L', 'XL', 'Adjustable'];
      case 'necklace':
        return ['16"', '18"', '20"', '22"', '24"', 'Adjustable'];
      case 'earring':
        return ['Standard', 'Mini', 'Large'];
      default:
        return ['One Size'];
    }
  };

  // Color options
  const colorOptions = [
    'Yellow Gold',
    'Rose Gold',
    'White Gold',
    'Silver',
    'Platinum',
    'Black',
    'Multi-colored',
  ];

  const handleAddVariant = () => {
    // Validate required fields
    if (!newVariant.name || !newVariant.sku || newVariant.price <= 0) {
      return;
    }

    const updatedVariants = [...variants, newVariant];
    setVariants(updatedVariants);
    onVariantsChange(updatedVariants);
    
    // Reset form
    setNewVariant({
      id: crypto.randomUUID(),
      name: '',
      sku: '',
      price: 0,
      salePrice: 0,
      stock: 0,
      materials: [],
      images: [],
    });
    
    setIsAddingVariant(false);
  };

  const handleRemoveVariant = (id: string) => {
    const updatedVariants = variants.filter(v => v.id !== id);
    setVariants(updatedVariants);
    onVariantsChange(updatedVariants);
  };

  const handleEditVariant = (id: string, field: string, value: any) => {
    const updatedVariants = variants.map(variant => {
      if (variant.id === id) {
        return { ...variant, [field]: value };
      }
      return variant;
    });
    
    setVariants(updatedVariants);
    onVariantsChange(updatedVariants);
  };

  const handleToggleMaterial = (variantId: string, material: any) => {
    const updatedVariants = variants.map(variant => {
      if (variant.id === variantId) {
        // Check if material is already in variant materials
        const materialExists = variant.materials?.some(m => m.name === material.name);
        
        if (materialExists) {
          // Remove material
          return {
            ...variant,
            materials: variant.materials?.filter(m => m.name !== material.name) || []
          };
        } else {
          // Add material
          return {
            ...variant,
            materials: [...(variant.materials || []), material]
          };
        }
      }
      return variant;
    });
    
    setVariants(updatedVariants);
    onVariantsChange(updatedVariants);
  };

  const handleToggleImage = (variantId: string, image: any) => {
    const updatedVariants = variants.map(variant => {
      if (variant.id === variantId) {
        // Check if image is already in variant images
        const imageExists = variant.images?.some(img => img.url === image.url);
        
        if (imageExists) {
          // Remove image
          return {
            ...variant,
            images: variant.images?.filter(img => img.url !== image.url) || []
          };
        } else {
          // Add image
          return {
            ...variant,
            images: [...(variant.images || []), image]
          };
        }
      }
      return variant;
    });
    
    setVariants(updatedVariants);
    onVariantsChange(updatedVariants);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Product Variants</h2>
        {!isAddingVariant && (
          <Button 
            type="button" 
            onClick={() => setIsAddingVariant(true)}
            className="inline-flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Variant
          </Button>
        )}
      </div>
      
      {variants.length === 0 && !isAddingVariant ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No variants</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add variants for different sizes, colors, materials or other options.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Existing variants */}
          {variants.length > 0 && (
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variant
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Options
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {variants.map((variant) => (
                    <tr key={variant.id}>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={variant.name}
                          onChange={(e) => handleEditVariant(variant.id, 'name', e.target.value)}
                          className="w-full border-gray-300 rounded-md shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
                        />
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) => handleEditVariant(variant.id, 'sku', e.target.value)}
                          className="w-full border-gray-300 rounded-md shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
                        />
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Price</label>
                            <input
                              type="number"
                              value={variant.price}
                              onChange={(e) => handleEditVariant(variant.id, 'price', parseFloat(e.target.value) || 0)}
                              min="0"
                              step="0.01"
                              className="w-full border-gray-300 rounded-md shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Sale</label>
                            <input
                              type="number"
                              value={variant.salePrice || ''}
                              onChange={(e) => {
                                const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                                handleEditVariant(variant.id, 'salePrice', value);
                              }}
                              min="0"
                              step="0.01"
                              className="w-full border-gray-300 rounded-md shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => handleEditVariant(variant.id, 'stock', parseInt(e.target.value) || 0)}
                          min="0"
                          step="1"
                          className="w-full border-gray-300 rounded-md shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
                        />
                      </td>
                      <td className="px-3 py-4">
                        <div className="space-y-2">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Size</label>
                            <select
                              value={variant.size || ''}
                              onChange={(e) => handleEditVariant(variant.id, 'size', e.target.value)}
                              className="w-full border-gray-300 rounded-md shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
                            >
                              <option value="">Select Size</option>
                              {getSizeOptions().map((size) => (
                                <option key={size} value={size}>{size}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Color</label>
                            <select
                              value={variant.color || ''}
                              onChange={(e) => handleEditVariant(variant.id, 'color', e.target.value)}
                              className="w-full border-gray-300 rounded-md shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
                            >
                              <option value="">Select Color</option>
                              {colorOptions.map((color) => (
                                <option key={color} value={color}>{color}</option>
                              ))}
                            </select>
                          </div>
                          
                          {/* Materials and Images selector would be dropdowns or modals in a real implementation */}
                          <div>
                            <button
                              type="button"
                              className="text-sm text-nile-teal hover:text-nile-teal-dark"
                              onClick={() => {
                                // This would open a modal in a real implementation
                                alert('Materials selector would open here');
                              }}
                            >
                              {variant.materials?.length || 0} materials selected
                            </button>
                          </div>
                          <div>
                            <button
                              type="button"
                              className="text-sm text-nile-teal hover:text-nile-teal-dark"
                              onClick={() => {
                                // This would open a modal in a real implementation
                                alert('Images selector would open here');
                              }}
                            >
                              {variant.images?.length || 0} images selected
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(variant.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Form to add a new variant */}
          {isAddingVariant && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-medium mb-4">Add New Variant</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="variantName" className="block text-sm font-medium text-gray-700 mb-1">
                    Variant Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="variantName"
                    value={newVariant.name}
                    onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
                    placeholder="e.g. Silver - Size 7"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="variantSku" className="block text-sm font-medium text-gray-700 mb-1">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="variantSku"
                    value={newVariant.sku}
                    onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
                    placeholder="e.g. RING-SIL-007"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="variantPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="variantPrice"
                    value={newVariant.price || ''}
                    onChange={(e) => setNewVariant({ ...newVariant, price: parseFloat(e.target.value) || 0 })}
                    min="0"
                    step="0.01"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="variantSalePrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Sale Price (Optional)
                  </label>
                  <input
                    type="number"
                    id="variantSalePrice"
                    value={newVariant.salePrice || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                      setNewVariant({ ...newVariant, salePrice: value });
                    }}
                    min="0"
                    step="0.01"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label htmlFor="variantStock" className="block text-sm font-medium text-gray-700 mb-1">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="variantStock"
                    value={newVariant.stock || ''}
                    onChange={(e) => setNewVariant({ ...newVariant, stock: parseInt(e.target.value) || 0 })}
                    min="0"
                    step="1"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
                    placeholder="0"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="variantSize" className="block text-sm font-medium text-gray-700 mb-1">
                    Size
                  </label>
                  <select
                    id="variantSize"
                    value={newVariant.size || ''}
                    onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
                  >
                    <option value="">Select Size</option>
                    {getSizeOptions().map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="variantColor" className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <select
                    id="variantColor"
                    value={newVariant.color || ''}
                    onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
                  >
                    <option value="">Select Color</option>
                    {colorOptions.map((color) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="bg-white p-4 border border-gray-200 rounded-lg mb-4">
                <h4 className="text-sm font-medium mb-2">Select Materials</h4>
                <p className="text-xs text-gray-500 mb-2">Choose which materials apply to this variant:</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {productMaterials.map((material, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`material-${index}`}
                        checked={newVariant.materials?.some(m => m.name === material.name) || false}
                        onChange={() => {
                          // Check if material is already selected
                          const isSelected = newVariant.materials?.some(m => m.name === material.name);
                          
                          if (isSelected) {
                            // Remove material
                            setNewVariant({
                              ...newVariant,
                              materials: newVariant.materials?.filter(m => m.name !== material.name)
                            });
                          } else {
                            // Add material
                            setNewVariant({
                              ...newVariant,
                              materials: [...(newVariant.materials || []), material]
                            });
                          }
                        }}
                        className="h-4 w-4 text-nile-teal focus:ring-nile-teal border-gray-300 rounded"
                      />
                      <label htmlFor={`material-${index}`} className="ml-2 block text-sm text-gray-700">
                        {material.name}{material.quality ? ` (${material.quality})` : ''}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-4 border border-gray-200 rounded-lg mb-4">
                <h4 className="text-sm font-medium mb-2">Select Images</h4>
                <p className="text-xs text-gray-500 mb-2">Choose specific images for this variant:</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {productImages.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-square relative overflow-hidden rounded border border-gray-200">
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          className="object-cover"
                        />
                        <input
                          type="checkbox"
                          id={`image-${index}`}
                          checked={newVariant.images?.some(img => img.url === image.url) || false}
                          onChange={() => {
                            // Check if image is already selected
                            const isSelected = newVariant.images?.some(img => img.url === image.url);
                            
                            if (isSelected) {
                              // Remove image
                              setNewVariant({
                                ...newVariant,
                                images: newVariant.images?.filter(img => img.url !== image.url)
                              });
                            } else {
                              // Add image
                              setNewVariant({
                                ...newVariant,
                                images: [...(newVariant.images || []), image]
                              });
                            }
                          }}
                          className="absolute top-2 right-2 h-4 w-4 text-nile-teal focus:ring-nile-teal border-gray-300 rounded z-10"
                        />
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-1">{image.alt}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingVariant(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleAddVariant}
                  disabled={!newVariant.name || !newVariant.sku || newVariant.price <= 0}
                >
                  Add Variant
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 