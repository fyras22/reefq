// Helper utilities for image optimization

/**
 * Options for image optimization
 */
export interface ImageOptimizationOptions {
  /**
   * Whether to enable LQIP (Low Quality Image Placeholder)
   * @default true
   */
  useLqip?: boolean;
  
  /**
   * Whether to enable blur-up effect for smoother transitions
   * @default true
   */
  blurUp?: boolean;
  
  /**
   * Whether to lazy load the image
   * @default true
   */
  lazyLoad?: boolean;
  
  /**
   * Whether to preload the image if it's a critical resource
   * @default false
   */
  preload?: boolean;
  
  /**
   * Whether to enable progressive loading
   * @default true
   */
  progressive?: boolean;
  
  /**
   * Custom aspect ratio for placeholders, e.g. "16:9" or "4:3"
   */
  aspectRatio?: string;
  
  /**
   * Whether to add image dimensions to prevent CLS
   * @default true
   */
  preventCLS?: boolean;
  
  /**
   * Background color for the placeholder
   * @default "#f0f0f0"
   */
  placeholderColor?: string;
  
  /**
   * Priority loading for LCP images
   * @default false
   */
  priority?: boolean;
  
  /**
   * Whether to apply optimal image quality settings
   * @default true
   */
  optimizeQuality?: boolean;
}

/**
 * Creates a simple SVG placeholder for an image
 */
export function generatePlaceholder(
  width: number,
  height: number,
  color: string = '#f0f0f0',
  text?: string
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}" />
      ${text ? `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" fill="#ffffff">${text}</text>` : ''}
    </svg>
  `;
  
  // Use Buffer in Node.js environment, btoa in browser
  const base64 = typeof window === 'undefined'
    ? Buffer.from(svg).toString('base64')
    : btoa(svg);
  
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Get dimensions from an aspect ratio string like "16:9"
 */
export function getDimensionsFromAspectRatio(
  aspectRatio: string,
  baseWidth: number = 100
): { width: number; height: number } {
  const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);
  
  if (isNaN(widthRatio) || isNaN(heightRatio) || widthRatio <= 0 || heightRatio <= 0) {
    return { width: baseWidth, height: baseWidth };
  }
  
  const height = (baseWidth * heightRatio) / widthRatio;
  return { width: baseWidth, height };
}

/**
 * Generate srcSet based on the provided image URL
 */
export function generateSrcSet(
  src: string,
  widths: number[] = [640, 750, 828, 1080, 1200, 1920]
): string {
  // Skip if it's a base64 data URL
  if (src.startsWith('data:')) {
    return src;
  }
  
  // Function to append width to image filename
  // This assumes your API or CDN can handle image resizing with a width parameter
  const appendWidthToUrl = (url: string, width: number): string => {
    // This is a simplistic approach, a real implementation would depend on your image storage/CDN
    const urlObj = new URL(url, 'https://example.com');
    urlObj.searchParams.set('w', width.toString());
    return urlObj.pathname + urlObj.search;
  };
  
  return widths
    .map(width => `${appendWidthToUrl(src, width)} ${width}w`)
    .join(', ');
}

/**
 * Calculate the ideal image dimensions for a responsive layout
 */
export function getResponsiveDimensions(
  originalWidth: number,
  originalHeight: number,
  containerWidth: number
): { width: number, height: number } {
  const aspectRatio = originalWidth / originalHeight;
  const width = Math.min(originalWidth, containerWidth);
  const height = width / aspectRatio;
  
  return { width, height };
}

/**
 * Get optimal image quality based on device and connection
 * Note: This would normally detect network conditions, but for this example
 * we'll use a simple implementation
 */
export function getOptimalImageQuality(): number {
  // In a real app, you would determine this based on:
  // 1. Network connection quality (navigator.connection)
  // 2. Device pixel ratio (window.devicePixelRatio)
  // 3. Whether user has enabled data saver mode
  
  // Default to high quality
  return 85;
}

/**
 * Generate a simple gradient placeholder based on dominant colors
 */
export function generateGradientPlaceholder(
  dominantColors: string[] = ['#f0f0f0', '#e0e0e0'],
  width: number = 100,
  height: number = 100
): string {
  if (dominantColors.length <= 1) {
    return generatePlaceholder(
      width, 
      height, 
      dominantColors[0] || '#f0f0f0'
    );
  }
  
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          ${dominantColors.map((color, index) => {
            const offset = Math.round((index / (dominantColors.length - 1)) * 100);
            return `<stop offset="${offset}%" stop-color="${color}" />`;
          }).join('')}
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)" />
    </svg>
  `;
  
  const base64 = typeof window === 'undefined'
    ? Buffer.from(svg).toString('base64')
    : btoa(svg);
  
  return `data:image/svg+xml;base64,${base64}`;
} 