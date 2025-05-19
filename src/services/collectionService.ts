import { collections as chichkhaneCollections } from "@/data/collections";
import { create } from "zustand";

export interface CollectionItem {
  id: string;
  name: string;
  description: string;
  image: string;
  products?: string[]; // Array of product IDs
  featured?: boolean;
  slug?: string;
  price?: string;
  category?: string;
  source?: string;
}

interface CollectionState {
  collections: CollectionItem[];
  featuredCollections: CollectionItem[];
  isLoading: boolean;
  error: string | null;
  fetchCollections: () => Promise<void>;
  getCollectionBySlug: (slug: string) => CollectionItem | undefined;
}

// Process the imported collections to create valid CollectionItems
function processImportedCollections(collections: any[]): CollectionItem[] {
  return collections.map((item) => {
    // Create a slug from the name if not present
    const slug = item.slug || item.name.toLowerCase().replace(/\s+/g, "-");

    // Create a product ID from the ID if products array is not present
    const products = item.products || [item.id];

    // Set featured to true if not specified
    const featured = item.featured !== undefined ? item.featured : true;

    return {
      ...item,
      slug,
      products,
      featured,
    };
  });
}

// Mock data for development
const mockCollections: CollectionItem[] = [
  {
    id: "1",
    name: "Summer Essentials",
    description: "Lightweight and elegant jewelry perfect for summer occasions",
    image: "/images/collections/summer-collection.jpg",
    products: ["1", "3", "5", "8"],
    featured: true,
    slug: "summer-essentials",
  },
  {
    id: "2",
    name: "Diamond Classics",
    description: "Timeless diamond pieces for any occasion",
    image: "/images/collections/diamond-classics.jpg",
    products: ["2", "4", "7", "9"],
    featured: true,
    slug: "diamond-classics",
  },
  {
    id: "3",
    name: "Gold Statement",
    description: "Bold gold pieces that make a statement",
    image: "/images/collections/gold-statement.jpg",
    products: ["6", "10", "11", "12"],
    featured: false,
    slug: "gold-statement",
  },
  {
    id: "4",
    name: "Bridal Collection",
    description: "Elegant pieces for your special day",
    image: "/images/collections/bridal-collection.jpg",
    products: ["5", "7", "9", "13"],
    featured: true,
    slug: "bridal-collection",
  },
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
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Combine mock collections with imported Chichkhane collections
      const processedChichkhaneCollections = processImportedCollections(
        chichkhaneCollections
      );

      // Group the Chichkhane collections by category
      const chichkhaneCategorized = {} as Record<string, CollectionItem[]>;
      processedChichkhaneCollections.forEach((item) => {
        if (item.category) {
          if (!chichkhaneCategorized[item.category]) {
            chichkhaneCategorized[item.category] = [];
          }
          chichkhaneCategorized[item.category].push(item);
        }
      });

      // Create a new collection for each category
      const chichkhaneByCategory = Object.entries(chichkhaneCategorized).map(
        ([category, items]) => {
          return {
            id: `chichkhane-${category.toLowerCase()}`,
            name: `Chichkhane ${category} Collection`,
            description: `Beautiful ${category.toLowerCase()} pieces from Bijouterie Chichkhane, featuring exquisite craftsmanship and timeless designs.`,
            image: items[0].image, // Use the first item's image as the collection image
            products: items.map((item) => item.id),
            featured: true,
            slug: `chichkhane-${category.toLowerCase()}-collection`,
            source: "Chichkhane",
          };
        }
      );

      // Create a main Chichkhane collection that includes all items
      const mainChichkhaneCollection = {
        id: "chichkhane",
        name: "Chichkhane Collection",
        description:
          "Elegant jewelry pieces from the renowned Bijouterie Chichkhane, featuring exquisite craftsmanship and timeless designs.",
        image: processedChichkhaneCollections[0].image,
        products: processedChichkhaneCollections.map((item) => item.id),
        featured: true,
        slug: "chichkhane-collection",
        source: "Chichkhane",
      };

      // Add the processedChichkhaneCollections directly to the main collections array
      // instead of creating an additional category structure
      const allCollections = [
        ...mockCollections,
        mainChichkhaneCollection,
        ...chichkhaneByCategory,
        ...processedChichkhaneCollections, // Include all individual products directly in the collection list
      ];

      const featuredCollections = [
        ...mockCollections.filter((collection) => collection.featured),
        mainChichkhaneCollection, // Always feature the main Chichkhane collection
        // Only include a few category collections to avoid overwhelming the featured section
        ...chichkhaneByCategory.slice(0, 2),
      ];

      set({
        collections: allCollections,
        featuredCollections,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch collections:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch collections",
        isLoading: false,
      });
    }
  },

  getCollectionBySlug: (slug: string) => {
    return get().collections.find((collection) => collection.slug === slug);
  },
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
    getCollectionBySlug: store.getCollectionBySlug,
  };
}
