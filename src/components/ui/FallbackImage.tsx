"use client";

import Image, { ImageProps } from "next/image";
import { useMemo, useState } from "react";

type FallbackImageProps = ImageProps & {
  fallbackSrc?: string;
};

/**
 * Enhanced Image component with fallback handling
 * If the image fails to load, it will display a fallback image or generated placeholder
 */
export default function FallbackImage({
  src,
  alt,
  fallbackSrc,
  ...props
}: FallbackImageProps) {
  const [error, setError] = useState(false);

  // If fallbackSrc is not provided, generate a placeholder based on the alt text
  const defaultFallback = useMemo(() => {
    if (fallbackSrc) return fallbackSrc;

    // For collections, use collection-specific fallbacks
    if (typeof src === "string" && src.includes("collections")) {
      return "/images/fallback-collection.jpg";
    }

    // For products, use product-specific fallbacks
    if (typeof src === "string" && src.includes("products")) {
      return "/images/fallback-product.jpg";
    }

    // Generate a data URI for a text-based SVG placeholder
    const text = alt?.substring(0, 15) || "Image";
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 600">
        <rect width="800" height="600" fill="#f8f9fa" />
        <text x="400" y="300" font-family="Arial" font-size="36" text-anchor="middle" fill="#6c757d">${text}</text>
      </svg>
    `;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
  }, [src, alt, fallbackSrc]);

  // If error, use the fallback
  const imageSrc = error ? defaultFallback : src;

  return (
    <Image {...props} src={imageSrc} alt={alt} onError={() => setError(true)} />
  );
}
