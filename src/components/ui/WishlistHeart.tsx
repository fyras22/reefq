'use client';

import { useEffect, useState } from 'react';
import { HeartIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/services/wishlist';

interface WishlistHeartProps {
  itemId: string;
  className?: string;
  size?: number;
}

export function WishlistHeart({ itemId, className, size = 24 }: WishlistHeartProps) {
  const { hasItem, toggleItem } = useWishlist();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Handle hydration mismatch by only showing on client
  useEffect(() => {
    setIsClient(true);
    setIsFavorite(hasItem(itemId));
  }, [hasItem, itemId]);
  
  if (!isClient) return null;
  
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(itemId);
        setIsFavorite(!isFavorite);
      }}
      className={cn(
        "transition-all duration-300 hover:scale-110 focus:outline-none", 
        className
      )}
      aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
    >
      <HeartIcon
        size={size}
        className={cn(
          "transition-colors duration-300",
          isFavorite ? "fill-red-500 stroke-red-500" : "stroke-gray-500 hover:stroke-red-400"
        )}
      />
    </button>
  );
} 