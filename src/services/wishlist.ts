'use client';

import { useState, useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  hasItem: (id: string) => boolean;
  clearItems: () => void;
}

// Create a Zustand store with persistence
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: true,
      addItem: (item) => {
        const hasItem = get().hasItem(item.id);
        if (!hasItem) {
          set((state) => ({ items: [...state.items, item] }));
        }
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      hasItem: (id) => {
        return get().items.some((item) => item.id === id);
      },
      clearItems: () => set({ items: [] }),
    }),
    {
      name: 'reefq-wishlist',
    }
  )
);

// Hook to use the wishlist store with client-side hydration handling
export function useWishlist() {
  const store = useWishlistStore();
  const [hydrated, setHydrated] = useState(false);
  
  useEffect(() => {
    // Mark as hydrated after mounting
    setHydrated(true);
    // Mark as not loading after hydration
    store.isLoading = false;
  }, []);
  
  // Return empty array during SSR to avoid hydration mismatch
  if (!hydrated) {
    return {
      items: [],
      isLoading: true,
      addItem: store.addItem,
      removeItem: store.removeItem,
      hasItem: store.hasItem,
      clearItems: store.clearItems,
    };
  }
  
  return store;
}

export function useWishlistLocalStorage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load wishlist from localStorage on mount
    const loadWishlist = () => {
      try {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          setItems(JSON.parse(savedWishlist));
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  useEffect(() => {
    // Save wishlist to localStorage when it changes
    if (!loading) {
      localStorage.setItem('wishlist', JSON.stringify(items));
    }
  }, [items, loading]);

  const addItem = (item: WishlistItem) => {
    setItems(prev => {
      // Check if item already exists
      if (prev.some(existingItem => existingItem.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const isInWishlist = (id: string): boolean => {
    return items.some(item => item.id === id);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  return {
    items,
    loading,
    addItem,
    removeItem,
    isInWishlist,
    clearWishlist
  };
} 