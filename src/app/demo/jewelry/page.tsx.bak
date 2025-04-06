'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCT_CATEGORIES, MATERIALS } from '@/lib/assets/MediaAssets';
import ProductGallery from '@/components/products/ProductGallery';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  images: any;
  models?: any;
  variants: any[];
  hasAR: boolean;
  has3D: boolean;
  rating: number;
  reviewCount: number;
  metadata: {
    materials: string[];
    dimensions: string;
    weight: string;
  };
}

export default function JewelryDemoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch sample products
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch('/api/assets/sample-products?has3D=true');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        
        const data = await response.json();
        setProducts(data.products);
        
        // Set the first product as selected by default
        if (data.products?.length > 0) {
          setSelectedProduct(data.products[0]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);
  
  // Handle product selection
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSelectedVariant('default');
  };
  
  // Handle variant selection
  const handleVariantSelect = (variantId: string) => {
    setSelectedVariant(variantId);
  };
  
  // Format price display
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };
  
  // Display loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading jewelry collection...</p>
        </div>
      </div>
    );
  }
  
  // Display error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 p-8 rounded-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // If no product is selected
  if (!selectedProduct) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8 text-center">Luxury Jewelry Collection</h1>
        <p className="text-center text-gray-600 mb-12">No products available.</p>
      </div>
    );
  }
  
  // Format current variant display name
  const getCurrentVariantName = () => {
    if (selectedVariant === 'default') {
      return 'Standard';
    }
    
    const variant = selectedProduct.variants.find(v => v.id === selectedVariant);
    return variant ? variant.name : 'Standard';
  };
  
  // Get current variant images
  const getCurrentVariantImages = () => {
    if (selectedVariant === 'default') {
      return selectedProduct.images;
    }
    
    const variant = selectedProduct.variants.find(v => v.id === selectedVariant);
    return variant?.images || selectedProduct.images;
  };
  
  // Get current variant models
  const getCurrentVariantModels = () => {
    if (selectedVariant === 'default') {
      return selectedProduct.models;
    }
    
    const variant = selectedProduct.variants.find(v => v.id === selectedVariant);
    return variant?.models || selectedProduct.models;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
          Luxury Jewelry Collection
        </h1>
        <p className="text-gray-600 text-center">
          Experience our exquisite pieces with interactive 3D and AR technology
        </p>
      </header>
      
      {/* Product gallery layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Product list sidebar */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <h2 className="text-lg font-semibold mb-4">Collection</h2>
          <ul className="space-y-4">
            {products.map(product => (
              <li key={product.id}>
                <button
                  onClick={() => handleProductSelect(product)}
                  className={`flex items-center rounded-lg p-2 w-full transition ${
                    selectedProduct.id === product.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="relative w-16 h-16 mr-3 rounded overflow-hidden bg-gray-100">
                    <Image
                      src={product.images.primary}
                      alt={product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-sm font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
                    <div className="flex items-center mt-1">
                      {product.hasAR && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded mr-2">
                          AR
                        </span>
                      )}
                      {product.has3D && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                          3D
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Main product display */}
        <div className="lg:col-span-6 order-1 lg:order-2">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <ProductGallery
              productName={selectedProduct.name}
              productId={selectedProduct.id}
              images={getCurrentVariantImages()}
              models={getCurrentVariantModels()}
              hasAR={selectedProduct.hasAR}
              has3D={selectedProduct.has3D}
              selectedVariant={selectedVariant}
            />
          </div>
        </div>
        
        {/* Product details sidebar */}
        <div className="lg:col-span-4 order-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold mb-2">{selectedProduct.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={`star-${i}`}
                    className={`w-4 h-4 ${
                      i < Math.floor(selectedProduct.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10 15.934L4.126 19 5.252 12.232 0.503 7.562 7.213 6.626 10 0.5 12.787 6.626 19.497 7.562 14.748 12.232 15.874 19z"
                    />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600 text-sm">
                {selectedProduct.rating.toFixed(1)} ({selectedProduct.reviewCount} reviews)
              </span>
            </div>
            
            <div className="text-2xl font-bold text-blue-700 mb-6">
              {formatPrice(selectedProduct.price)}
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">{selectedProduct.description}</p>
              
              <h3 className="font-semibold mb-2">Materials</h3>
              <ul className="list-disc list-inside mb-4 text-gray-700">
                {selectedProduct.metadata.materials.map((material, i) => (
                  <li key={`material-${i}`}>{material}</li>
                ))}
              </ul>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-semibold mb-1">Dimensions</h3>
                  <p className="text-gray-700">{selectedProduct.metadata.dimensions}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Weight</h3>
                  <p className="text-gray-700">{selectedProduct.metadata.weight}</p>
                </div>
              </div>
            </div>
            
            {/* Variant selector */}
            {selectedProduct.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Options</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleVariantSelect('default')}
                    className={`px-4 py-2 rounded-full border ${
                      selectedVariant === 'default'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    Standard
                  </button>
                  {selectedProduct.variants.map(variant => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantSelect(variant.id)}
                      className={`px-4 py-2 rounded-full border ${
                        selectedVariant === variant.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Call to action buttons */}
            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition">
                Add to Cart
              </button>
              <button className="w-full bg-white hover:bg-gray-50 text-blue-600 font-medium py-3 px-4 rounded-lg border border-blue-600 transition">
                Save to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Experience highlight section */}
      <section className="mt-16 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Experience The Difference</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Interact in 3D</h3>
            <p className="text-gray-700 mb-4">Examine every detail of our jewelry pieces with interactive 3D models that you can rotate, zoom, and explore from any angle.</p>
            
            <Link href="/demo/jewelry" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Try the 3D Viewer →
            </Link>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Try-On with AR</h3>
            <p className="text-gray-700 mb-4">Use augmented reality to see how our jewelry looks on you before purchasing. Available for supported mobile devices.</p>
            
            <Link href="/demo/jewelry" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
              View AR Experience →
            </Link>
          </div>
          
          <div className="bg-amber-50 p-6 rounded-lg">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Explore in Detail</h3>
            <p className="text-gray-700 mb-4">Zoom in to see the craftsmanship and quality of every piece. Each stone setting, engraving, and finish is visible in high detail.</p>
            
            <Link href="/demo/jewelry" className="text-amber-600 hover:text-amber-800 text-sm font-medium">
              See Details →
            </Link>
          </div>
        </div>
      </section>
      
      {/* Additional Tools section */}
      <section className="mt-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Jewelry Education & Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Diamond Visualizer</h3>
                <p className="text-gray-600 mb-4">
                  Explore diamond cuts, colors, and clarity grades. Understand how each property affects a diamond's appearance and value.
                </p>
                <Link 
                  href="/demo/jewelry/diamond-visualizer" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  Try Diamond Visualizer
                  <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Custom Jewelry Designer</h3>
                <p className="text-gray-600 mb-4">
                  Design your own custom jewelry piece. Choose from different styles, metals, gemstones, and settings to create something unique.
                </p>
                <Link 
                  href="/demo/jewelry/custom-design" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  Create Custom Design
                  <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 