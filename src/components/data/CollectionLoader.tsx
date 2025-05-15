"use client";

import { useCollections } from "@/services/collectionService";
import { useProducts } from "@/services/productService";
import { useEffect } from "react";

/**
 * This component preloads collection and product data on the client side.
 * It doesn't render anything, just triggers the data loading.
 */
export function CollectionLoader() {
  const { fetchCollections } = useCollections();
  const { fetchProducts } = useProducts();

  useEffect(() => {
    // Load collections and products data
    fetchCollections();
    fetchProducts();
  }, [fetchCollections, fetchProducts]);

  // This component doesn't render anything
  return null;
}
