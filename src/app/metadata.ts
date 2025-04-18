import { Metadata } from 'next';
import { Viewport } from 'next';

// Base metadata that can be extended by individual pages
export const baseMetadata: Metadata = {
  title: {
    template: '%s | ReefQ',
    default: 'ReefQ - Modern Reef Aquarium Management',
  },
  description: 'Modern reef aquarium management platform for hobbyists and professionals',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Base viewport settings
export const baseViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

// Helper function to merge custom metadata with base metadata
export function createMetadata(customMetadata: Partial<Metadata> = {}): Metadata {
  return {
    ...baseMetadata,
    ...customMetadata,
  };
}

// Helper function to merge custom viewport with base viewport
export function createViewport(customViewport: Partial<Viewport> = {}): Viewport {
  return {
    ...baseViewport,
    ...customViewport,
  };
} 