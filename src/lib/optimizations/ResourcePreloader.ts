'use client';

/**
 * Resource Types
 */
export type ResourceType = 'image' | 'font' | 'style' | 'script' | 'fetch' | 'document';

/**
 * Resource options
 */
export interface ResourceOptions {
  as?: ResourceType;
  type?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
  media?: string;
  priority?: 'high' | 'low' | 'auto';
  fetchPriority?: 'high' | 'low' | 'auto';
}

/**
 * Preloads a critical resource to improve page load performance
 * 
 * @param url The URL of the resource to preload
 * @param options Preload options
 */
export function preloadResource(url: string, options: ResourceOptions = {}): void {
  if (typeof window === 'undefined' || !document.head) return;
  
  const {
    as = 'image',
    type,
    crossOrigin,
    media,
    priority = 'auto',
    fetchPriority = 'auto',
  } = options;
  
  // Skip if resource is already being preloaded
  const existingLinks = document.head.querySelectorAll(`link[rel="preload"][href="${url}"]`);
  if (existingLinks.length > 0) return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = as;
  
  if (type) link.type = type;
  if (crossOrigin) link.crossOrigin = crossOrigin;
  if (media) link.media = media;
  
  // Set appropriate priorities
  if (fetchPriority !== 'auto') {
    (link as any).fetchPriority = fetchPriority;
  }
  
  // Add to document head
  document.head.appendChild(link);
}

/**
 * Preconnect to origin to establish early connection
 * 
 * @param url The origin URL to preconnect
 * @param crossOrigin Whether to include credentials
 */
export function preconnectToOrigin(url: string, crossOrigin?: boolean): void {
  if (typeof window === 'undefined' || !document.head) return;
  
  // Skip if already preconnecting
  const existingLinks = document.head.querySelectorAll(`link[rel="preconnect"][href="${url}"]`);
  if (existingLinks.length > 0) return;
  
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = url;
  
  if (crossOrigin) {
    link.crossOrigin = 'anonymous';
  }
  
  document.head.appendChild(link);
}

/**
 * Preload a set of LCP (Largest Contentful Paint) images
 * 
 * @param imagePaths Array of image paths for the LCP
 */
export function preloadLCPImages(imagePaths: string[]): void {
  imagePaths.forEach(path => {
    preloadResource(path, {
      as: 'image',
      fetchPriority: 'high',
    });
  });
}

/**
 * Preloads fonts to minimize layout shifts
 * 
 * @param fontUrls Array of font URLs to preload
 * @param fontType Font MIME type (default: font/woff2)
 */
export function preloadFonts(fontUrls: string[], fontType: string = 'font/woff2'): void {
  fontUrls.forEach(url => {
    preloadResource(url, {
      as: 'font',
      type: fontType,
      crossOrigin: 'anonymous',
    });
  });
}

/**
 * Prefetch a resource that will likely be needed for future navigation
 * Lower priority than preload, but useful for resources needed in the near future
 * 
 * @param url The URL to prefetch
 * @param options Prefetch options
 */
export function prefetchResource(url: string, options: Omit<ResourceOptions, 'priority'> = {}): void {
  if (typeof window === 'undefined' || !document.head) return;
  
  const {
    as,
    type,
    crossOrigin,
    media,
  } = options;
  
  // Skip if already prefetching
  const existingLinks = document.head.querySelectorAll(`link[rel="prefetch"][href="${url}"]`);
  if (existingLinks.length > 0) return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  
  if (as) link.as = as;
  if (type) link.type = type;
  if (crossOrigin) link.crossOrigin = crossOrigin;
  if (media) link.media = media;
  
  document.head.appendChild(link);
}

/**
 * Dynamically load an image for future use (invisible preload)
 * 
 * @param src Image source URL
 * @returns Promise that resolves when the image is loaded
 */
export function preloadImageInMemory(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Class to manage resource preloading with prioritization
 */
export class ResourcePreloader {
  private static instance: ResourcePreloader;
  private preloadedResources: Set<string> = new Set();
  private isInitialized: boolean = false;
  
  private constructor() {}
  
  /**
   * Get singleton instance
   */
  public static getInstance(): ResourcePreloader {
    if (!ResourcePreloader.instance) {
      ResourcePreloader.instance = new ResourcePreloader();
    }
    return ResourcePreloader.instance;
  }
  
  /**
   * Initialize preloader with critical resources
   */
  public initialize(options: {
    preconnectOrigins?: string[];
    criticalImages?: string[];
    criticalFonts?: string[];
    criticalScripts?: string[];
  }): void {
    if (this.isInitialized) return;
    
    const {
      preconnectOrigins = [],
      criticalImages = [],
      criticalFonts = [],
      criticalScripts = [],
    } = options;
    
    // Establish early connections
    preconnectOrigins.forEach(origin => {
      preconnectToOrigin(origin, true);
    });
    
    // Critical images (high priority)
    criticalImages.forEach(img => {
      this.preloadResource(img, { as: 'image', fetchPriority: 'high' });
    });
    
    // Critical fonts (high priority for text display)
    criticalFonts.forEach(font => {
      this.preloadResource(font, { 
        as: 'font', 
        type: 'font/woff2', 
        crossOrigin: 'anonymous',
        fetchPriority: 'high',
      });
    });
    
    // Critical scripts
    criticalScripts.forEach(script => {
      this.preloadResource(script, { as: 'script' });
    });
    
    this.isInitialized = true;
  }
  
  /**
   * Preload a resource and track it
   */
  public preloadResource(url: string, options: ResourceOptions = {}): void {
    if (this.preloadedResources.has(url)) return;
    
    preloadResource(url, options);
    this.preloadedResources.add(url);
  }
  
  /**
   * Prefetch a resource and track it
   */
  public prefetchResource(url: string, options: Omit<ResourceOptions, 'priority'> = {}): void {
    if (this.preloadedResources.has(url)) return;
    
    prefetchResource(url, options);
    this.preloadedResources.add(url);
  }
  
  /**
   * Check if a resource has been preloaded
   */
  public hasPreloadedResource(url: string): boolean {
    return this.preloadedResources.has(url);
  }
}

// Export singleton instance for easy use
export const resourcePreloader = ResourcePreloader.getInstance(); 