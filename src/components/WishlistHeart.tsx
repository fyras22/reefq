'use client';

import { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useWishlist } from '@/services/wishlist';

interface WishlistHeartProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
  };
  className?: string;
}

export default function WishlistHeart({ product, className = '' }: WishlistHeartProps) {
  const { addItem, removeItem, hasItem } = useWishlist();
  const [isMounted, setIsMounted] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsInWishlist(hasItem(product.id));
  }, [hasItem, product.id]);

  const toggleWishlist = () => {
    if (isInWishlist) {
      removeItem(product.id);
      setIsInWishlist(false);
    } else {
      addItem(product.id);
      setIsInWishlist(true);
    }
  };

  if (!isMounted) return null;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist();
      }}
      className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${className}`}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isInWishlist ? (
        <HeartSolidIcon className="h-6 w-6 text-red-500" />
      ) : (
        <HeartIcon className="h-6 w-6 text-gray-600 hover:text-red-500" />
      )}
    </button>
  );
} 