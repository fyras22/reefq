'use client';

import { useEffect, useState } from 'react';
import { HeartIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WishlistHeartProps {
  itemId: string;
  className?: string;
  size?: number;
}

export function WishlistHeart({ itemId, className, size = 24 }: WishlistHeartProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // In a real app, we would check if the item is in the wishlist
  // For this demo, we'll just use local state
  useEffect(() => {
    setIsClient(true);
    // Mock implementation - in a real app, we would check if the item is in the wishlist
    setIsFavorite(false);
  }, [itemId]);
  
  if (!isClient) return null;
  
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(!isFavorite);
        // In a real app, we would call the wishlist service here
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