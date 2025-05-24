"use client";

import {
  ArrowPathIcon,
  ArrowRightIcon,
  DevicePhoneMobileIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { TFunction } from "i18next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

interface VirtualTryOnSectionProps {
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

export default function VirtualTryOnSection({
  t,
  isRTL,
}: VirtualTryOnSectionProps) {
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
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto">
        <div
          className={`flex flex-col lg:flex-row ${isRTL ? "lg:flex-row-reverse" : ""} items-center gap-12`}
        >
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t("virtualTryOn.title")}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {t("virtualTryOn.description")}
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-nile-teal/10 text-nile-teal">
                    <DevicePhoneMobileIcon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t("virtualTryOn.feature1.title")}
                  </h3>
                  <p className="mt-2 text-base text-gray-600">
                    {t("virtualTryOn.feature1.description")}
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-nile-teal/10 text-nile-teal">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-.244l.586-.886c.217-.433.131-.956-.21-1.298L13.5 6.11a6 6 0 00-3.815-1.872l-.917-.018z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t("virtualTryOn.feature2.title")}
                  </h3>
                  <p className="mt-2 text-base text-gray-600">
                    {t("virtualTryOn.feature2.description")}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <Link
                href="/try-and-fit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-nile-teal hover:bg-nile-teal-dark"
              >
                {t("virtualTryOn.cta")}
                <ArrowRightIcon
                  className={`ml-2 h-5 w-5 ${isRTL ? "transform rotate-180" : ""}`}
                />
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="lg:w-1/2 relative"
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl bg-gray-50 dark:bg-neutral-800">
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

                  {/* Metal type selector */}
                  <div className="p-2 flex items-center gap-1">
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

                  {/* Gem type selector */}
                  <div className="p-2 flex items-center gap-1">
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

              {/* Floating UI elements for decoration */}
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                  <p className="text-sm font-medium text-gray-900">
                    {t("virtualTryOn.livePreview")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
