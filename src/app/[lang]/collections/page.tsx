"use client";

import { useTranslation } from "@/app/i18n-client";
import { CollectionsHeader } from "@/components/ui/CollectionsHeader";
import { ProductImage } from "@/components/ui/ProductImage";
import { useCollections } from "@/services/collectionService";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function CollectionsPage() {
  const { collections, isLoading, error, fetchCollections } = useCollections();
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const { t } = useTranslation(lang, "common");

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  if (isLoading) {
    return (
      <>
        <CollectionsHeader />
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <CollectionsHeader />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-10">
            <h1 className="text-2xl font-bold mb-4">
              {t("collections.errorTitle")}
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => fetchCollections()}
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition"
            >
              {t("collections.tryAgain")}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CollectionsHeader />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">{t("collections.title")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("collections.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
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
                  {collection.featured && (
                    <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {t("collections.featured")}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {collection.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{collection.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {t("collections.itemCount", {
                        count: collection.products?.length || 0,
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
      </div>
    </>
  );
}
