"use client";

import { useTranslation } from "@/app/i18n-client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";

export function CollectionsHeader() {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const { t } = useTranslation(lang, "common");

  return (
    <div className="relative w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 8 0 L 0 0 0 8"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Gold decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 -translate-y-1/4 translate-x-1/4 opacity-10">
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full fill-yellow-500"
        >
          <path
            d="M45.3,-51.2C58.9,-40.6,70.3,-25.3,73.8,-7.9C77.3,9.5,73,29,62.2,43.1C51.5,57.3,34.2,66.1,15.4,70.5C-3.4,74.8,-23.7,74.6,-39.3,65.9C-54.9,57.2,-65.8,40.1,-71.3,20.9C-76.9,1.8,-77.2,-19.5,-68.1,-34.8C-59.1,-50.1,-40.6,-59.4,-22.9,-67.1C-5.2,-74.7,11.8,-80.6,26.2,-74.4C40.7,-68.1,52.5,-49.8,45.3,-51.2Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 w-64 h-64 translate-y-1/3 -translate-x-1/3 opacity-10">
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full fill-yellow-400"
        >
          <path
            d="M38.5,-46C52.9,-34.4,69.7,-24.3,71.8,-11.9C74,0.5,61.6,15.3,49.7,25.5C37.8,35.7,26.3,41.3,12.6,48.6C-1.1,55.9,-17,64.9,-29.7,61.3C-42.3,57.6,-51.7,41.3,-56.7,24.5C-61.7,7.8,-62.3,-9.3,-55.8,-23C-49.2,-36.7,-35.4,-47,-21.5,-58.3C-7.6,-69.6,6.4,-81.9,18.1,-76.2C29.9,-70.6,39.6,-47.2,38.5,-46Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <nav className="flex mb-6 text-sm md:text-base">
          <Link
            href={`/${lang}`}
            className="text-gray-300 hover:text-white transition-colors"
          >
            {t("nav.home")}
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-white font-medium">
            {t("collections.title")}
          </span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500">
            {t("collections.headerTitle")}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
            {t("collections.headerDescription")}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href={`/${lang}/collections`}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t("collections.exploreAll")}
            </Link>
            <Link
              href={`/${lang}/try-and-fit`}
              className="bg-transparent border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 font-medium px-6 py-3 rounded-lg transition-all duration-300"
            >
              {t("collections.tryVirtually")}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
