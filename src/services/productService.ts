import { create } from "zustand";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string | number;
  image: string;
  category: string;
  link?: string;
  source?: string;
}

interface ProductState {
  products: Record<string, Product>;
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  getProductsByIds: (ids: string[]) => Product[];
}

// Mock products data - will be extended with Chichkhane products
const mockProducts: Record<string, Product> = {
  "1": {
    id: "1",
    name: "Gold Hoop Earrings",
    price: 129.99,
    image: "/images/products/gold-hoop-earrings.jpg",
    category: "Earrings",
    description: "Elegant gold hoop earrings perfect for any occasion.",
  },
  "2": {
    id: "2",
    name: "Diamond Tennis Bracelet",
    price: 999.99,
    image: "/images/products/diamond-tennis-bracelet.jpg",
    category: "Bracelets",
    description:
      "Stunning diamond tennis bracelet with brilliant cut diamonds.",
  },
  "3": {
    id: "3",
    name: "Pearl Necklace",
    price: 249.99,
    image: "/images/products/pearl-necklace.jpg",
    category: "Necklaces",
    description: "Classic pearl necklace with hand-selected freshwater pearls.",
  },
  "4": {
    id: "4",
    name: "Diamond Stud Earrings",
    price: 599.99,
    image: "/images/products/diamond-stud-earrings.jpg",
    category: "Earrings",
    description: "Timeless diamond stud earrings set in 18k white gold.",
  },
  "5": {
    id: "5",
    name: "Rose Gold Ring",
    price: 349.99,
    image: "/images/products/rose-gold-ring.jpg",
    category: "Rings",
    description: "Elegant rose gold ring with delicate design.",
  },
  "6": {
    id: "6",
    name: "Gold Chain Necklace",
    price: 179.99,
    image: "/images/products/gold-chain-necklace.jpg",
    category: "Necklaces",
    description: "Classic gold chain necklace crafted in 18k gold.",
  },
  "7": {
    id: "7",
    name: "Diamond Pendant",
    price: 699.99,
    image: "/images/products/diamond-pendant.jpg",
    category: "Necklaces",
    description: "Stunning diamond pendant with a brilliant cut diamond.",
  },
  "8": {
    id: "8",
    name: "Silver Cuff Bracelet",
    price: 149.99,
    image: "/images/products/silver-cuff-bracelet.jpg",
    category: "Bracelets",
    description: "Sleek silver cuff bracelet with modern design.",
  },
  "9": {
    id: "9",
    name: "Diamond Engagement Ring",
    price: 2499.99,
    image: "/images/products/diamond-engagement-ring.jpg",
    category: "Rings",
    description:
      "Exquisite diamond engagement ring with center stone and pavé band.",
  },
  "10": {
    id: "10",
    name: "Gold Bangle Bracelet",
    price: 299.99,
    image: "/images/products/gold-bangle-bracelet.jpg",
    category: "Bracelets",
    description: "Elegant gold bangle bracelet with timeless design.",
  },
  "11": {
    id: "11",
    name: "Gold Drop Earrings",
    price: 229.99,
    image: "/images/products/gold-drop-earrings.jpg",
    category: "Earrings",
    description: "Beautiful gold drop earrings with delicate details.",
  },
  "12": {
    id: "12",
    name: "Gold Statement Ring",
    price: 379.99,
    image: "/images/products/gold-statement-ring.jpg",
    category: "Rings",
    description: "Bold gold statement ring to elevate any outfit.",
  },
  "13": {
    id: "13",
    name: "Silver Pendant Necklace",
    price: 159.99,
    image: "/images/products/silver-pendant-necklace.jpg",
    category: "Necklaces",
    description: "Elegant silver pendant necklace with modern design.",
  },
  // Chichkhane collection mock products
  "chichkhane-1": {
    id: "chichkhane-1",
    name: 'Bracelet Diamants Rose "Chichkhane" 70391',
    image: "/images/products/chichkhane/bracelet-diamants-rose-70391.jpg",
    price: "Demander à la bijouterie",
    category: "Bracelets",
    description:
      "Elegant bracelet with pink diamonds from the Bijouterie Chichkhane collection.",
  },
  "chichkhane-2": {
    id: "chichkhane-2",
    name: "Bracelet Zircon 66185",
    image: "/images/products/chichkhane/bracelet-zircon-66185.jpg",
    price: "Demander à la bijouterie",
    category: "Bracelets",
    description:
      "Elegant zircon bracelet from the Bijouterie Chichkhane collection.",
  },
  "chichkhane-3": {
    id: "chichkhane-3",
    name: "Ensemble Diamants MO2244B",
    image: "/images/products/chichkhane/ensemble-diamants-mo2244b.jpg",
    price: "2340 TND",
    category: "Sets",
    description:
      "Elegant diamond set from the Bijouterie Chichkhane collection.",
  },
  "chichkhane-4": {
    id: "chichkhane-4",
    name: "Collier Diamants 68381",
    image: "/images/products/chichkhane/collier-diamants-68381.jpg",
    price: "Demander à la bijouterie",
    category: "Necklaces",
    description:
      "Elegant diamond necklace from the Bijouterie Chichkhane collection.",
  },
  "chichkhane-5": {
    id: "chichkhane-5",
    name: "Bague Zircon 65459",
    image: "/images/products/chichkhane/bague-zircon-65459.jpg",
    price: "1460 TND",
    category: "Rings",
    description:
      "Elegant zircon ring from the Bijouterie Chichkhane collection.",
  },
  "chichkhane-6": {
    id: "chichkhane-6",
    name: "Boucles D'oreilles Zircon 61457",
    image: "/images/products/chichkhane/boucles-doreilles-zircon-61457.jpg",
    price: "1090 TND",
    category: "Earrings",
    description:
      "Elegant zircon earrings from the Bijouterie Chichkhane collection.",
  },
};

export const useProductStore = create<ProductState>((set, get) => ({
  products: {},
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });

    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data with a simulated delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      let products = { ...mockProducts };

      // Import Chichkhane collections
      try {
        // Dynamic import of collections to avoid circular dependencies
        const collectionsModule = await import("@/data/collections");
        const chichkhaneProducts = collectionsModule.collections.filter(
          (item: any) => item.source === "Chichkhane" && item.isProduct
        );

        console.log(
          `Importing ${chichkhaneProducts.length} Chichkhane products to product service`
        );

        // Add each Chichkhane product to the products object
        chichkhaneProducts.forEach((collection: any) => {
          if (collection.products && collection.products.length > 0) {
            const productId = collection.products[0];

            // Create a product from the collection data
            products[productId] = {
              id: productId,
              name: collection.name,
              description: collection.description,
              price: "Contact for price", // Default price if not available
              image: collection.image,
              category: collection.name.split(" ")[0], // Use the first word as category
              source: "Chichkhane",
            };
          }
        });

        // Additionally, look for any products directly in the chichkhaneCollections file
        try {
          const chichkhaneModule = await import("@/data/chichkhaneCollections");
          if (chichkhaneModule.chichkhaneCollections) {
            console.log(
              `Found ${chichkhaneModule.chichkhaneCollections.length} direct Chichkhane products`
            );

            chichkhaneModule.chichkhaneCollections.forEach((product: any) => {
              // Check if this product is already in our products object
              if (!products[product.id]) {
                // Convert price format if needed
                let price = product.price;
                if (typeof price === "string" && price.includes("TND")) {
                  // Convert from TND to USD at a fixed rate for display purposes
                  const tndValue = parseFloat(price.replace(/[^0-9.]/g, ""));
                  if (!isNaN(tndValue)) {
                    // Approximate conversion rate
                    const usdValue = (tndValue * 0.32).toFixed(2);
                    price = `$${usdValue}`;
                  }
                }

                // Ensure image path is correct - check if .png extension but file is .jpg
                let imagePath = product.image;
                if (imagePath && imagePath.endsWith(".png")) {
                  // Try .jpg instead for real images
                  const jpgPath = imagePath.replace(".png", ".jpg");
                  console.log(
                    `Converting image path from ${imagePath} to ${jpgPath}`
                  );
                  imagePath = jpgPath;
                }

                // Add the product to our products object
                products[product.id] = {
                  id: product.id,
                  name: product.name,
                  description: product.description || product.name,
                  price: price,
                  image: imagePath,
                  category: product.category || "Jewelry",
                  source: "Chichkhane",
                };
              }
            });
          }
        } catch (chichkhaneError) {
          console.error(
            "Error importing chichkhaneCollections:",
            chichkhaneError
          );
        }
      } catch (error) {
        console.error("Error importing collections for products:", error);
      }

      set({ products, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  getProductById: (id: string) => {
    return get().products[id];
  },

  getProductsByIds: (ids: string[]) => {
    return ids.map((id) => get().products[id]).filter(Boolean);
  },
}));

// Hook for easy use in components
export function useProducts() {
  const store = useProductStore();

  return {
    products: store.products,
    isLoading: store.isLoading,
    error: store.error,
    fetchProducts: store.fetchProducts,
    getProductById: store.getProductById,
    getProductsByIds: store.getProductsByIds,
  };
}
