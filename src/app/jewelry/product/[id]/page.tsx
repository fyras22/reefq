'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  ShoppingCartIcon,
  HeartIcon,
  ViewfinderCircleIcon,
  ShareIcon,
  DevicePhoneMobileIcon,
  CubeTransparentIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import dynamic from 'next/dynamic';

// Dynamically import components with no SSR
const JewelryViewer = dynamic(() => import('@/components/JewelryViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-nile-teal"></div>
    </div>
  )
});

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
  metalTypes: string[];
  gemTypes: string[];
  sizes: number[];
  modelPath: string;
  featured: boolean;
  new: boolean;
  bestseller: boolean;
  rating: number;
  reviewCount: number;
  availability: 'in-stock' | 'low-stock' | 'out-of-stock';
}

// Sample product data (this would normally come from an API)
const SAMPLE_PRODUCT: Product = {
  id: 'diamond-engagement-ring-123',
  name: 'Eternal Elegance Diamond Engagement Ring',
  description: 'A timeless solitaire diamond ring set in 18k gold. The perfect symbol of your everlasting love and commitment. Features a brilliant-cut center diamond with exceptional clarity and sparkle.',
  price: 1499,
  images: [
    '/images/jewelry/diamond-ring-1.jpg',
    '/images/jewelry/diamond-ring-2.jpg',
    '/images/jewelry/diamond-ring-3.jpg',
    '/images/jewelry/diamond-ring-4.jpg',
  ],
  category: 'Engagement Rings',
  type: 'ring',
  materials: ['Gold', 'Diamond'],
  metalTypes: ['gold', 'whitegold', 'rosegold', 'platinum'],
  gemTypes: ['diamond', 'ruby', 'sapphire', 'emerald'],
  sizes: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9],
  modelPath: '/models/diamond_engagement_ring.glb',
  featured: true,
  new: false,
  bestseller: true,
  rating: 4.8,
  reviewCount: 124,
  availability: 'in-stock'
};

// Rating stars component
function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <svg 
          key={i}
          className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M10 15.585l-7.03 3.698 1.341-7.8-5.688-5.542 7.864-1.142L10 0 13.513 4.8l7.864 1.142-5.688 5.542 1.341 7.8z" clipRule="evenodd" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedMetal, setSelectedMetal] = useState<string>('gold');
  const [selectedGem, setSelectedGem] = useState<string>('diamond');
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Fetch product data
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    
    // In a real application, this would be an API call using the ID
    setTimeout(() => {
      setProduct(SAMPLE_PRODUCT);
      
      // Set default selections
      if (SAMPLE_PRODUCT.metalTypes.length > 0) {
        setSelectedMetal(SAMPLE_PRODUCT.metalTypes[0]);
      }
      
      if (SAMPLE_PRODUCT.gemTypes.length > 0) {
        setSelectedGem(SAMPLE_PRODUCT.gemTypes[0]);
      }
      
      if (SAMPLE_PRODUCT.sizes.length > 0) {
        setSelectedSize(SAMPLE_PRODUCT.sizes[0]);
      }
      
      setLoading(false);
    }, 800);
  }, [id]);
  
  // Handle quantity changes
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };
  
  // Handle adding to cart
  const addToCart = () => {
    // This would typically integrate with a cart state or API
    alert(`Added ${quantity} of ${product?.name} to cart!`);
  };
  
  // Toggle 3D viewer
  const toggleViewer = () => {
    setShowViewer(prev => !prev);
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-bg-light flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nile-teal"></div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-bg-light flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h1>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link
          href="/jewelry"
          className="px-4 py-2 bg-nile-teal text-white rounded-md hover:bg-opacity-90 transition-colors"
        >
          Browse Jewelry
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-bg-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Navigation */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-nile-teal hover:text-pharaonic-gold"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Shopping
            </button>
          </div>
          
          <div className="md:flex -mx-4">
            {/* Product images */}
            <div className="md:w-1/2 px-4 mb-8 md:mb-0">
              <div className="relative">
                <div className="relative h-80 sm:h-96 md:h-[450px] lg:h-[550px] bg-white rounded-lg overflow-hidden">
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                  
                  {/* Status badges */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {product.new && (
                      <span className="bg-nile-teal text-white px-3 py-1 text-xs rounded-full">
                        New
                      </span>
                    )}
                    {product.bestseller && (
                      <span className="bg-pharaonic-gold text-white px-3 py-1 text-xs rounded-full">
                        Bestseller
                      </span>
                    )}
                  </div>
                  
                  {/* Image controls */}
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    <button
                      onClick={toggleViewer}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                      title="View in 3D"
                    >
                      <CubeTransparentIcon className="h-5 w-5 text-gray-700" />
                    </button>
                    <Link
                      href={`/try-and-fit/ar?product=${product.id}`}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                      title="Try on with AR"
                    >
                      <DevicePhoneMobileIcon className="h-5 w-5 text-gray-700" />
                    </Link>
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      {isFavorite ? (
                        <HeartIconSolid className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5 text-gray-700" />
                      )}
                    </button>
                    <button
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                      title="Share"
                    >
                      <ShareIcon className="h-5 w-5 text-gray-700" />
                    </button>
                  </div>
                </div>
                
                {/* Thumbnail navigation */}
                <div className="mt-4 flex justify-start space-x-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-16 h-16 rounded-md overflow-hidden border-2 ${
                        selectedImage === index ? 'border-nile-teal' : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 3D Viewer Modal */}
              {showViewer && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
                  <div className="bg-white rounded-lg overflow-hidden w-full max-w-4xl">
                    <div className="flex justify-between items-center p-4 border-b">
                      <h3 className="text-lg font-bold">3D Preview</h3>
                      <button
                        onClick={toggleViewer}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="h-[500px]">
                      <Suspense fallback={
                        <div className="h-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nile-teal"></div>
                        </div>
                      }>
                        <JewelryViewer 
                          modelPath={product.modelPath} 
                          selectedMetal={selectedMetal as any}
                          selectedGem={selectedGem as any}
                        />
                      </Suspense>
                    </div>
                    <div className="p-4 border-t flex justify-between">
                      <Link
                        href={`/try-and-fit/ar?product=${product.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 bg-nile-teal text-white rounded-md hover:bg-opacity-90 transition-colors"
                      >
                        <DevicePhoneMobileIcon className="h-5 w-5 mr-2" />
                        Try On With AR
                      </Link>
                      <button
                        onClick={toggleViewer}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Product details */}
            <div className="md:w-1/2 px-4">
              <div className="mb-2">
                <Link
                  href={`/jewelry/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm text-nile-teal hover:underline"
                >
                  {product.category}
                </Link>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2 font-serif">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <RatingStars rating={product.rating} />
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
              
              <div className="mb-6">
                <p className="text-2xl font-bold text-pharaonic-gold">
                  {formatCurrency(product.price)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {product.availability === 'in-stock' ? (
                    <span className="text-green-600">In Stock</span>
                  ) : product.availability === 'low-stock' ? (
                    <span className="text-orange-500">Low Stock</span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </p>
              </div>
              
              <div className="prose prose-sm text-gray-700 mb-6 max-w-none">
                <p>{product.description}</p>
              </div>
              
              <div className="space-y-6 mb-8">
                {/* Metal selection */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Metal Type</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {product.metalTypes.map((metal) => (
                      <button
                        key={metal}
                        onClick={() => setSelectedMetal(metal)}
                        className={`px-4 py-2 border rounded-md text-sm ${
                          selectedMetal === metal 
                            ? 'bg-nile-teal text-white border-nile-teal' 
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {metal.charAt(0).toUpperCase() + metal.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Gem selection */}
                {product.gemTypes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Gem Type</h3>
                    <select
                      value={selectedGem}
                      onChange={(e) => setSelectedGem(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-nile-teal"
                    >
                      {product.gemTypes.map((gem) => (
                        <option key={gem} value={gem}>
                          {gem.charAt(0).toUpperCase() + gem.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                {/* Size selection */}
                {product.type === 'ring' && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-medium text-gray-900">Ring Size</h3>
                      <Link
                        href="/try-and-fit/size"
                        className="text-xs text-nile-teal hover:text-pharaonic-gold"
                      >
                        Find your size
                      </Link>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-2 border rounded-md text-sm ${
                            selectedSize === size 
                              ? 'bg-nile-teal text-white border-nile-teal' 
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Quantity selector */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
                  <div className="flex items-center">
                    <button
                      onClick={decrementQuantity}
                      className="px-3 py-1 border border-gray-300 rounded-l-md"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      readOnly
                      className="w-12 text-center border-t border-b border-gray-300 py-1"
                    />
                    <button
                      onClick={incrementQuantity}
                      className="px-3 py-1 border border-gray-300 rounded-r-md"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-col space-y-3">
                <button
                  onClick={addToCart}
                  className="w-full bg-pharaonic-gold text-white py-3 px-6 rounded-md hover:bg-opacity-90 transition-colors flex items-center justify-center"
                  disabled={product.availability === 'out-of-stock'}
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={toggleViewer}
                    className="py-2 px-4 border border-nile-teal text-nile-teal rounded-md hover:bg-nile-teal hover:text-white transition-colors flex items-center justify-center"
                  >
                    <ViewfinderCircleIcon className="h-5 w-5 mr-2" />
                    View in 3D
                  </button>
                  
                  <Link
                    href={`/try-and-fit/ar?product=${product.id}`}
                    className="py-2 px-4 border border-nile-teal text-nile-teal rounded-md hover:bg-nile-teal hover:text-white transition-colors flex items-center justify-center"
                  >
                    <DevicePhoneMobileIcon className="h-5 w-5 mr-2" />
                    Try On AR
                  </Link>
                </div>
              </div>
              
              {/* Store availability */}
              <div className="mt-8 pt-6 border-t">
                <button
                  className="flex items-center text-nile-teal hover:text-pharaonic-gold"
                >
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  Check availability in store
                </button>
              </div>
              
              {/* Product details accordion */}
              <div className="mt-8 space-y-4">
                <details className="group border-b pb-2">
                  <summary className="flex justify-between items-center text-gray-900 font-medium cursor-pointer list-none">
                    <span>Materials</span>
                    <span className="transition-transform group-open:rotate-180">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="mt-2 text-gray-600">
                    <ul className="list-disc pl-5 space-y-1">
                      {product.materials.map((material) => (
                        <li key={material}>{material}</li>
                      ))}
                    </ul>
                  </div>
                </details>
                
                <details className="group border-b pb-2">
                  <summary className="flex justify-between items-center text-gray-900 font-medium cursor-pointer list-none">
                    <span>Shipping & Returns</span>
                    <span className="transition-transform group-open:rotate-180">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="mt-2 text-gray-600">
                    <p className="mb-2">Free standard shipping on all orders.</p>
                    <p>Return policy: You can return items within 30 days of delivery for a full refund.</p>
                  </div>
                </details>
                
                <details className="group border-b pb-2">
                  <summary className="flex justify-between items-center text-gray-900 font-medium cursor-pointer list-none">
                    <span>Care Instructions</span>
                    <span className="transition-transform group-open:rotate-180">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="mt-2 text-gray-600">
                    <p>Clean with a soft, lint-free cloth. Avoid contact with chemicals, especially chlorine and harsh cleaning solutions.</p>
                  </div>
                </details>
              </div>
            </div>
          </div>
          
          {/* Product recommendations */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-nile-teal mb-6 font-serif">You Might Also Like</h2>
            
            {/* Recommendation cards would go here */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* This would be populated with actual product recommendations */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                </div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                </div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                </div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                </div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 