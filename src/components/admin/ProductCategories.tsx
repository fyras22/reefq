'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ProductCategoriesProps {
  initialCategories?: string[];
  initialType?: string;
  initialMaterials?: {
    name: string;
    color?: string;
    quality?: string;
    weight?: number;
    unit?: string;
  }[];
  initialTags?: string[];
  onCategoriesChange: (categories: string[]) => void;
  onTypeChange: (type: string) => void;
  onMaterialsChange: (materials: any[]) => void;
  onTagsChange: (tags: string[]) => void;
}

// Predefined categories
const PREDEFINED_CATEGORIES = [
  'Rings',
  'Engagement Rings',
  'Wedding Bands',
  'Necklaces',
  'Pendants',
  'Bracelets',
  'Earrings',
  'Luxury',
  'Gold Collection',
  'Diamond Collection',
  'Gemstone Collection',
  'Birthstone Collection',
];

// Predefined materials
const PREDEFINED_MATERIALS = [
  'Gold',
  'White Gold',
  'Rose Gold',
  'Platinum',
  'Silver',
  'Sterling Silver',
  'Diamond',
  'Ruby',
  'Sapphire',
  'Emerald',
  'Pearl',
  'Amethyst',
];

export default function ProductCategories({
  initialCategories = [],
  initialType = 'ring',
  initialMaterials = [],
  initialTags = [],
  onCategoriesChange,
  onTypeChange,
  onMaterialsChange,
  onTagsChange,
}: ProductCategoriesProps) {
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [newCategory, setNewCategory] = useState('');
  const [type, setType] = useState(initialType);
  const [materials, setMaterials] = useState(initialMaterials);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState('');
  
  // New material form state
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    color: '',
    quality: '',
    weight: '',
    unit: 'g',
  });

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()];
      setCategories(updatedCategories);
      onCategoriesChange(updatedCategories);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (category: string) => {
    const updatedCategories = categories.filter(c => c !== category);
    setCategories(updatedCategories);
    onCategoriesChange(updatedCategories);
  };

  const handleSelectPredefinedCategory = (category: string) => {
    if (!categories.includes(category)) {
      const updatedCategories = [...categories, category];
      setCategories(updatedCategories);
      onCategoriesChange(updatedCategories);
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
    onTypeChange(e.target.value);
  };

  const handleAddMaterial = () => {
    if (newMaterial.name.trim()) {
      const materialToAdd = {
        name: newMaterial.name.trim(),
        color: newMaterial.color.trim() || undefined,
        quality: newMaterial.quality.trim() || undefined,
        weight: newMaterial.weight ? parseFloat(newMaterial.weight) : undefined,
        unit: newMaterial.unit || 'g',
      };
      
      const updatedMaterials = [...materials, materialToAdd];
      setMaterials(updatedMaterials);
      onMaterialsChange(updatedMaterials);
      
      // Reset form
      setNewMaterial({
        name: '',
        color: '',
        quality: '',
        weight: '',
        unit: 'g',
      });
    }
  };

  const handleRemoveMaterial = (index: number) => {
    const updatedMaterials = [...materials];
    updatedMaterials.splice(index, 1);
    setMaterials(updatedMaterials);
    onMaterialsChange(updatedMaterials);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      onTagsChange(updatedTags);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    const updatedTags = tags.filter(t => t !== tag);
    setTags(updatedTags);
    onTagsChange(updatedTags);
  };

  return (
    <div className="space-y-6">
      {/* Product Type Selection */}
      <div className="space-y-1">
        <label htmlFor="productType" className="block text-sm font-medium text-gray-700">
          Product Type <span className="text-red-500">*</span>
        </label>
        <select
          id="productType"
          value={type}
          onChange={handleTypeChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
        >
          <option value="ring">Ring</option>
          <option value="bracelet">Bracelet</option>
          <option value="necklace">Necklace</option>
          <option value="earring">Earring</option>
          <option value="pendant">Pendant</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      {/* Categories */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Categories <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {categories.map((category) => (
            <span
              key={category}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-nile-teal bg-opacity-10 text-nile-teal"
            >
              {category}
              <button
                type="button"
                onClick={() => handleRemoveCategory(category)}
                className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-nile-teal hover:bg-nile-teal hover:text-white"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Add a category..."
            className="flex-grow rounded-l-md border-gray-300 shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
          />
          <Button
            type="button"
            onClick={handleAddCategory}
            className="rounded-l-none"
          >
            Add
          </Button>
        </div>
        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-1">Suggested categories:</p>
          <div className="flex flex-wrap gap-1">
            {PREDEFINED_CATEGORIES.filter(c => !categories.includes(c)).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleSelectPredefinedCategory(category)}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Materials */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Materials <span className="text-red-500">*</span>
        </label>
        <div className="space-y-4">
          {materials.length > 0 && (
            <div className="overflow-hidden border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Material
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Color
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quality
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weight
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {materials.map((material, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">{material.name}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">{material.color || '-'}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">{material.quality || '-'}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                        {material.weight ? `${material.weight} ${material.unit || 'g'}` : '-'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3">Add Material</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="materialName" className="block text-xs font-medium text-gray-700 mb-1">
                  Material Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="materialName"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
                  placeholder="e.g. Gold, Diamond"
                />
                <div className="mt-1">
                  <p className="text-xs text-gray-500 mb-1">Suggested materials:</p>
                  <div className="flex flex-wrap gap-1">
                    {PREDEFINED_MATERIALS.filter(m => !materials.some(mat => mat.name === m)).slice(0, 6).map((mat) => (
                      <button
                        key={mat}
                        type="button"
                        onClick={() => setNewMaterial({ ...newMaterial, name: mat })}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="materialColor" className="block text-xs font-medium text-gray-700 mb-1">
                  Color (Optional)
                </label>
                <input
                  type="text"
                  id="materialColor"
                  value={newMaterial.color}
                  onChange={(e) => setNewMaterial({ ...newMaterial, color: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
                  placeholder="e.g. Yellow, White"
                />
              </div>
              
              <div>
                <label htmlFor="materialQuality" className="block text-xs font-medium text-gray-700 mb-1">
                  Quality (Optional)
                </label>
                <input
                  type="text"
                  id="materialQuality"
                  value={newMaterial.quality}
                  onChange={(e) => setNewMaterial({ ...newMaterial, quality: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
                  placeholder="e.g. 18K, VS1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="materialWeight" className="block text-xs font-medium text-gray-700 mb-1">
                    Weight (Optional)
                  </label>
                  <input
                    type="number"
                    id="materialWeight"
                    value={newMaterial.weight}
                    onChange={(e) => setNewMaterial({ ...newMaterial, weight: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
                    placeholder="e.g. 2.5"
                    step="0.01"
                    min="0"
                  />
                </div>
                
                <div>
                  <label htmlFor="materialUnit" className="block text-xs font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <select
                    id="materialUnit"
                    value={newMaterial.unit}
                    onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
                  >
                    <option value="g">Grams (g)</option>
                    <option value="ct">Carats (ct)</option>
                    <option value="oz">Ounces (oz)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <Button
                type="button"
                onClick={handleAddMaterial}
                disabled={!newMaterial.name.trim()}
                className="w-full sm:w-auto"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Material
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tags */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Tags (Optional)
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-500"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag..."
            className="flex-grow rounded-l-md border-gray-300 shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
          />
          <Button
            type="button"
            onClick={handleAddTag}
            className="rounded-l-none"
          >
            Add
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Tags help customers find your products in search
        </p>
      </div>
    </div>
  );
} 