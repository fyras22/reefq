"use client";

import { motion } from "framer-motion";
import { TFunction } from "i18next";
import Image from "next/image";
import Link from "next/link";

interface LandingCollectionsSectionProps {
  t: TFunction;
  isRTL: boolean;
}

// Fake collection data with placeholder images
const collections = [
  {
    id: "royal-heritage",
    name: "Royal Heritage",
    description: "Elegant jewelry inspired by ancient royal designs",
    image:
      "https://placehold.co/800x600/goldenrod/white?text=Royal+Heritage+Collection",
    itemCount: 24,
    slug: "royal-heritage",
    featured: true,
  },
  {
    id: "nature-inspired",
    name: "Nature Inspired",
    description:
      "Beautiful pieces that capture the essence of natural elements",
    image:
      "https://placehold.co/800x600/2A5B5E/white?text=Nature+Inspired+Collection",
    itemCount: 18,
    slug: "nature-inspired",
    featured: false,
  },
  {
    id: "modern-minimalist",
    name: "Modern Minimalist",
    description: "Clean, contemporary designs for the modern individual",
    image:
      "https://placehold.co/800x600/404040/white?text=Modern+Minimalist+Collection",
    itemCount: 15,
    slug: "modern-minimalist",
    featured: false,
  },
  {
    id: "vintage-elegance",
    name: "Vintage Elegance",
    description: "Timeless pieces inspired by classic jewelry designs",
    image:
      "https://placehold.co/800x600/966919/white?text=Vintage+Elegance+Collection",
    itemCount: 21,
    slug: "vintage-elegance",
    featured: true,
  },
];

export function LandingCollectionsSection({
  t,
  isRTL,
}: LandingCollectionsSectionProps) {
  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for individual items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section
      id="collections"
      className="py-20 bg-skin-soft dark:bg-neutral-800/20"
    >
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("collections.title")}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t("collections.description")}
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {collections.map((collection) => (
            <motion.div
              key={collection.id}
              className="group"
              variants={itemVariants}
            >
              <Link
                href={`/${isRTL ? "ar" : "en"}/collections/${collection.slug}`}
              >
                <div className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                  <div className="relative h-80 w-full">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                    {collection.featured && (
                      <div className="absolute top-4 right-4 bg-nile-teal text-white px-3 py-1 rounded-full text-sm font-medium">
                        {t("collections.featured")}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-nile-teal transition-colors">
                      {collection.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {collection.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t("collections.itemCount", {
                          count: collection.itemCount,
                        })}
                      </span>
                      <span className="text-nile-teal font-medium group-hover:underline">
                        {t("collections.viewCollection")} →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Link
            href={`/${isRTL ? "ar" : "en"}/collections`}
            className="inline-block bg-nile-teal text-white px-6 py-3 rounded-lg hover:bg-nile-teal/90 transition-colors"
          >
            {t("collections.viewAllCollections")}
          </Link>
        </div>
      </div>
    </section>
  );
}
