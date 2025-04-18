import { getStorageItem, setStorageItem } from '@/utils/localStorage';
import { create } from 'zustand';

const WISHLIST_STORAGE_KEY = 'reefq_wishlist';

interface WishlistState {
  items: Set<string>;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  hasItem: (id: string) => boolean;
  clear: () => void;
  count: () => number;
}

// Initialize from localStorage if available
const getInitialItems = (): Set<string> => {
  const storedItems = getStorageItem<string[]>(WISHLIST_STORAGE_KEY, []);
  return new Set(storedItems);
};

// Create a store with Zustand for global state management
export const useWishlist = create<WishlistState>((set, get) => ({
  items: getInitialItems(),
  
  addItem: (id: string) => {
    set((state) => {
      const newItems = new Set(state.items);
      newItems.add(id);
      // Update localStorage
      setStorageItem(WISHLIST_STORAGE_KEY, Array.from(newItems));
      return { items: newItems };
    });
  },
  
  removeItem: (id: string) => {
    set((state) => {
      const newItems = new Set(state.items);
      newItems.delete(id);
      // Update localStorage
      setStorageItem(WISHLIST_STORAGE_KEY, Array.from(newItems));
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
    return get().items.has(id);
  },
  
  clear: () => {
    set({ items: new Set() });
    setStorageItem(WISHLIST_STORAGE_KEY, []);
  },
  
  count: () => {
    return get().items.size;
  }
})); 