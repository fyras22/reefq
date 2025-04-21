'use client';

import { useState, useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getStorageItem, setStorageItem } from '@/utils/localStorage';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

// Mock product database
const mockProducts: Record<string, WishlistItem> = {
  '1': {
    id: '1',
    name: 'Gold Hoop Earrings',
    price: 129.99,
    image: '/images/products/gold-hoop-earrings.jpg',
    category: 'Earrings'
  },
  '2': {
    id: '2',
    name: 'Diamond Tennis Bracelet',
    price: 999.99,
    image: '/images/products/diamond-tennis-bracelet.jpg',
    category: 'Bracelets'
  },
  '3': {
    id: '3',
    name: 'Pearl Necklace',
    price: 249.99,
    image: '/images/products/pearl-necklace.jpg',
    category: 'Necklaces'
  },
  '4': {
    id: '4',
    name: 'Diamond Stud Earrings',
    price: 599.99,
    image: '/images/products/diamond-stud-earrings.jpg',
    category: 'Earrings'
  },
  '5': {
    id: '5',
    name: 'Rose Gold Ring',
    price: 349.99,
    image: '/images/products/rose-gold-ring.jpg',
    category: 'Rings'
  }
};

const WISHLIST_KEY = 'reefq_wishlist';

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  hasItem: (id: string) => boolean;
  clear: () => void;
}

// Helper function to get initial items from localStorage
const getInitialItems = (): WishlistItem[] => {
  const ids = getStorageItem<string[]>(WISHLIST_KEY, []);
  // Convert IDs to actual product objects
  return ids.map(id => mockProducts[id]).filter(Boolean);
};

// Helper function to save IDs to localStorage
const saveItems = (items: WishlistItem[]) => {
  const ids = items.map(item => item.id);
  setStorageItem(WISHLIST_KEY, ids);
};

export const useWishlist = create<WishlistState>((set, get) => ({
  items: [],
  loading: true,

  addItem: (id: string) => {
    if (mockProducts[id] && !get().hasItem(id)) {
      set(state => {
        const newItems = [...state.items, mockProducts[id]];
        saveItems(newItems);
        return { items: newItems };
      });
    }
  },

  removeItem: (id: string) => {
    set(state => {
      const newItems = state.items.filter(item => item.id !== id);
      saveItems(newItems);
      return { items: newItems };
    });
  },

  toggleItem: (id: string) => {
    const hasItem = get().hasItem(id);
    if (hasItem) {
      get().removeItem(id);
    } else {
      get().addItem(id);
    }
  },

  hasItem: (id: string) => {
    return get().items.some(item => item.id === id);
  },

  clear: () => {
    set({ items: [] });
    setStorageItem(WISHLIST_KEY, []);
  }
}));

// Initialize the store
if (typeof window !== 'undefined') {
  setTimeout(() => {
    useWishlist.setState({ 
      items: getInitialItems(),
      loading: false
    });
  }, 500); // Simulate a short delay to initialize
}

// Hook to use the wishlist store with client-side hydration handling
export function useWishlistClient() {
  const store = useWishlist();
  const [hydrated, setHydrated] = useState(false);
  
  useEffect(() => {
    // Mark as hydrated after mounting
    setHydrated(true);
    // Mark as not loading after hydration
    store.loading = false;
  }, []);
  
  // Return empty array during SSR to avoid hydration mismatch
  if (!hydrated) {
    return {
      items: [],
      loading: true,
      addItem: store.addItem,
      removeItem: store.removeItem,
      hasItem: store.hasItem,
      clear: store.clear,
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