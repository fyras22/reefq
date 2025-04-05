'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/app/i18n-client';
import { 
  AdjustmentsHorizontalIcon, 
  XMarkIcon, 
  ChevronDownIcon,
  CubeTransparentIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

// Product type definition
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  type: 'ring' | 'bracelet' | 'necklace' | 'earring';
  materials: string[];
  featured: boolean;
  new: boolean;
  bestseller: boolean;
  hasAR: boolean;
  has3D: boolean;
}

// Category type definition
interface Category {
  id: string;
  name: string;
  count: number;
}

// Sample categories data
const CATEGORIES: Category[] = [
  { id: 'rings', name: 'Rings', count: 24 },
  { id: 'bracelets', name: 'Bracelets', count: 18 },
  { id: 'necklaces', name: 'Necklaces', count: 15 },
  { id: 'earrings', name: 'Earrings', count: 20 },
  { id: 'engagement-rings', name: 'Engagement Rings', count: 12 },
  { id: 'wedding-bands', name: 'Wedding Bands', count: 8 },
  { id: 'pendants', name: 'Pendants', count: 10 },
];

// Sample products data
const PRODUCTS: Product[] = [
  {
    id: 'diamond-engagement-ring-123',
    name: 'Eternal Elegance Diamond Engagement Ring',
    description: 'A timeless solitaire diamond ring set in 18k gold.',
    price: 1499,
    images: ['/images/jewelry/diamond-ring-1.jpg'],
    category: 'Engagement Rings',
    type: 'ring',
    materials: ['Gold', 'Diamond'],
    featured: true,
    new: false,
    bestseller: true,
    hasAR: true,
    has3D: true
  },
  {
    id: 'tennis-bracelet-456',
    name: 'Classic Tennis Bracelet',
    description: 'Elegant bracelet featuring a line of diamonds in a fine setting.',
    price: 2499,
    images: ['/images/jewelry/tennis-bracelet.jpg'],
    category: 'Bracelets',
    type: 'bracelet',
    materials: ['Platinum', 'Diamond'],
    featured: true,
    new: true,
    bestseller: false,
    hasAR: true,
    has3D: true
  },
  {
    id: 'pearl-necklace-789',
    name: 'Pearl Strand Necklace',
    description: 'Timeless pearl necklace with elegant sterling silver clasp.',
    price: 899,
    images: ['/images/jewelry/pearl-necklace.jpg'],
    category: 'Necklaces',
    type: 'necklace',
    materials: ['Silver', 'Pearl'],
    featured: false,
    new: true,
    bestseller: false,
    hasAR: false,
    has3D: true
  },
  {
    id: 'sapphire-earrings-101',
    name: 'Sapphire Drop Earrings',
    description: 'Stunning sapphire earrings with diamond accents.',
    price: 1299,
    images: ['/images/jewelry/sapphire-earrings.jpg'],
    category: 'Earrings',
    type: 'earring',
    materials: ['White Gold', 'Sapphire', 'Diamond'],
    featured: false,
    new: false,
    bestseller: true,
    hasAR: true,
    has3D: true
  },
  {
    id: 'gold-wedding-band-112',
    name: 'Classic Gold Wedding Band',
    description: 'Timeless 14k gold wedding band with a comfort fit.',
    price: 699,
    images: ['/images/jewelry/gold-wedding-band.jpg'],
    category: 'Wedding Bands',
    type: 'ring',
    materials: ['Gold'],
    featured: false,
    new: false,
    bestseller: true,
    hasAR: true,
    has3D: true
  },
  {
    id: 'emerald-pendant-131',
    name: 'Emerald Halo Pendant',
    description: 'Stunning emerald pendant surrounded by a halo of diamonds.',
    price: 1599,
    images: ['/images/jewelry/emerald-pendant.jpg'],
    category: 'Pendants',
    type: 'necklace',
    materials: ['White Gold', 'Emerald', 'Diamond'],
    featured: true,
    new: true,
    bestseller: false,
    hasAR: false,
    has3D: true
  },
  // Generate 6 more sample products
  {
    id: 'ruby-ring-142',
    name: 'Ruby Statement Ring',
    description: 'Bold ruby ring with intricate gold detailing.',
    price: 1299,
    images: ['/images/jewelry/ruby-ring.jpg'],
    category: 'Rings',
    type: 'ring',
    materials: ['Gold', 'Ruby'],
    featured: false,
    new: true,
    bestseller: false,
    hasAR: true,
    has3D: true
  },
  {
    id: 'diamond-studs-153',
    name: 'Diamond Stud Earrings',
    description: 'Classic diamond stud earrings - a timeless essential.',
    price: 899,
    images: ['/images/jewelry/diamond-studs.jpg'],
    category: 'Earrings',
    type: 'earring',
    materials: ['Platinum', 'Diamond'],
    featured: true,
    new: false,
    bestseller: true,
    hasAR: true,
    has3D: true
  },
  {
    id: 'charm-bracelet-164',
    name: 'Charm Collection Bracelet',
    description: 'Personalized charm bracelet with customizable pendants.',
    price: 599,
    images: ['/images/jewelry/charm-bracelet.jpg'],
    category: 'Bracelets',
    type: 'bracelet',
    materials: ['Silver', 'Various Gems'],
    featured: false,
    new: true,
    bestseller: false,
    hasAR: false,
    has3D: true
  },
  {
    id: 'princess-cut-ring-175',
    name: 'Princess Cut Engagement Ring',
    description: 'Modern princess cut diamond in a sleek setting.',
    price: 1899,
    images: ['/images/jewelry/princess-cut-ring.jpg'],
    category: 'Engagement Rings',
    type: 'ring',
    materials: ['Platinum', 'Diamond'],
    featured: true,
    new: false,
    bestseller: true,
    hasAR: true,
    has3D: true
  },
  {
    id: 'pearl-drop-earrings-186',
    name: 'Pearl Drop Earrings',
    description: 'Elegant pearl drops with diamond accents.',
    price: 799,
    images: ['/images/jewelry/pearl-earrings.jpg'],
    category: 'Earrings',
    type: 'earring',
    materials: ['White Gold', 'Pearl', 'Diamond'],
    featured: false,
    new: false,
    bestseller: true,
    hasAR: false,
    has3D: true
  },
  {
    id: 'bangle-bracelet-197',
    name: 'Diamond Bangle Bracelet',
    description: 'Sleek bangle with encrusted diamonds.',
    price: 1499,
    images: ['/images/jewelry/bangle-bracelet.jpg'],
    category: 'Bracelets',
    type: 'bracelet',
    materials: ['Rose Gold', 'Diamond'],
    featured: true,
    new: true,
    bestseller: false,
    hasAR: true,
    has3D: true
  }
];

// Sort options
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'What\'s New' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'bestseller', label: 'Bestsellers' },
];

export default function JewelryPage() {
  const { t } = useTranslation('en', ['common', 'translation']);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('featured');
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
  const [arFilter, setArFilter] = useState(false);
  const [viewer3dFilter, setViewer3dFilter] = useState(false);
  const [materialFilters, setMaterialFilters] = useState<string[]>([]);

  // Get unique materials from products
  const uniqueMaterials = Array.from(
    new Set(PRODUCTS.flatMap(product => product.materials))
  ).sort();

  // Format price as currency
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Toggle material filter
  const toggleMaterialFilter = (material: string) => {
    setMaterialFilters(prev => 
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  // Toggle filter panel on mobile
  const toggleFilter = () => {
    setFilterOpen(prev => !prev);
  };

  // Apply filters and sorting
  useEffect(() => {
    let result = [...PRODUCTS];
    
    // Apply category filter
    if (selectedCategory) {
      const categoryName = CATEGORIES.find(c => c.id === selectedCategory)?.name;
      result = result.filter(p => 
        p.category === categoryName || 
        (selectedCategory === 'rings' && p.type === 'ring' && p.category !== 'Engagement Rings' && p.category !== 'Wedding Bands')
      );
    }
    
    // Apply material filters
    if (materialFilters.length > 0) {
      result = result.filter(p => 
        p.materials.some(m => materialFilters.includes(m))
      );
    }
    
    // Apply price range filter
    result = result.filter(p => 
      p.price >= priceRange[0] && p.price <= priceRange[1]
    );
    
    // Apply AR filter
    if (arFilter) {
      result = result.filter(p => p.hasAR);
    }
    
    // Apply 3D viewer filter
    if (viewer3dFilter) {
      result = result.filter(p => p.has3D);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        result = result.filter(p => p.new).concat(result.filter(p => !p.new));
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'bestseller':
        result = result.filter(p => p.bestseller).concat(result.filter(p => !p.bestseller));
        break;
      case 'featured':
      default:
        result = result.filter(p => p.featured).concat(result.filter(p => !p.featured));
        break;
    }
    
    setFilteredProducts(result);
  }, [selectedCategory, sortBy, priceRange, arFilter, viewer3dFilter, materialFilters]);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-bg-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif mb-3">
              Fine Jewelry Collection
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover our exquisite collection of handcrafted jewelry. Each piece is designed with attention to detail and made with the finest materials.
            </p>
          </div>
          
          {/* Mobile filter button */}
          <div className="lg:hidden flex justify-between items-center mb-6">
            <button
              onClick={toggleFilter}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2 text-gray-500" />
              Filters
            </button>
            <div className="relative inline-block text-left">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-nile-teal focus:border-nile-teal sm:text-sm rounded-md"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row">
            {/* Filters sidebar */}
            <div
              className={`lg:w-1/4 pr-8 ${
                filterOpen ? 'fixed inset-0 z-40 bg-white p-4 overflow-auto transform translate-x-0' : 'hidden lg:block'
              } transition-transform duration-300 ease-in-out`}
            >
              {filterOpen && (
                <div className="flex justify-between items-center mb-6 lg:hidden">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    onClick={toggleFilter}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              )}
              
              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className={`block w-full text-left px-2 py-1 rounded-md text-sm ${
                      selectedCategory === null
                        ? 'bg-nile-teal text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Jewelry
                  </button>
                  {CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`block w-full text-left px-2 py-1 rounded-md text-sm ${
                        selectedCategory === category.id
                          ? 'bg-nile-teal text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                      <span className="ml-1 text-xs">({category.count})</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Price range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                    </span>
                  </div>
                  <div className="flex space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="3000"
                      step="100"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-nile-teal"
                    />
                    <input
                      type="range"
                      min="0"
                      max="3000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-nile-teal"
                    />
                  </div>
                </div>
              </div>
              
              {/* Material filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Materials</h3>
                <div className="space-y-2">
                  {uniqueMaterials.map((material) => (
                    <div key={material} className="flex items-center">
                      <input
                        id={`material-${material}`}
                        name={`material-${material}`}
                        type="checkbox"
                        checked={materialFilters.includes(material)}
                        onChange={() => toggleMaterialFilter(material)}
                        className="h-4 w-4 text-nile-teal focus:ring-nile-teal border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`material-${material}`}
                        className="ml-3 text-sm text-gray-700"
                      >
                        {material}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Special features */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Special Features</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="ar-view"
                      name="ar-view"
                      type="checkbox"
                      checked={arFilter}
                      onChange={() => setArFilter(!arFilter)}
                      className="h-4 w-4 text-nile-teal focus:ring-nile-teal border-gray-300 rounded"
                    />
                    <label htmlFor="ar-view" className="ml-3 text-sm text-gray-700">
                      AR Try-On Available
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="3d-view"
                      name="3d-view"
                      type="checkbox"
                      checked={viewer3dFilter}
                      onChange={() => setViewer3dFilter(!viewer3dFilter)}
                      className="h-4 w-4 text-nile-teal focus:ring-nile-teal border-gray-300 rounded"
                    />
                    <label htmlFor="3d-view" className="ml-3 text-sm text-gray-700">
                      3D View Available
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Reset filters button */}
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setPriceRange([0, 3000]);
                  setArFilter(false);
                  setViewer3dFilter(false);
                  setMaterialFilters([]);
                }}
                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-teal"
              >
                Reset Filters
              </button>
            </div>
            
            {/* Products grid */}
            <div className="lg:w-3/4">
              {/* Sort options - desktop */}
              <div className="hidden lg:flex justify-end mb-6">
                <div className="relative inline-block text-left">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-nile-teal focus:border-nile-teal sm:text-sm rounded-md"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Results info */}
              <div className="mb-6">
                <p className="text-sm text-gray-500">
                  Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
              </div>
              
              {/* Products grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
                    >
                      <div className="relative">
                        <div className="relative h-64 bg-gray-200">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          
                          {/* Status badges */}
                          <div className="absolute top-2 left-2 flex flex-col space-y-1">
                            {product.new && (
                              <span className="bg-nile-teal text-white px-2 py-1 text-xs rounded-full">
                                New
                              </span>
                            )}
                            {product.bestseller && (
                              <span className="bg-pharaonic-gold text-white px-2 py-1 text-xs rounded-full">
                                Bestseller
                              </span>
                            )}
                          </div>
                          
                          {/* Feature badges */}
                          <div className="absolute bottom-2 right-2 flex space-x-1">
                            {product.has3D && (
                              <div className="bg-white rounded-full p-1.5 shadow-sm">
                                <CubeTransparentIcon className="h-4 w-4 text-gray-700" />
                              </div>
                            )}
                            {product.hasAR && (
                              <div className="bg-white rounded-full p-1.5 shadow-sm">
                                <DevicePhoneMobileIcon className="h-4 w-4 text-gray-700" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-sm text-nile-teal mb-1">
                          {product.category}
                        </h3>
                        <Link
                          href={`/jewelry/product/${product.id}`}
                          className="block text-lg font-medium text-gray-900 hover:text-nile-teal transition-colors duration-200 truncate mb-1"
                        >
                          {product.name}
                        </Link>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-lg text-pharaonic-gold">
                            {formatCurrency(product.price)}
                          </p>
                          <Link
                            href={`/jewelry/product/${product.id}`}
                            className="text-sm text-nile-teal hover:text-pharaonic-gold"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setPriceRange([0, 3000]);
                      setArFilter(false);
                      setViewer3dFilter(false);
                      setMaterialFilters([]);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-nile-teal hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-teal"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Filter overlay backdrop - mobile */}
      {filterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30 lg:hidden"
          onClick={toggleFilter}
        ></div>
      )}
    </div>
  );
} 