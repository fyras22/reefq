"use client";

import {
  ArrowPathIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { TFunction } from "i18next";
import dynamic from "next/dynamic";
import { useState } from "react";

interface HeroSectionProps {
  t: TFunction;
  isRTL: boolean;
}

// Dynamically import the JewelryViewer with no SSR
const DynamicJewelryViewer = dynamic(
  () =>
    import("@/components/JewelryViewer").then((mod) => ({
      default: mod.JewelryViewer,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Loading 3D Viewer...
          </div>
          <div className="mt-2 h-2 w-32 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div className="h-full w-1/3 animate-pulse bg-nile-teal" />
          </div>
        </div>
      </div>
    ),
  }
);

export function HeroSection({ t, isRTL }: HeroSectionProps) {
  // State for jewelry viewer options
  const [metalType, setMetalType] = useState<
    "gold" | "silver" | "platinum" | "rose-gold"
  >("gold");
  const [gemType, setGemType] = useState<
    "diamond" | "ruby" | "sapphire" | "emerald"
  >("emerald");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showZoomSlider, setShowZoomSlider] = useState(false);

  // Function to reset view
  const resetView = () => {
    setMetalType("gold");
    setGemType("emerald");
    setZoomLevel(1);
  };

  // Function to handle zoom level change
  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoomLevel(parseFloat(e.target.value));
  };

  return (
    <section className="relative overflow-hidden pt-20 pb-16 sm:pt-32 sm:pb-24 lg:pb-32">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-1/4 top-0 -mt-16 opacity-30 blur-3xl">
          <svg
            width="400"
            height="400"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#C4A265"
              d="M33.5,-52.6C46.6,-44.9,62.1,-41.1,71.9,-31C81.7,-20.8,85.7,-4.3,79.7,8.5C73.6,21.3,57.5,30.5,44.1,41.5C30.8,52.6,20.3,65.6,5.6,70.9C-9.1,76.2,-27.8,73.8,-42.5,64.6C-57.2,55.5,-67.8,39.7,-71.8,23.5C-75.7,7.3,-73,-9.3,-64.9,-21.4C-56.8,-33.5,-43.4,-41.1,-31.1,-49.3C-18.9,-57.4,-7.8,-66.2,1.5,-68.3C10.9,-70.4,20.4,-60.3,33.5,-52.6Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
        <div className="absolute left-1/4 bottom-0 opacity-20 blur-3xl">
          <svg
            width="400"
            height="400"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#2A5B5E"
              d="M42.7,-76.5C56.9,-69.2,71.2,-60.4,79.3,-47.5C87.4,-34.6,89.4,-17.3,88.9,-0.3C88.3,16.8,85.3,33.5,77.2,47.6C69.1,61.7,55.8,73.1,40.6,79.9C25.4,86.8,8.2,89.1,-9.2,87.7C-26.6,86.4,-44.1,81.4,-58.4,71.5C-72.7,61.5,-83.7,46.5,-88.2,30C-92.6,13.4,-90.5,-4.7,-85.2,-21.7C-79.9,-38.7,-71.4,-54.7,-58.7,-62.8C-46,-70.9,-29.2,-71.2,-13.5,-72.9C2.1,-74.5,17.1,-77.5,31.1,-77.6C45.1,-77.7,57.2,-75,70.5,-67.9Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
      </div>

      <div className="container mx-auto">
        <div
          className={`flex flex-col lg:flex-row ${isRTL ? "lg:flex-row-reverse" : ""} items-center gap-x-8 gap-y-16`}
        >
          {/* Hero Text Content */}
          <div className="lg:w-1/2 lg:flex-auto text-center lg:text-left">
            {/* Animated greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-white text-nile-teal dark:bg-neutral-800 dark:text-[--color-primary-teal] ring-1 ring-inset ring-nile-teal/20 dark:ring-[--color-primary-teal]/20 shadow-sm">
                {t("hero.badge")}
              </span>
            </motion.div>

            {/* Animated heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl"
            >
              <span className="block mb-2">{t("home.hero.title1")}</span>
              <span className="block text-pharaonic-gold">
                {t("home.hero.title2")}
              </span>
            </motion.h1>

            {/* Animated description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0"
            >
              {t("home.hero.description")}
            </motion.p>

            {/* Animated CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
            >
              <a
                href="#virtual-try-on"
                className="rounded-md bg-nile-teal px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-nile-teal/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nile-teal transition-all duration-200 flex items-center justify-center gap-2"
              >
                {t("buttons.tryAndFit")}
                <ArrowRightIcon className="h-4 w-4" />
              </a>
              <a
                href="#features"
                className="rounded-md bg-white dark:bg-neutral-800 px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all duration-200 flex items-center justify-center"
              >
                {t("buttons.exploreJewelry")}
              </a>
            </motion.div>

            {/* Animated Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4"
            >
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-green-100 p-1">
                  <svg
                    className="h-4 w-4 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {isRTL ? "جودة عالية مضمونة" : "High Quality Guaranteed"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-green-100 p-1">
                  <svg
                    className="h-4 w-4 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {isRTL ? "ضمان الرضا 100٪" : "100% Satisfaction Guarantee"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-green-100 p-1">
                  <svg
                    className="h-4 w-4 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {isRTL ? "شحن مجاني" : "Free Shipping"}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Hero 3D Jewelry Viewer */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2 relative"
          >
            <div className="aspect-[4/3] w-full rounded-2xl bg-gray-50 dark:bg-neutral-800 object-cover lg:aspect-[1/1] lg:h-[34rem] overflow-hidden shadow-xl">
              <div className="absolute inset-0">
                <DynamicJewelryViewer
                  metalType={metalType}
                  gemType={gemType}
                  size={zoomLevel}
                />
              </div>

              {/* Interactive Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-20">
                <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full p-1 flex items-center gap-1 shadow-lg">
                  {/* Zoom control */}
                  <div className="relative">
                    <button
                      onClick={() => setShowZoomSlider(!showZoomSlider)}
                      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors relative"
                      aria-label="Zoom controls"
                      title="Zoom controls"
                    >
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      <span className="absolute -top-2 -right-2 bg-nile-teal text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {Math.round(zoomLevel * 10) / 10}x
                      </span>
                    </button>

                    {/* Zoom slider popup */}
                    {showZoomSlider && (
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-3 min-w-[200px]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            0.5x
                          </span>
                          <span className="text-sm font-medium text-nile-teal">
                            {zoomLevel.toFixed(1)}x
                          </span>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            2.0x
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={zoomLevel}
                          onChange={handleZoomChange}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-nile-teal"
                        />
                      </div>
                    )}
                  </div>

                  {/* Metal type selector - Hide on small screens */}
                  <div className="hidden sm:flex p-2 items-center gap-1">
                    <SwatchIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    <select
                      value={metalType}
                      onChange={(e) =>
                        setMetalType(
                          e.target.value as
                            | "gold"
                            | "silver"
                            | "platinum"
                            | "rose-gold"
                        )
                      }
                      className="bg-transparent border-none text-sm text-gray-700 dark:text-gray-300 focus:ring-0 focus:outline-none p-0"
                      aria-label="Select metal type"
                    >
                      <option value="gold">Gold</option>
                      <option value="silver">Silver</option>
                      <option value="platinum">Platinum</option>
                      <option value="rose-gold">Rose Gold</option>
                    </select>
                  </div>

                  {/* Gem type selector - Hide on small screens */}
                  <div className="hidden sm:flex p-2 items-center gap-1">
                    <SparklesIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    <select
                      value={gemType}
                      onChange={(e) =>
                        setGemType(
                          e.target.value as
                            | "diamond"
                            | "ruby"
                            | "sapphire"
                            | "emerald"
                        )
                      }
                      className="bg-transparent border-none text-sm text-gray-700 dark:text-gray-300 focus:ring-0 focus:outline-none p-0"
                      aria-label="Select gem type"
                    >
                      <option value="diamond">Diamond</option>
                      <option value="ruby">Ruby</option>
                      <option value="sapphire">Sapphire</option>
                      <option value="emerald">Emerald</option>
                    </select>
                  </div>

                  {/* Reset view */}
                  <button
                    onClick={resetView}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                    aria-label="Reset view"
                    title="Reset view"
                  >
                    <ArrowPathIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>
              </div>

              {/* Floating badges - Hide on small screens, show on medium and up */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className={`hidden md:flex absolute -top-6 ${isRTL ? "right-10" : "left-10"} bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-3 items-center gap-3 z-10`}
              >
                <div className="rounded-full bg-nile-teal/10 p-2">
                  <svg
                    className="h-6 w-6 text-nile-teal"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {isRTL ? "عرض ثلاثي الأبعاد" : "3D View"}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {isRTL ? "تجربة تفاعلية" : "Interactive Experience"}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className={`hidden md:flex absolute -bottom-6 ${isRTL ? "left-10" : "right-10"} bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-3 items-center gap-3 z-10`}
              >
                <div className="rounded-full bg-pharaonic-gold/10 p-2">
                  <svg
                    className="h-6 w-6 text-pharaonic-gold"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {isRTL ? "تخصيص متطور" : "Advanced Customization"}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {isRTL ? "خيارات متعددة" : "Multiple Options"}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
