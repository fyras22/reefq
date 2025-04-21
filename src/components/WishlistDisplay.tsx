'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/services/wishlist';
import { Button } from '@/components/ui/Button';
import { WishlistHeart } from '@/components/ui/WishlistHeart';
import { ShoppingBag } from 'lucide-react';

export function WishlistDisplay() {
  const { items, loading } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="w-full h-60 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-medium mb-2">Your wishlist is empty</h2>
        <p className="text-muted-foreground mb-8">
          Items added to your wishlist will appear here
        </p>
        <Link href="/products" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <div key={item.id} className="group relative border rounded-lg overflow-hidden">
          <div className="aspect-square relative">
            <Link href={`/products/${item.id}`}>
              <Image 
                src={item.image} 
                alt={item.name} 
                fill 
                className="object-cover transition-transform group-hover:scale-105"
              />
            </Link>
            <div className="absolute top-2 right-2">
              <WishlistHeart itemId={item.id} />
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-medium truncate">{item.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{item.category}</p>
            <div className="flex items-center justify-between">
              <p className="font-semibold">${item.price.toFixed(2)}</p>
              <button className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-200 transition">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 