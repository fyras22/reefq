import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ReefQ - 3D Jewelry Platform',
    short_name: 'ReefQ',
    description: 'ReefQ - Interactive 3D jewelry visualization and AR try-on platform',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0B7D77',
    orientation: 'portrait',
    scope: '/',
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
    screenshots: [
      {
        src: '/screenshots/desktop-1.jpg',
        sizes: '1280x800',
        type: 'image/jpeg'
      },
      {
        src: '/screenshots/desktop-2.jpg',
        sizes: '1280x800',
        type: 'image/jpeg'
      },
      {
        src: '/screenshots/mobile-1.jpg',
        sizes: '750x1334',
        type: 'image/jpeg'
      },
      {
        src: '/screenshots/mobile-2.jpg',
        sizes: '750x1334',
        type: 'image/jpeg'
      }
    ],
    shortcuts: [
      {
        name: 'Jewelry Catalog',
        short_name: 'Catalog',
        description: 'Browse our jewelry collections',
        url: '/jewelry',
        icons: [{ src: '/icons/catalog.png', sizes: '192x192' }]
      },
      {
        name: 'AR Try-On',
        short_name: 'Try-On',
        description: 'Try on jewelry using AR',
        url: '/try-and-fit',
        icons: [{ src: '/icons/ar.png', sizes: '192x192' }]
      },
      {
        name: 'Customize Jewelry',
        short_name: 'Customize',
        description: 'Create custom jewelry designs',
        url: '/customize',
        icons: [{ src: '/icons/customize.png', sizes: '192x192' }]
      }
    ],
    related_applications: [
      {
        platform: 'web',
        url: 'https://reefq.vercel.app'
      }
    ],
    prefer_related_applications: false,
    categories: ['shopping', 'lifestyle', 'entertainment']
  } as MetadataRoute.Manifest;
} 