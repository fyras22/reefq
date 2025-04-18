'use client';

import { useState, useEffect } from 'react';
import { useWishlist } from '@/services/wishlist';
import Link from 'next/link';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function WishlistPage() {
  const { items, loading, removeItem } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration issues
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        <p>Loading wishlist...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        <div className="text-center py-10">
          <p className="mb-6">Your wishlist is empty.</p>
          <Link href="/products" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map(item => (
          <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
            <div className="relative h-48 w-full bg-gray-100">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{item.name}</h3>
                  <p className="text-gray-500 text-sm">{item.category}</p>
                  <p className="text-lg font-bold mt-2">${item.price.toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-gray-500 hover:text-red-600 transition p-1"
                  aria-label="Remove from wishlist"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <Link 
                href={`/products/${item.id}`}
                className="block w-full text-center bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700 transition"
              >
                View Product
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 