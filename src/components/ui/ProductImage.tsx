import Image from "next/image";
import { useEffect, useState } from "react";

interface ProductImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  productId?: string;
}

export function ProductImage({
  src,
  alt,
  fill = true,
  className = "",
  productId,
}: ProductImageProps) {
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const [isSvgPlaceholder, setIsSvgPlaceholder] = useState(false);

  // Jewelry-themed colors for placeholder backgrounds
  const placeholderColors = [
    "#FFD700", // Gold
    "#C0C0C0", // Silver
    "#E5E4E2", // Platinum
    "#B9F2FF", // Diamond blue
    "#E0115F", // Ruby red
    "#50C878", // Emerald green
    "#0F52BA", // Sapphire blue
    "#FFFFF0", // Ivory
    "#E6E6FA", // Lavender
    "#800080", // Purple
    "#FFC0CB", // Pink
    "#40E0D0", // Turquoise
  ];

  // Function to generate SVG placeholder for jewelry
  const generatePlaceholderSvg = () => {
    const hashCode = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return hash;
    };

    // Use product ID or alt text to consistently select the same color for the same product
    const seed = productId || alt;
    const colorIndex = Math.abs(hashCode(seed)) % placeholderColors.length;
    const bgColor = placeholderColors[colorIndex];

    // Calculate a contrasting text color (simple method)
    const isLight = (color: string) => {
      // Convert hex to RGB and calculate luminance
      const r = parseInt(color.substr(1, 2), 16);
      const g = parseInt(color.substr(3, 2), 16);
      const b = parseInt(color.substr(5, 2), 16);
      return r * 0.299 + g * 0.587 + b * 0.114 > 186;
    };
    const textColor = isLight(bgColor) ? "#333333" : "#FFFFFF";

    // Extract product name initials for the placeholder
    const getInitials = (name: string) => {
      return name
        .split(/\s+/)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    };
    const initials = getInitials(alt);

    // Create the SVG data URL
    const svgContent = `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${bgColor}" />
        <circle cx="200" cy="180" r="70" fill="rgba(255,255,255,0.2)" />
        <text x="200" y="200" font-family="Arial" font-size="60" text-anchor="middle" fill="${textColor}" font-weight="bold">
          ${initials}
        </text>
        <text x="200" y="260" font-family="Arial" font-size="18" text-anchor="middle" fill="${textColor}">
          ${alt.length > 20 ? alt.substring(0, 20) + "..." : alt}
        </text>
        <text x="200" y="290" font-family="Arial" font-size="14" text-anchor="middle" fill="${textColor}">
          Chichkhane Collection
        </text>
      </svg>
    `;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent.trim())}`;
  };

  // Function to handle image loading errors
  const handleError = () => {
    console.log(`Image error for ${src}. Trying alternative paths...`);

    // Try different path formats
    if (src.includes("/images/products/") && !error) {
      // Try collections path instead of products
      const collectionsPath = src.replace(
        "/images/products/",
        "/images/collections/"
      );
      console.log("Trying collections path:", collectionsPath);
      setImageSrc(collectionsPath);
      setError(true);
    } else if (src.includes("/images/collections/") && !error) {
      // Try products path instead of collections
      const productsPath = src.replace(
        "/images/collections/",
        "/images/products/"
      );
      console.log("Trying products path:", productsPath);
      setImageSrc(productsPath);
      setError(true);
    } else {
      // If all paths failed, use a dynamically generated placeholder
      console.log("Using generated placeholder image");
      const placeholderSvg = generatePlaceholderSvg();
      setImageSrc(placeholderSvg);
      setIsSvgPlaceholder(true);
    }
  };

  // Check if the URL already contains the placeholder SVG name
  useEffect(() => {
    if (src.includes("placeholder") || !src) {
      const placeholderSvg = generatePlaceholderSvg();
      setImageSrc(placeholderSvg);
      setIsSvgPlaceholder(true);
    }
  }, [src]);

  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={className}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={handleError}
        unoptimized={isSvgPlaceholder} // Skip optimization for SVG data URLs
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={400}
      height={400}
      className={className}
      onError={handleError}
      unoptimized={isSvgPlaceholder} // Skip optimization for SVG data URLs
    />
  );
}
