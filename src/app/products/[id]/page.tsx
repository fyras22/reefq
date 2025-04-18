'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShoppingCartIcon,
  HeartIcon,
  ShareIcon,
  EyeIcon,
  CubeIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: { url: string; alt: string }[];
  category: string;
  hasAR: boolean;
  has3D: boolean;
  hasTryOn: boolean;
  isCustomizable: boolean;
  variants: {
    id: string;
    name: string;
    price: number;
    inStock: boolean;
  }[];
  avgRating: number;
  reviewCount: number;
}

export default function ProductPage() {
  const params = useParams();
  const productId = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const data = await response.json();
        setProduct(data);
        setSelectedVariant(data.variants[0]?.id || null);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nile-teal"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || "We couldn't find the product you're looking for."}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-nile-teal hover:bg-nile-teal/90"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const selectedVariantData = product.variants.find(v => v.id === selectedVariant);

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex text-sm">
            <Link href="/" className="text-gray-500 hover:text-nile-teal">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/products" className="text-gray-500 hover:text-nile-teal">Products</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={product.images[0]?.url || '/images/placeholder-product.jpg'}
                alt={product.images[0]?.alt || product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    i < Math.floor(product.avgRating) ? (
                      <StarIconSolid key={i} className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <StarIcon key={i} className="h-5 w-5 text-gray-300" />
                    )
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="ml-2 text-lg text-gray-500 line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variant
                </label>
                <select
                  value={selectedVariant || ''}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-teal focus:ring-nile-teal"
                >
                  {product.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.name} - ${variant.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-teal focus:ring-nile-teal"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                disabled={!selectedVariantData?.inStock}
                className={`flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                  selectedVariantData?.inStock 
                    ? 'bg-nile-teal hover:bg-nile-teal/90' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
              
              {product.isCustomizable && (
                <Link
                  href={`/customize?product=${productId}`}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-nile-teal rounded-md shadow-sm text-base font-medium text-nile-teal bg-white hover:bg-gray-50"
                >
                  Customize
                </Link>
              )}
              
              <button
                type="button"
                className="sm:flex-none inline-flex items-center justify-center p-3 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                <HeartIcon className="h-6 w-6" />
              </button>
              
              <button
                type="button"
                className="sm:flex-none inline-flex items-center justify-center p-3 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                <ShareIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-medium text-gray-900">Description</h2>
              <p className="mt-2 text-gray-600">{product.description}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {product.has3D && (
                <Link
                  href={`/3d-modeling/${productId}`}
                  className="inline-flex items-center px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800"
                >
                  <CubeIcon className="h-5 w-5 mr-2" />
                  View in 3D
                </Link>
              )}
              
              {product.hasAR && (
                <Link
                  href={`/ar-viewer/${productId}`}
                  className="inline-flex items-center px-4 py-2 text-sm rounded-md bg-nile-teal/10 hover:bg-nile-teal/20 text-nile-teal"
                >
                  <EyeIcon className="h-5 w-5 mr-2" />
                  View in Your Space
                </Link>
              )}
              
              {product.hasTryOn && (
                <Link
                  href={`/try-and-fit/ar?product=${productId}`}
                  className="inline-flex items-center px-4 py-2 text-sm rounded-md bg-nile-teal/10 hover:bg-nile-teal/20 text-nile-teal"
                >
                  <EyeIcon className="h-5 w-5 mr-2" />
                  Virtual Try-On
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 