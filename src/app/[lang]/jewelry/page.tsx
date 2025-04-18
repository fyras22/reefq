'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { 
  MagnifyingGlassIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon, 
  XMarkIcon, 
  ChevronDownIcon,
  StarIcon,
  ArrowTopRightOnSquareIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from '@/app/i18n-client';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

// Import GemstoneInspector with dynamic loading (no SSR)
const GemstoneInspector = dynamic(() => import('@/components/GemstoneInspector'), { ssr: false });

interface Jewelry {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: { url: string; alt: string }[];
  category: string;
  gemType: string;
  metalType: string;
  caratWeight: number;
  popularity: number;
  stock: number;
  hasAR: boolean;
  has3D: boolean;
  hasTryOn: boolean;
}

export default function JewelryPage() {
  const { t } = useTranslation();
  
  // States
  const [jewelry, setJewelry] = useState<Jewelry[]>([]);
  const [filteredJewelry, setFilteredJewelry] = useState<Jewelry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    gemTypes: [] as string[],
    metalTypes: [] as string[],
    categories: [] as string[],
    qualities: [] as string[],
    sortBy: 'popularity'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<Jewelry | null>(null);
  const [showGemstoneInspector, setShowGemstoneInspector] = useState(false);
  
  useEffect(() => {
    const fetchJewelry = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/jewelry');
        if (!response.ok) {
          throw new Error('Failed to fetch jewelry');
        }
        const data = await response.json();
        setJewelry(data);
        setFilteredJewelry(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchJewelry();
  }, []);
  
  // Apply filters & search
  useEffect(() => {
    if (jewelry.length === 0) return;
    
    let results = [...jewelry];
    
    // Apply search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      results = results.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        item.gemType.toLowerCase().includes(query) ||
        item.metalType.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      results = results.filter(item => item.category === selectedCategory);
    }
    
    // Apply other filters
    if (filters.gemTypes.length > 0) {
      results = results.filter(item => filters.gemTypes.includes(item.gemType));
    }
    
    if (filters.metalTypes.length > 0) {
      results = results.filter(item => filters.metalTypes.includes(item.metalType));
    }
    
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) {
      results = results.filter(item => 
        item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1]
      );
    }
    
    // Sort results
    switch (filters.sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        results.sort((a, b) => b.popularity - a.popularity);
        break;
      default:
        break;
    }
    
    setFilteredJewelry(results);
  }, [jewelry, searchQuery, selectedCategory, filters]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      gemTypes: [],
      metalTypes: [],
      categories: [],
      qualities: [],
      sortBy: 'popularity'
    });
    setSearchQuery('');
    setSelectedCategory('all');
  };

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const toggleFilterSelection = (filterType: string, value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterType as keyof typeof prev] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [filterType]: newValues
      };
    });
  };

  const countActiveFilters = (): number => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedCategory !== 'all') count++;
    if (filters.gemTypes.length > 0) count++;
    if (filters.metalTypes.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) count++;
    return count;
  };

  const openGemstoneInspector = (item: Jewelry) => {
    setSelectedItem(item);
    setShowGemstoneInspector(true);
  };

  const closeGemstoneInspector = () => {
    setShowGemstoneInspector(false);
    setSelectedItem(null);
  };

  const handleInspectionComplete = (details: any) => {
    // Handle inspection completion
    console.log('Inspection completed:', details);
    closeGemstoneInspector();
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {t('jewelry.title')}
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                {t('jewelry.filters')}
                {countActiveFilters() > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-nile-teal rounded-full">
                    {countActiveFilters()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Category Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('jewelry.searchPlaceholder')}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-nile-teal focus:border-nile-teal"
              />
              <MagnifyingGlassIcon className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-nile-teal focus:border-nile-teal sm:text-sm rounded-md"
              >
                <option value="all">{t('jewelry.allCategories')}</option>
                <option value="rings">{t('jewelry.rings')}</option>
                <option value="necklaces">{t('jewelry.necklaces')}</option>
                <option value="bracelets">{t('jewelry.bracelets')}</option>
                <option value="earrings">{t('jewelry.earrings')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                {t('jewelry.filters')}
              </h2>
              <button
                onClick={resetFilters}
                className="text-sm text-nile-teal hover:text-nile-teal-dark"
              >
                {t('jewelry.resetFilters')}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('jewelry.priceRange')}
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) => handleFilterChange('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
                    placeholder="Min"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-teal focus:ring-nile-teal sm:text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Gem Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('jewelry.gemTypes')}
                </label>
                <div className="space-y-2">
                  {['Diamond', 'Ruby', 'Sapphire', 'Emerald'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.gemTypes.includes(type)}
                        onChange={() => toggleFilterSelection('gemTypes', type)}
                        className="h-4 w-4 text-nile-teal focus:ring-nile-teal border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Metal Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('jewelry.metalTypes')}
                </label>
                <div className="space-y-2">
                  {['Gold', 'Silver', 'Platinum', 'Rose Gold'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.metalTypes.includes(type)}
                        onChange={() => toggleFilterSelection('metalTypes', type)}
                        className="h-4 w-4 text-nile-teal focus:ring-nile-teal border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nile-teal"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-nile-teal hover:bg-nile-teal-dark"
            >
              {t('jewelry.retry')}
            </button>
          </div>
        )}

        {/* Jewelry Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredJewelry.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="relative aspect-square">
                  <Image
                    src={item.images[0].url}
                    alt={item.images[0].alt}
                    fill
                    className="object-cover"
                  />
                  {item.hasAR && (
                    <button
                      onClick={() => openGemstoneInspector(item)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    >
                      <SparklesIcon className="h-5 w-5 text-nile-teal" />
                    </button>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-900">
                        ${item.price}
                      </span>
                      {item.compareAtPrice && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          ${item.compareAtPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <StarIconSolid className="h-5 w-5 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-500">
                        {item.popularity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredJewelry.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">
              {t('jewelry.noResults')}
            </h3>
            <p className="mt-2 text-gray-500">
              {t('jewelry.tryDifferentSearch')}
            </p>
          </div>
        )}
      </main>

      {/* Gemstone Inspector Modal */}
      <AnimatePresence>
        {showGemstoneInspector && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedItem.name}
                  </h2>
                  <button
                    onClick={closeGemstoneInspector}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <GemstoneInspector
                  gemType={(selectedItem?.gemType?.toLowerCase() as "diamond" | "ruby" | "sapphire" | "emerald") || "diamond"}
                  carat={2}
                  quality="excellent"
                  onInspectionComplete={handleInspectionComplete}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 