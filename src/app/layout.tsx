import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Roboto } from 'next/font/google'
import { Suspense } from 'react'
import WebVitalsMonitor from '@/components/layout/WebVitalsMonitor'
import Providers from '@/providers/Providers'
import { Analytics } from '@vercel/analytics/react'
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider'
import { I18nProvider } from '@/providers/I18nProvider'
import { LoadingProvider } from '@/providers/LoadingProvider'
import StoreProvider from '@/providers/StoreProvider'
import WebVitalsTracker from '@/components/analytics/WebVitalsTracker'
import NextAuthProvider from '@/components/providers/NextAuthProvider'
import { SpeedInsights } from '@vercel/speed-insights/next'
import ResourceHints from '@/components/optimization/ResourceHints'
import { headers } from 'next/headers'
import { optimizeFontLoading } from '@/lib/performance'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

// Get font URLs for preloading
const fontUrls = [
  '/fonts/roboto-v30-latin-regular.woff2',
  '/fonts/playfair-display-v30-latin-600.woff2'
]

// Preload essential fonts for better LCP
optimizeFontLoading(fontUrls)

export const metadata: Metadata = {
  title: {
    template: '%s | ReefQ Jewelry',
    default: 'ReefQ Jewelry - Premium 3D Jewelry Experience'
  },
  description: 'Interactive 3D jewelry visualization and customization platform with AR try-on capabilities',
  keywords: ['jewelry', '3D jewelry', 'AR jewelry', 'virtual try-on', 'jewelry customization'],
  authors: [{ name: 'ReefQ Team' }],
  creator: 'ReefQ',
  publisher: 'ReefQ',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://reefq.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'fr': '/fr',
      'ar': '/ar',
    },
  },
  openGraph: {
    title: 'ReefQ Jewelry - Premium 3D Jewelry Experience',
    description: 'Interactive 3D jewelry visualization and customization platform with AR try-on capabilities',
    url: 'https://reefq.com',
    siteName: 'ReefQ Jewelry',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ReefQ Jewelry visualization platform'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReefQ Jewelry - Premium 3D Jewelry Experience',
    description: 'Interactive 3D jewelry visualization and customization platform with AR try-on capabilities',
    images: ['/images/twitter-image.jpg']
  },
  robots: {
    index: true,
    follow: true
  },
  verification: {
    google: 'your-google-site-verification',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  // Get user country for geo-specific optimizations 
  const headersList = headers()
  const country = headersList.get('x-vercel-ip-country') || 'US'
  
  return (
    <html lang={params.lang} className={`${playfair.variable} ${roboto.variable}`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0B7D77" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <ResourceHints />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased font-sans">
        <div className="flex flex-col min-h-screen">
          <Providers>
            <NextAuthProvider>
            <StoreProvider>
              <I18nProvider>
                <LoadingProvider>
                    <AnalyticsProvider>
                  {children}
                      <Analytics />
                    </AnalyticsProvider>
                </LoadingProvider>
              </I18nProvider>
            </StoreProvider>
            </NextAuthProvider>
          </Providers>
          
          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 py-8">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <p className="text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} ReefQ. All rights reserved.
                  </p>
                </div>
                <div className="flex space-x-6">
                  <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                    Terms
                  </a>
                  <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                    Privacy
                  </a>
                  <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
        <SpeedInsights />
      </body>
    </html>
  )
}
