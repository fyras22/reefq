"use client";

import { useTranslation } from "@/app/i18n-client";
import { FallbackImage } from "@/components/ui";
import { useCollections } from "@/services/collectionService";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Mock collection data with local SVG images
const mockCollections = [
  {
    id: "royal-heritage",
    name: "Royal Heritage",
    description: "Elegant jewelry inspired by ancient royal designs",
    image: "/images/collections-generated/royal-heritage.svg",
    products: Array(24).fill({}),
    slug: "royal-heritage",
    featured: true,
  },
  {
    id: "nature-inspired",
    name: "Nature Inspired",
    description:
      "Beautiful pieces that capture the essence of natural elements",
    image: "/images/collections-generated/nature-inspired.svg",
    products: Array(18).fill({}),
    slug: "nature-inspired",
    featured: true,
  },
  {
    id: "vintage-elegance",
    name: "Vintage Elegance",
    description: "Timeless pieces inspired by classic jewelry designs",
    image: "/images/collections-generated/vintage-elegance.svg",
    products: Array(21).fill({}),
    slug: "vintage-elegance",
    featured: true,
  },
];

export function FeaturedCollections() {
  const { featuredCollections, isLoading, error, fetchCollections } =
    useCollections();
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const { t } = useTranslation(lang, "common");
  const [collections, setCollections] = useState(mockCollections);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First try to fetch real collections
    fetchCollections();
    // Add a short timeout to prevent loading flash
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchCollections]);

  useEffect(() => {
    // If we got real collections from the service, use them
    if (featuredCollections && featuredCollections.length > 0) {
      setCollections(featuredCollections);
    }
  }, [featuredCollections]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && collections.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.slice(0, 3).map((collection) => (
          <Link
            key={collection.id}
            href={`/${lang}/collections/${collection.slug}`}
            className="group block"
          >
            <div className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
              <div className="relative h-80 w-full">
                <FallbackImage
                  src={collection.image}
                  alt={collection.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  fallbackSrc="/images/fallback-collection.svg"
                />
                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  {t("collections.featured")}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {collection.name}
                </h3>
                <p className="text-gray-600 mb-4">{collection.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {t("collections.itemCount", {
                      count: collection.products.length,
                    })}
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
