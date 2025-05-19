"use client";

import { useTranslation } from "@/app/i18n-client";
import { ProductImage } from "@/components/ui/ProductImage";
import { useCollections } from "@/services/collectionService";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export function FeaturedCollections() {
  const { featuredCollections, isLoading, error, fetchCollections } =
    useCollections();
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const { t } = useTranslation(lang, "common");

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || featuredCollections.length === 0) {
    return null;
  }

  // Display only category collections, not individual products
  const collectionsToDisplay = featuredCollections
    .filter(
      (collection) =>
        // If the collection has a products array, it's a category collection
        Array.isArray(collection.products) && collection.products.length > 0
    )
    .slice(0, 3); // Limit to 3 collections for display

  return (
    <div className="mx-auto max-w-screen-2xl px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collectionsToDisplay.map((collection) => (
          <Link
            key={collection.id}
            href={`/${lang}/collections/${collection.slug}`}
            className="group block"
          >
            <div className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
              <div className="relative h-80 w-full">
                <ProductImage
                  src={collection.image}
                  alt={collection.name}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  productId={collection.id}
                />
                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  {collection.source
                    ? collection.source
                    : t("collections.featured")}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {collection.name}
                </h3>
                <p className="text-gray-600 mb-4">{collection.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {collection.products
                      ? t("collections.itemCount", {
                          count: collection.products.length,
                        })
                      : ""}
                  </span>
                  <span className="text-primary font-medium group-hover:underline">
                    {t("collections.viewCollection")} &rarr;
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link
          href={`/${lang}/collections`}
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
        >
          {t("collections.viewAllCollections")}
        </Link>
      </div>
    </div>
  );
}
