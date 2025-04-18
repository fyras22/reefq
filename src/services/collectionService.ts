import { create } from 'zustand';

export interface CollectionItem {
  id: string;
  name: string;
  description: string;
  image: string;
  products: string[]; // Array of product IDs
  featured: boolean;
  slug: string;
}

interface CollectionState {
  collections: CollectionItem[];
  featuredCollections: CollectionItem[];
  isLoading: boolean;
  error: string | null;
  fetchCollections: () => Promise<void>;
  getCollectionBySlug: (slug: string) => CollectionItem | undefined;
}

// Mock data for development
const mockCollections: CollectionItem[] = [
  {
    id: '1',
    name: 'Summer Essentials',
    description: 'Lightweight and elegant jewelry perfect for summer occasions',
    image: '/images/collections/summer-collection.jpg',
    products: ['1', '3', '5', '8'],
    featured: true,
    slug: 'summer-essentials'
  },
  {
    id: '2',
    name: 'Diamond Classics',
    description: 'Timeless diamond pieces for any occasion',
    image: '/images/collections/diamond-classics.jpg',
    products: ['2', '4', '7', '9'],
    featured: true,
    slug: 'diamond-classics'
  },
  {
    id: '3',
    name: 'Gold Statement',
    description: 'Bold gold pieces that make a statement',
    image: '/images/collections/gold-statement.jpg',
    products: ['6', '10', '11', '12'],
    featured: false,
    slug: 'gold-statement'
  },
  {
    id: '4',
    name: 'Bridal Collection',
    description: 'Elegant pieces for your special day',
    image: '/images/collections/bridal-collection.jpg',
    products: ['5', '7', '9', '13'],
    featured: true,
    slug: 'bridal-collection'
  }
];

export const useCollectionStore = create<CollectionState>((set, get) => ({
  collections: [],
  featuredCollections: [],
  isLoading: false,
  error: null,
  
  fetchCollections: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data with a simulated delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const collections = mockCollections;
      const featuredCollections = collections.filter(collection => collection.featured);
      
      set({ 
        collections, 
        featuredCollections,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch collections', 
        isLoading: false 
      });
    }
  },
  
  getCollectionBySlug: (slug: string) => {
    return get().collections.find(collection => collection.slug === slug);
  }
}));

// Hook for easy use in components
export function useCollections() {
  const store = useCollectionStore();
  
  return {
    collections: store.collections,
    featuredCollections: store.featuredCollections,
    isLoading: store.isLoading,
    error: store.error,
    fetchCollections: store.fetchCollections,
    getCollectionBySlug: store.getCollectionBySlug
  };
} 