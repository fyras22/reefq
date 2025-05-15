import { useCollectionStore } from "@/services/collectionService";
import { useProductStore } from "@/services/productService";

/**
 * Preloads collections data for faster initial loading
 */
export async function loadCollections() {
  // Only run this in the browser
  if (typeof window === "undefined") return;

  try {
    // Get the store methods without using the hook (which is for components only)
    const store = useCollectionStore.getState();
    const productStore = useProductStore.getState();

    // Fetch collections data
    await store.fetchCollections();

    // Also fetch products data
    await productStore.fetchProducts();

    console.log("Collections and products preloaded successfully");
  } catch (error) {
    console.error("Error preloading collections data:", error);
  }
}
