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
  ChevronDownIcon
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
          season: 'all-season'
        },
        {
          id: 'modern-minimalist',
          title: 'Modern Minimalist',
          description: 'Clean lines and contemporary aesthetics for everyday wear',
          imageUrl: '/images/collections/modern-minimalist.jpg',
          products: 18,
          featured: true,
          theme: 'minimalist',
          season: 'all-season'
        },
        {
          id: 'royal-heritage',
          title: 'Royal Heritage',
          description: 'Luxurious pieces inspired by royal jewelry traditions',
          imageUrl: '/images/collections/royal-heritage.jpg',
          products: 12,
          featured: true,
          theme: 'luxury',
          season: 'winter'
        },
        {
          id: 'nature-inspired',
          title: 'Nature Inspired',
          description: 'Designs that capture the beauty of the natural world',
          imageUrl: '/images/collections/nature-inspired.jpg',
          products: 20,
          featured: false,
          theme: 'nature',
          season: 'spring'
        },
        {
          id: 'celestial-dreams',
          title: 'Celestial Dreams',
          description: 'Star and moon motifs for the dreamers and night owls',
          imageUrl: '/images/collections/celestial-dreams.jpg',
          products: 15,
          featured: false,
          theme: 'celestial',
          season: 'winter'
        },
        {
          id: 'summer-vibes',
          title: 'Summer Vibes',
          description: 'Vibrant and colorful pieces perfect for warm days',
          imageUrl: '/images/collections/summer-vibes.jpg',
          products: 22,
          featured: false,
          theme: 'vibrant',
          season: 'summer'
        },
        {
          id: 'bohemian-spirit',
          title: 'Bohemian Spirit',
          description: 'Free-spirited designs for the unconventional soul',
          imageUrl: '/images/collections/bohemian-spirit.jpg',
          products: 17,
          featured: false,
          theme: 'bohemian',
          season: 'summer'
        },
        {
          id: 'autumn-whispers',
          title: 'Autumn Whispers',
          description: 'Warm tones and organic textures inspired by fall',
          imageUrl: '/images/collections/autumn-whispers.jpg',
          products: 14,
          featured: false,
          theme: 'organic',
          season: 'fall'
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

  // Filter collections based on selected filters
  const filteredCollections = collections.filter(collection => {
    if (selectedTheme && collection.theme !== selectedTheme) return false;
    if (selectedSeason && collection.season !== selectedSeason) return false;
    return true;
  });

  // Featured collections
  const featuredCollections = collections.filter(collection => collection.featured);

  return (
    <div className="min-h-screen bg-white pt-20">
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-nile-teal focus:border-nile-teal"
              />
            </div>
            
            <div className="w-full md:w-auto flex gap-4">
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
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-700" />
                <span>Filters</span>
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
          
          {/* Collections grid/list */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-nile-teal/20 border-t-nile-teal rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCollections.map((collection) => (
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
                        </div>
                        
                        <div className="p-4">
                          <h3 className="text-lg font-medium text-gray-900 group-hover:text-nile-teal">
                            {collection.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                            {collection.description}
                          </p>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">
                              {collection.products} Products
                            </span>
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
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCollections.map((collection) => (
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
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 group-hover:text-nile-teal">
                            {collection.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {collection.description}
                          </p>
                          <div className="mt-2 flex items-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {collection.theme}
                            </span>
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {collection.season}
                            </span>
                            <span className="ml-auto text-sm font-medium text-gray-700">
                              {collection.products} Products
                            </span>
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
              
              {filteredCollections.length === 0 && (
                <div className="text-center py-16">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No collections found</h3>
                  <p className="text-gray-500">
                    Try adjusting your filters to see more collections.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedTheme(null);
                      setSelectedSeason(null);
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
      
      {/* Trending now section */}
      <section className="py-16 bg-gradient-to-r from-pharaonic-gold/10 to-nile-teal/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Trending Now</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow overflow-hidden group cursor-pointer">
              <div className="relative aspect-video">
                <Image
                  src="/images/trends/mixed-metals.jpg"
                  alt="Mixed Metals Trend"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg text-gray-900">Mixed Metals</h3>
                <p className="text-gray-600 text-sm mt-1">Combining gold, silver, and rose gold in one piece</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden group cursor-pointer">
              <div className="relative aspect-video">
                <Image
                  src="/images/trends/statement-earrings.jpg"
                  alt="Statement Earrings Trend"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg text-gray-900">Statement Earrings</h3>
                <p className="text-gray-600 text-sm mt-1">Bold earrings that demand attention</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden group cursor-pointer">
              <div className="relative aspect-video">
                <Image
                  src="/images/trends/layered-necklaces.jpg"
                  alt="Layered Necklaces Trend"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg text-gray-900">Layered Necklaces</h3>
                <p className="text-gray-600 text-sm mt-1">Multiple chains of varying lengths worn together</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden group cursor-pointer">
              <div className="relative aspect-video">
                <Image
                  src="/images/trends/pearls-reimagined.jpg"
                  alt="Pearls Reimagined Trend"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg text-gray-900">Pearls Reimagined</h3>
                <p className="text-gray-600 text-sm mt-1">Modern takes on classic pearl jewelry</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Virtual try-on CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl overflow-hidden bg-nile-teal/10 p-8 md:p-12">
            <div className="md:flex md:items-center md:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  Experience Our Collections in 3D
                </h2>
                <p className="mt-4 text-gray-600">
                  Try on pieces from our collections virtually with our AI-powered technology. See how jewelry looks on you before you buy.
                </p>
                <div className="mt-6">
                  <Link 
                    href="/try-and-fit" 
                    className="inline-flex items-center rounded-md border border-transparent bg-nile-teal px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-nile-teal/90"
                  >
                    Try Virtual Fitting
                  </Link>
                </div>
              </div>
              <div className="mt-6 md:mt-0 md:ml-8 flex-shrink-0">
                <Image
                  src="/images/virtual-try-on-preview.jpg"
                  alt="Virtual Try-On Preview"
                  width={280}
                  height={280}
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 