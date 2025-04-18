'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  HeartIcon,
  ArrowsRightLeftIcon,
  Square3Stack3DIcon,
  XMarkIcon,
  ChevronDownIcon,
  ClockIcon,
  TagIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface Collection {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  products: number;
  featured: boolean;
  theme?: string;
  season?: string;
  isNew?: boolean;
  discount?: number;
  limitedEdition?: boolean;
  popularityScore?: number;
  designerPick?: boolean;
  releaseDate?: string;
}

interface Filter {
  material: string[];
  style: string[];
  occasion: string[];
  price: [number, number];
  gemstone: string[];
}

export default function CollectionsPage() {
  const router = useRouter();
  
  // Collections state
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Filter>({
    material: [],
    style: [],
    occasion: [],
    price: [0, 5000],
    gemstone: []
  });
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  
  // New state
  const [searchQuery, setSearchQuery] = useState('');
  const [showPromo, setShowPromo] = useState(true);
  const [sortBy, setSortBy] = useState<string>('featured');
  
  // Placeholder collections data - in a real app, you'd fetch from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCollections([
        {
          id: 'vintage-elegance',
          title: 'Vintage Elegance',
          description: 'Timeless pieces inspired by classic design elements',
          imageUrl: '/images/collections/vintage-elegance.jpg',
          products: 24,
          featured: true,
          theme: 'vintage',
          season: 'all-season',
          discount: 15,
          popularityScore: 92,
          designerPick: true
        },
        {
          id: 'modern-minimalist',
          title: 'Modern Minimalist',
          description: 'Clean lines and contemporary aesthetics for everyday wear',
          imageUrl: '/images/collections/modern-minimalist.jpg',
          products: 18,
          featured: true,
          theme: 'minimalist',
          season: 'all-season',
          popularityScore: 88,
          designerPick: true,
          releaseDate: '2023-12-15'
        },
        {
          id: 'royal-heritage',
          title: 'Royal Heritage',
          description: 'Luxurious pieces inspired by royal jewelry traditions',
          imageUrl: '/images/collections/royal-heritage.jpg',
          products: 12,
          featured: true,
          theme: 'luxury',
          season: 'winter',
          limitedEdition: true,
          popularityScore: 95
        },
        {
          id: 'nature-inspired',
          title: 'Nature Inspired',
          description: 'Designs that capture the beauty of the natural world',
          imageUrl: '/images/collections/nature-inspired.jpg',
          products: 20,
          featured: false,
          theme: 'nature',
          season: 'spring',
          popularityScore: 82
        },
        {
          id: 'celestial-dreams',
          title: 'Celestial Dreams',
          description: 'Star and moon motifs for the dreamers and night owls',
          imageUrl: '/images/collections/celestial-dreams.jpg',
          products: 15,
          featured: false,
          theme: 'celestial',
          season: 'winter',
          isNew: true,
          popularityScore: 78,
          releaseDate: '2023-11-10'
        },
        {
          id: 'summer-vibes',
          title: 'Summer Vibes',
          description: 'Vibrant and colorful pieces perfect for warm days',
          imageUrl: '/images/collections/summer-vibes.jpg',
          products: 22,
          featured: false,
          theme: 'vibrant',
          season: 'summer',
          discount: 10,
          popularityScore: 85
        },
        {
          id: 'bohemian-spirit',
          title: 'Bohemian Spirit',
          description: 'Free-spirited designs for the unconventional soul',
          imageUrl: '/images/collections/bohemian-spirit.jpg',
          products: 17,
          featured: false,
          theme: 'bohemian',
          season: 'summer',
          popularityScore: 80
        },
        {
          id: 'autumn-whispers',
          title: 'Autumn Whispers',
          description: 'Warm tones and organic textures inspired by fall',
          imageUrl: '/images/collections/autumn-whispers.jpg',
          products: 14,
          featured: false,
          theme: 'organic',
          season: 'fall',
          isNew: true,
          popularityScore: 75,
          releaseDate: '2023-09-22'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Toggle collection favorite status
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  // Filter and search collections
  const filteredCollections = collections.filter(collection => {
    // Theme and season filters
    if (selectedTheme && collection.theme !== selectedTheme) return false;
    if (selectedSeason && collection.season !== selectedSeason) return false;
    
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        collection.title.toLowerCase().includes(query) || 
        collection.description.toLowerCase().includes(query) ||
        collection.theme?.toLowerCase().includes(query) ||
        collection.season?.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Sort collections
  const sortedCollections = [...filteredCollections].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return (b.releaseDate || '').localeCompare(a.releaseDate || '');
      case 'popularity':
        return (b.popularityScore || 0) - (a.popularityScore || 0);
      case 'products-high':
        return b.products - a.products;
      case 'products-low':
        return a.products - b.products;
      case 'discount':
        return (b.discount || 0) - (a.discount || 0);
      default: // 'featured'
        return b.featured ? 1 : a.featured ? -1 : 0;
    }
  });

  // Featured collections
  const featuredCollections = collections.filter(collection => collection.featured);

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Promotional Banner */}
      {showPromo && (
        <div className="bg-gradient-to-r from-pharaonic-gold to-nile-teal text-white py-3 relative">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center">
              <SparklesIcon className="h-5 w-5 mr-2 animate-pulse" />
              <p className="text-sm md:text-base font-medium">
                Limited Time Offer: Free shipping on all orders over $100 | Use code: <span className="font-bold">SHINE2023</span>
              </p>
              <button 
                onClick={() => setShowPromo(false)}
                className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close promotion banner"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/images/collections/hero-collections.jpg" 
            alt="Jewelry collections showcase"
            fill
            quality={90}
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
        </div>
        
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
          >
            Curated Collections
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl"
          >
            Discover our carefully curated jewelry collections, each telling a unique story of craftsmanship and design.
          </motion.p>
        </div>
      </section>

      {/* Featured collections */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Collections</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-nile-teal/20 border-t-nile-teal rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCollections.map((collection) => (
                <Link href={`/collections/${collection.id}`} key={collection.id}>
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="group relative overflow-hidden rounded-xl shadow-md"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={collection.imageUrl}
                        alt={collection.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{collection.title}</h3>
                      <p className="text-white/80 mb-4">{collection.description}</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pharaonic-gold/90 text-white">
                        {collection.products} Products
                      </span>
                    </div>
                    
                    <button 
                      onClick={(e) => toggleFavorite(collection.id, e)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                    >
                      {favorites.has(collection.id) ? (
                        <HeartIconSolid className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5 text-gray-700" />
                      )}
                    </button>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Collections filtering and list */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Filter and search bar */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="w-full md:w-auto flex flex-1 max-w-md relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-nile-teal focus:border-nile-teal"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
            
            <div className="w-full md:w-auto flex gap-4">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-nile-teal focus:border-nile-teal sm:text-sm rounded-md"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest First</option>
                  <option value="popularity">Most Popular</option>
                  <option value="products-high">Most Products</option>
                  <option value="products-low">Fewest Products</option>
                  <option value="discount">Biggest Discounts</option>
                </select>
              </div>

              <div className="flex rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-nile-teal text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  <Square3Stack3DIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-nile-teal text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  <ArrowsRightLeftIcon className="h-6 w-6" />
                </button>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 ${showFilters ? 'bg-gray-50 text-nile-teal' : ''}`}
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-700" />
                <span>Filters</span>
                {(selectedTheme || selectedSeason) && (
                  <span className="bg-nile-teal text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {(selectedTheme ? 1 : 0) + (selectedSeason ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-8"
              >
                <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Filter Collections</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Theme filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                      <div className="relative">
                        <select
                          value={selectedTheme || ''}
                          onChange={(e) => setSelectedTheme(e.target.value || null)}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-nile-teal focus:border-nile-teal sm:text-sm rounded-md"
                        >
                          <option value="">All Themes</option>
                          <option value="vintage">Vintage</option>
                          <option value="minimalist">Minimalist</option>
                          <option value="luxury">Luxury</option>
                          <option value="nature">Nature</option>
                          <option value="celestial">Celestial</option>
                          <option value="vibrant">Vibrant</option>
                          <option value="bohemian">Bohemian</option>
                          <option value="organic">Organic</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Season filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
                      <div className="relative">
                        <select
                          value={selectedSeason || ''}
                          onChange={(e) => setSelectedSeason(e.target.value || null)}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-nile-teal focus:border-nile-teal sm:text-sm rounded-md"
                        >
                          <option value="">All Seasons</option>
                          <option value="spring">Spring</option>
                          <option value="summer">Summer</option>
                          <option value="fall">Fall</option>
                          <option value="winter">Winter</option>
                          <option value="all-season">All-Season</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Collection type checkboxes */}
                    <div>
                      <fieldset>
                        <legend className="block text-sm font-medium text-gray-700 mb-2">Collection Type</legend>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              id="filter-new"
                              type="checkbox"
                              className="h-4 w-4 text-nile-teal focus:ring-nile-teal border-gray-300 rounded"
                            />
                            <label htmlFor="filter-new" className="ml-2 text-sm text-gray-700">
                              New Arrivals
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="filter-limited"
                              type="checkbox"
                              className="h-4 w-4 text-nile-teal focus:ring-nile-teal border-gray-300 rounded"
                            />
                            <label htmlFor="filter-limited" className="ml-2 text-sm text-gray-700">
                              Limited Edition
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="filter-sale"
                              type="checkbox"
                              className="h-4 w-4 text-nile-teal focus:ring-nile-teal border-gray-300 rounded"
                            />
                            <label htmlFor="filter-sale" className="ml-2 text-sm text-gray-700">
                              On Sale
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="filter-designer"
                              type="checkbox"
                              className="h-4 w-4 text-nile-teal focus:ring-nile-teal border-gray-300 rounded"
                            />
                            <label htmlFor="filter-designer" className="ml-2 text-sm text-gray-700">
                              Designer's Pick
                            </label>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end gap-4">
                    <button
                      onClick={() => {
                        setSelectedTheme(null);
                        setSelectedSeason(null);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="px-4 py-2 bg-nile-teal text-white text-sm font-medium rounded-md hover:bg-nile-teal/90"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Active filters display */}
          {(selectedTheme || selectedSeason) && (
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-sm text-gray-700 py-1">Active filters:</span>
              {selectedTheme && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Theme: {selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)}
                  <button 
                    onClick={() => setSelectedTheme(null)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              )}
              {selectedSeason && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Season: {selectedSeason.charAt(0).toUpperCase() + selectedSeason.slice(1)}
                  <button 
                    onClick={() => setSelectedSeason(null)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedTheme(null);
                  setSelectedSeason(null);
                }}
                className="text-sm text-nile-teal hover:underline py-1"
              >
                Clear all
              </button>
            </div>
          )}
          
          {/* Collections grid/list */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-nile-teal/20 border-t-nile-teal rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {sortedCollections.length > 0 ? (
                <>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {sortedCollections.map((collection) => (
                        <Link href={`/collections/${collection.id}`} key={collection.id}>
                          <motion.div 
                            whileHover={{ y: -5 }}
                            className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                          >
                            <div className="aspect-square relative overflow-hidden">
                              <Image
                                src={collection.imageUrl}
                                alt={collection.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              
                              {/* Collection badges */}
                              <div className="absolute top-2 left-2 flex flex-col gap-1">
                                {collection.isNew && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-nile-teal text-white">
                                    New
                                  </span>
                                )}
                                {collection.limitedEdition && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-pharaonic-gold text-white">
                                    Limited Edition
                                  </span>
                                )}
                                {collection.discount && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-500 text-white">
                                    {collection.discount}% Off
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="p-4">
                              <h3 className="text-lg font-medium text-gray-900 group-hover:text-nile-teal">
                                {collection.title}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                {collection.description}
                              </p>
                              <div className="mt-2 flex justify-between items-center">
                                <div className="flex items-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {collection.products} Products
                                  </span>
                                  {collection.designerPick && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                      Designer's Pick
                                    </span>
                                  )}
                                </div>
                                <button 
                                  onClick={(e) => toggleFavorite(collection.id, e)}
                                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                  {favorites.has(collection.id) ? (
                                    <HeartIconSolid className="h-5 w-5 text-red-500" />
                                  ) : (
                                    <HeartIcon className="h-5 w-5 text-gray-400" />
                                  )}
                                </button>
                              </div>
                              
                              {/* Theme and season tags */}
                              {(collection.theme || collection.season) && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {collection.theme && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                      {collection.theme}
                                    </span>
                                  )}
                                  {collection.season && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                      {collection.season}
                                    </span>
                                  )}
                                </div>
                              )}
                              
                              {/* Popularity indicator */}
                              {collection.popularityScore && collection.popularityScore > 85 && (
                                <div className="mt-2 flex items-center text-xs text-gray-500">
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div 
                                      className="bg-nile-teal h-1.5 rounded-full" 
                                      style={{ width: `${collection.popularityScore}%` }}
                                    ></div>
                                  </div>
                                  <span className="ml-2">{collection.popularityScore}% Popular</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortedCollections.map((collection) => (
                        <Link href={`/collections/${collection.id}`} key={collection.id}>
                          <motion.div 
                            whileHover={{ y: -2 }}
                            className="group flex gap-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden p-4"
                          >
                            <div className="relative h-32 w-40 flex-shrink-0 overflow-hidden rounded-md">
                              <Image
                                src={collection.imageUrl}
                                alt={collection.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              
                              {/* Collection badges */}
                              <div className="absolute top-2 left-2 flex flex-col gap-1">
                                {collection.isNew && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium bg-nile-teal text-white">
                                    New
                                  </span>
                                )}
                                {collection.limitedEdition && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium bg-pharaonic-gold text-white">
                                    Limited
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h3 className="text-lg font-medium text-gray-900 group-hover:text-nile-teal">
                                  {collection.title}
                                </h3>
                                
                                {collection.discount && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-500 text-white">
                                    {collection.discount}% Off
                                  </span>
                                )}
                              </div>
                              
                              <p className="mt-1 text-sm text-gray-500">
                                {collection.description}
                              </p>
                              
                              <div className="mt-2 flex items-center">
                                {collection.theme && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {collection.theme}
                                  </span>
                                )}
                                {collection.season && (
                                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {collection.season}
                                  </span>
                                )}
                                {collection.designerPick && (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    Designer's Pick
                                  </span>
                                )}
                                <span className="ml-auto text-sm font-medium text-gray-700 flex items-center">
                                  <TagIcon className="h-4 w-4 mr-1" />
                                  {collection.products} Products
                                </span>
                                {collection.releaseDate && (
                                  <span className="ml-4 text-sm text-gray-500 flex items-center">
                                    <ClockIcon className="h-4 w-4 mr-1" />
                                    {new Date(collection.releaseDate).toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric', 
                                      year: 'numeric' 
                                    })}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex-shrink-0 self-center">
                              <button 
                                onClick={(e) => toggleFavorite(collection.id, e)}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                              >
                                {favorites.has(collection.id) ? (
                                  <HeartIconSolid className="h-5 w-5 text-red-500" />
                                ) : (
                                  <HeartIcon className="h-5 w-5 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-12 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      Showing {sortedCollections.length} of {collections.length} collections
                    </p>
                    {/* Pagination could be added here */}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No collections found</h3>
                  <p className="text-gray-500">
                    Try adjusting your filters to see more collections.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedTheme(null);
                      setSelectedSeason(null);
                      setSearchQuery('');
                    }}
                    className="mt-4 px-4 py-2 bg-nile-teal text-white text-sm font-medium rounded-md hover:bg-nile-teal/90"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      
      {/* Product count by category */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse By Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md text-center"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-nile-teal/10 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-nile-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Rings</h3>
                <p className="text-sm text-gray-500 mt-1">245 Products</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md text-center"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-nile-teal/10 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-nile-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Necklaces</h3>
                <p className="text-sm text-gray-500 mt-1">187 Products</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md text-center"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-nile-teal/10 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-nile-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Earrings</h3>
                <p className="text-sm text-gray-500 mt-1">209 Products</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md text-center"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-nile-teal/10 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-nile-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Bracelets</h3>
                <p className="text-sm text-gray-500 mt-1">152 Products</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md text-center"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-nile-teal/10 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-nile-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">View All</h3>
                <p className="text-sm text-gray-500 mt-1">963 Products</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Trending now section */}
      <section className="py-16 bg-gradient-to-r from-pharaonic-gold/10 to-nile-teal/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
            <Link 
              href="/trends" 
              className="text-nile-teal hover:text-nile-teal/80 text-sm font-medium flex items-center"
            >
              View all trends
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white rounded-lg shadow overflow-hidden group cursor-pointer"
            >
              <div className="relative aspect-video">
                <Image
                  src="/images/trends/mixed-metals.jpg"
                  alt="Mixed Metals Trend"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                  <span className="p-4 text-white font-medium">Explore this trend</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg text-gray-900 flex items-center">
                  Mixed Metals
                  <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium flex items-center">
                    <span className="animate-pulse mr-1">●</span>
                    Hot
                  </span>
                </h3>
                <p className="text-gray-600 text-sm mt-1">Combining gold, silver, and rose gold in one piece</p>
                <div className="mt-3 flex items-center text-xs text-gray-500">
                  <span className="flex items-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-nile-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    428 views
                  </span>
                  <span>24 products</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white rounded-lg shadow overflow-hidden group cursor-pointer"
            >
              <div className="relative aspect-video">
                <Image
                  src="/images/trends/statement-earrings.jpg"
                  alt="Statement Earrings Trend"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                  <span className="p-4 text-white font-medium">Explore this trend</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg text-gray-900">Statement Earrings</h3>
                <p className="text-gray-600 text-sm mt-1">Bold earrings that demand attention</p>
                <div className="mt-3 flex items-center text-xs text-gray-500">
                  <span className="flex items-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-nile-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    356 views
                  </span>
                  <span>18 products</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white rounded-lg shadow overflow-hidden group cursor-pointer"
            >
              <div className="relative aspect-video">
                <Image
                  src="/images/trends/layered-necklaces.jpg"
                  alt="Layered Necklaces Trend"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                  <span className="p-4 text-white font-medium">Explore this trend</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg text-gray-900 flex items-center">
                  Layered Necklaces
                  <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium flex items-center">
                    <span className="animate-pulse mr-1">●</span>
                    Hot
                  </span>
                </h3>
                <p className="text-gray-600 text-sm mt-1">Multiple chains of varying lengths worn together</p>
                <div className="mt-3 flex items-center text-xs text-gray-500">
                  <span className="flex items-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-nile-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    489 views
                  </span>
                  <span>32 products</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white rounded-lg shadow overflow-hidden group cursor-pointer"
            >
              <div className="relative aspect-video">
                <Image
                  src="/images/trends/pearls-reimagined.jpg"
                  alt="Pearls Reimagined Trend"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                  <span className="p-4 text-white font-medium">Explore this trend</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg text-gray-900">Pearls Reimagined</h3>
                <p className="text-gray-600 text-sm mt-1">Modern takes on classic pearl jewelry</p>
                <div className="mt-3 flex items-center text-xs text-gray-500">
                  <span className="flex items-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-nile-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    297 views
                  </span>
                  <span>21 products</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Trend finder */}
          <div className="mt-12 bg-white rounded-xl overflow-hidden shadow-md">
            <div className="bg-gradient-to-r from-nile-teal to-pharaonic-gold p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Find Your Perfect Trend</h3>
              <p className="opacity-90">Answer a few questions to discover jewelry trends that match your style.</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Style</label>
                  <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-nile-teal focus:border-nile-teal sm:text-sm">
                    <option>Classic</option>
                    <option>Modern</option>
                    <option>Bohemian</option>
                    <option>Minimalist</option>
                    <option>Vintage</option>
                    <option>Glamorous</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
                  <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-nile-teal focus:border-nile-teal sm:text-sm">
                    <option>Everyday</option>
                    <option>Special Event</option>
                    <option>Wedding</option>
                    <option>Work</option>
                    <option>Casual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Metal Preference</label>
                  <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-nile-teal focus:border-nile-teal sm:text-sm">
                    <option>Gold</option>
                    <option>Silver</option>
                    <option>Rose Gold</option>
                    <option>Mixed Metals</option>
                    <option>No Preference</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-center">
                <button className="px-6 py-2 bg-nile-teal text-white font-medium rounded-md hover:bg-nile-teal/90 transition-colors flex items-center">
                  Find My Trends
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Designer Spotlight */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Designer Spotlight</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="md:flex">
                <div className="md:flex-shrink-0 md:w-1/3 relative">
                  <Image
                    src="/images/collections/designer-spotlight.jpg"
                    alt="Designer Portrait"
                    width={300}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6 md:p-8 md:w-2/3">
                  <div className="uppercase tracking-wide text-sm text-nile-teal font-semibold">Featured Designer</div>
                  <h3 className="mt-2 text-xl font-bold text-gray-900">Sophia Martinez</h3>
                  <p className="mt-2 text-gray-600 leading-relaxed">
                    Renowned for her unique fusion of traditional craftsmanship and modern aesthetics, Sophia Martinez brings over 15 years of experience to her stunning jewelry designs. Her latest collection explores themes of nature and sustainability.
                  </p>
                  <div className="mt-4 flex space-x-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-nile-teal/10 text-nile-teal">
                      Award Winner
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pharaonic-gold/10 text-pharaonic-gold">
                      Exclusive
                    </span>
                  </div>
                  <div className="mt-5">
                    <Link 
                      href="/designers/sophia-martinez" 
                      className="text-nile-teal hover:text-nile-teal/80 text-sm font-medium flex items-center"
                    >
                      View designer profile
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow transition-shadow"
              >
                <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
                  <Image
                    src="/images/collections/designer-piece1.jpg"
                    alt="Designer Piece"
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="text-lg font-medium text-gray-900">Emerald Cascade Earrings</h4>
                <p className="text-sm text-gray-500">From the Nature's Symphony collection</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-nile-teal font-medium">$349.99</span>
                  <button className="flex items-center justify-center p-2 bg-nile-teal/10 rounded-full hover:bg-nile-teal/20 transition-colors">
                    <HeartIcon className="h-5 w-5 text-nile-teal" />
                  </button>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow transition-shadow"
              >
                <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
                  <Image
                    src="/images/collections/designer-piece2.jpg"
                    alt="Designer Piece"
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="text-lg font-medium text-gray-900">Sapphire Ocean Pendant</h4>
                <p className="text-sm text-gray-500">Limited edition - only 25 pieces</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-nile-teal font-medium">$429.99</span>
                  <button className="flex items-center justify-center p-2 bg-nile-teal/10 rounded-full hover:bg-nile-teal/20 transition-colors">
                    <HeartIcon className="h-5 w-5 text-nile-teal" />
                  </button>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow transition-shadow"
              >
                <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
                  <Image
                    src="/images/collections/designer-piece3.jpg"
                    alt="Designer Piece"
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="text-lg font-medium text-gray-900">Vine Wrap Bracelet</h4>
                <p className="text-sm text-gray-500">Adjustable fit for all wrist sizes</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-nile-teal font-medium">$289.99</span>
                  <button className="flex items-center justify-center p-2 bg-nile-teal/10 rounded-full hover:bg-nile-teal/20 transition-colors">
                    <HeartIcon className="h-5 w-5 text-nile-teal" />
                  </button>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow transition-shadow"
              >
                <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
                  <Image
                    src="/images/collections/designer-piece4.jpg"
                    alt="Designer Piece"
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="text-lg font-medium text-gray-900">Moonlight Ring</h4>
                <p className="text-sm text-gray-500">Handcrafted from recycled silver</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-nile-teal font-medium">$199.99</span>
                  <button className="flex items-center justify-center p-2 bg-nile-teal/10 rounded-full hover:bg-nile-teal/20 transition-colors">
                    <HeartIcon className="h-5 w-5 text-nile-teal" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Virtual try-on CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-nile-teal/10 to-pharaonic-gold/10 p-8 md:p-12">
            <div className="md:flex md:items-center md:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  Try Before You Buy
                </h2>
                <p className="mt-4 text-gray-600">
                  Experience our collections in 3D with our virtual try-on technology. See how jewelry looks on you from the comfort of your home.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/try-and-fit" 
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-nile-teal px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-nile-teal/90"
                  >
                    Try Virtual Fitting
                  </Link>
                  <Link 
                    href="/how-it-works" 
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    How It Works
                  </Link>
                </div>
              </div>
              <div className="mt-6 md:mt-0 md:ml-8 flex-shrink-0 relative">
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-pharaonic-gold/20 rounded-full opacity-70 animate-pulse" />
                <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-nile-teal/30 rounded-full opacity-70 animate-pulse" />
                <Image
                  src="/images/virtual-try-on-preview.jpg"
                  alt="Virtual Try-On Preview"
                  width={280}
                  height={280}
                  className="rounded-lg shadow-md relative z-10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 