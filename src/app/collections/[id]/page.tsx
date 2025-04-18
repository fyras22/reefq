'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  HeartIcon,
  ShoppingBagIcon,
  EyeIcon,
  StarIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  avgRating: number;
  reviewCount: number;
  isNew: boolean;
  isBestseller: boolean;
  category: string;
  materials: string[];
}

interface Collection {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  heroImage: string;
  theme?: string;
  season?: string;
  products: Product[];
}

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const collectionId = params.id as string;
  
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('featured');
  
  // Fetch collection data from API
  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await fetch(`/api/collections/${collectionId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch collection');
        }
        
        const data = await response.json();
        setCollection(data);
        setLoading(false);
      } catch (err) {
        setError('Unable to load collection. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchCollection();
  }, [collectionId]);

  // Toggle product favorite status
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

  // Get all unique materials and categories
  const uniqueMaterials = collection?.products ? 
    Array.from(new Set(collection.products.flatMap(p => p.materials))) : [];
  
  const uniqueCategories = collection?.products ?
    Array.from(new Set(collection.products.map(p => p.category))) : [];

  // Filter products based on selected filters
  const filteredProducts = collection?.products?.filter(product => {
    if (selectedCategory && product.category !== selectedCategory) return false;
    if (selectedMaterial && !product.materials.includes(selectedMaterial)) return false;
    return true;
  }) || [];

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.avgRating - a.avgRating;
      case 'newest':
        return a.isNew ? -1 : b.isNew ? 1 : 0;
      case 'bestseller':
        return a.isBestseller ? -1 : b.isBestseller ? 1 : 0;
      default: // 'featured'
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-nile-teal/20 border-t-nile-teal rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Collection Not Found</h2>
          <p className="mt-2 text-gray-600">{error || "The collection you're looking for doesn't exist."}</p>
          <button
            onClick={() => router.push('/collections')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-nile-teal hover:bg-nile-teal/90"
          >
            Back to Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src={collection.heroImage || collection.imageUrl}
            alt={collection.title}
            fill
            quality={90}
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
        </div>
        
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-16">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.push('/collections')}
              className="flex items-center text-white hover:text-white/80"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              <span>Back to Collections</span>
            </button>
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
          >
            {collection.title}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl"
          >
            {collection.description}
          </motion.p>
        </div>
      </section>

      {/* Collection description */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Collection</h2>
            <p className="text-gray-600 leading-relaxed">
              {collection.longDescription}
            </p>
            
            {(collection.theme || collection.season) && (
              <div className="mt-8 flex justify-center gap-4">
                {collection.theme && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-nile-teal/10 text-nile-teal">
                    Theme: {collection.theme.charAt(0).toUpperCase() + collection.theme.slice(1)}
                  </span>
                )}
                {collection.season && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pharaonic-gold/10 text-pharaonic-gold">
                    Season: {collection.season.charAt(0).toUpperCase() + collection.season.slice(1)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Products</h2>
            
            <div className="mt-4 md:mt-0 flex flex-wrap gap-4">
              {/* Category filter */}
              <div className="relative">
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-nile-teal focus:border-nile-teal sm:text-sm rounded-md"
                >
                  <option value="">All Categories</option>
                  {uniqueCategories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Material filter */}
              <div className="relative">
                <select
                  value={selectedMaterial || ''}
                  onChange={(e) => setSelectedMaterial(e.target.value || null)}
                  className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-nile-teal focus:border-nile-teal sm:text-sm rounded-md"
                >
                  <option value="">All Materials</option>
                  {uniqueMaterials.map(material => (
                    <option key={material} value={material}>
                      {material.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Sort dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-nile-teal focus:border-nile-teal sm:text-sm rounded-md"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">New Arrivals</option>
                  <option value="bestseller">Bestsellers</option>
                </select>
              </div>
              
              {/* Clear filters */}
              {(selectedCategory || selectedMaterial) && (
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedMaterial(null);
                  }}
                  className="text-sm text-nile-teal hover:text-nile-teal/80 hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
          
          {/* Products grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                >
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                  >
                    {/* Product image */}
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={product.images[0] || '/images/placeholder-product.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      
                      {/* Product badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.isNew && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-nile-teal text-white">
                            New
                          </span>
                        )}
                        {product.isBestseller && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-pharaonic-gold text-white">
                            Bestseller
                          </span>
                        )}
                      </div>
                      
                      {/* Quick actions */}
                      <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button 
                          onClick={(e) => toggleFavorite(product.id, e)}
                          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                        >
                          {favorites.has(product.id) ? (
                            <HeartIconSolid className="h-5 w-5 text-red-500" />
                          ) : (
                            <HeartIcon className="h-5 w-5 text-gray-700" />
                          )}
                        </button>
                        <button 
                          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Virtual try-on functionality would go here
                            router.push(`/try-and-fit?product=${product.id}`);
                          }}
                        >
                          <EyeIcon className="h-5 w-5 text-gray-700" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Product info */}
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-nile-teal">
                        {product.name}
                      </h3>
                      
                      <div className="mt-1 flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            i < Math.floor(product.avgRating) ? (
                              <StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />
                            ) : (
                              <StarIcon key={i} className="h-4 w-4 text-gray-300" />
                            )
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          ({product.reviewCount})
                        </span>
                      </div>
                      
                      <div className="mt-2 flex items-baseline">
                        <span className="text-lg font-bold text-gray-900">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.compareAtPrice && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ${product.compareAtPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      {/* Add to cart button appears on hover */}
                      <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Add to cart functionality would go here
                            alert(`Added ${product.name} to cart`);
                          }}
                          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-nile-teal hover:bg-nile-teal/90"
                        >
                          <ShoppingBagIcon className="h-5 w-5 mr-2" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">
                Try adjusting your filters to see products from this collection.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedMaterial(null);
                }}
                className="mt-4 px-4 py-2 bg-nile-teal text-white text-sm font-medium rounded-md hover:bg-nile-teal/90"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* You might also like section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collection.id !== 'modern-minimalist' && (
              <Link href="/collections/modern-minimalist">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="group relative overflow-hidden rounded-xl shadow-md"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src="/images/collections/modern-minimalist.jpg"
                      alt="Modern Minimalist Collection"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Modern Minimalist</h3>
                    <p className="text-white/80">Clean lines and contemporary aesthetics for everyday wear</p>
                  </div>
                </motion.div>
              </Link>
            )}
            
            {collection.id !== 'royal-heritage' && (
              <Link href="/collections/royal-heritage">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="group relative overflow-hidden rounded-xl shadow-md"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src="/images/collections/royal-heritage.jpg"
                      alt="Royal Heritage Collection"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Royal Heritage</h3>
                    <p className="text-white/80">Luxurious pieces inspired by royal jewelry traditions</p>
                  </div>
                </motion.div>
              </Link>
            )}
            
            {collection.id !== 'celestial-dreams' && (
              <Link href="/collections/celestial-dreams">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="group relative overflow-hidden rounded-xl shadow-md"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src="/images/collections/celestial-dreams.jpg"
                      alt="Celestial Dreams Collection"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Celestial Dreams</h3>
                    <p className="text-white/80">Star and moon motifs for the dreamers and night owls</p>
                  </div>
                </motion.div>
              </Link>
            )}
            
            {collection.id !== 'vintage-elegance' && (
              <Link href="/collections/vintage-elegance">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="group relative overflow-hidden rounded-xl shadow-md"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src="/images/collections/vintage-elegance.jpg"
                      alt="Vintage Elegance Collection"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Vintage Elegance</h3>
                    <p className="text-white/80">Timeless pieces inspired by classic design elements</p>
                  </div>
                </motion.div>
              </Link>
            )}
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
                  Try On Pieces From This Collection
                </h2>
                <p className="mt-4 text-gray-600">
                  Experience our {collection.title} collection in 3D with our virtual try-on technology. See how each piece looks on you before you buy.
                </p>
                <div className="mt-6">
                  <Link 
                    href={`/try-and-fit?collection=${collection.id}`}
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