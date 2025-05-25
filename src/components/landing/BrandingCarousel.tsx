"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface BrandingCarouselProps {
  title: string;
  subtitle: string;
  isRTL: boolean;
}

export function BrandingCarousel({
  title,
  subtitle,
  isRTL,
}: BrandingCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // List of branding images with simpler names
  const brandingImages = [
    "/images/branding/branding1.jpg",
    "/images/branding/branding2.jpg",
    "/images/branding/branding3.jpg",
    "/images/branding/branding4.jpg",
    "/images/branding/branding5.jpg",
    "/images/branding/branding7.jpg",
    "/images/branding/branding8.jpg",
  ];

  // Handle next/previous image
  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === brandingImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? brandingImages.length - 1 : prevIndex - 1
    );
  };

  // Autoplay effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (autoplay) {
      interval = setInterval(() => {
        nextImage();
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoplay, currentIndex]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  return (
    <section
      id="branding"
      className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-nile-teal/10 text-nile-teal dark:bg-nile-teal/30 dark:text-white ring-1 ring-inset ring-nile-teal/20 mb-4"
          >
            Brand Identity
          </motion.span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Carousel */}
        <div
          className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Main Image */}
          <div className="aspect-[16/9] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={brandingImages[currentIndex]}
                  alt={`Reefq branding ${currentIndex + 1}`}
                  fill
                  className="object-cover"
                  priority={currentIndex === 0}
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite loop
                    target.src = "/images/fallback-collection.svg";
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <button
              onClick={prevImage}
              className="bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm transition-all"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-sm transition-all"
              aria-label="Next image"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-0 right-0">
            <div className="flex justify-center gap-2">
              {brandingImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentIndex === index
                      ? "w-6 bg-pharaonic-gold"
                      : "w-2 bg-white/70 hover:bg-white"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="mt-6 flex justify-center gap-2 overflow-x-auto pb-4 max-w-5xl mx-auto">
          {brandingImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative h-16 w-28 rounded-md overflow-hidden transition-all ${
                currentIndex === index
                  ? "ring-2 ring-pharaonic-gold ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback to a placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // Prevent infinite loop
                  target.src = "/images/fallback-collection.svg";
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BrandingCarousel;
