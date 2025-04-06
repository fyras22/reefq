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
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AuthProvider } from '@/providers/AuthProvider'
import { Toaster } from '@/components/ui/toaster'
import { SpeedInsights } from "@vercel/speed-insights/next"

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

export const metadata: Metadata = {
  title: 'ReefQ Jewelry Demo',
  description: 'Interactive jewelry experience with 3D models and AR try-on capabilities',
  keywords: ['jewelry', '3D', 'AR', 'e-commerce', 'diamonds', 'luxury'],
  authors: [{ name: 'ReefQ Team' }],
  creator: 'ReefQ',
  publisher: 'ReefQ',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://reefq.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'fr': '/fr',
      'ar': '/ar',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://reefq.vercel.app',
    siteName: 'ReefQ',
    title: 'ReefQ Jewelry Demo',
    description: 'Interactive jewelry experience with 3D models and AR try-on capabilities',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ReefQ Jewelry Demo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReefQ Jewelry Demo',
    description: 'Interactive jewelry experience with 3D models and AR try-on capabilities',
    images: ['/images/twitter-image.jpg'],
    creator: '@reefq',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
  },
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
  return (
    <html lang={params.lang} className={`${playfair.variable} ${roboto.variable}`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0B7D77" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <AnalyticsProvider>
              <div className="flex flex-col min-h-screen">
                <Providers>
                  {/* WebVitals monitoring */}
                  <Suspense fallback={null}>
                    <WebVitalsTracker />
                  </Suspense>
                  
                  <StoreProvider>
                    <I18nProvider>
                      <LoadingProvider>
                        <div className="flex-grow">
                          {children}
                        </div>
                        <Toaster />
                      </LoadingProvider>
                    </I18nProvider>
                  </StoreProvider>
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
            </AnalyticsProvider>
          </AuthProvider>
        </ThemeProvider>
        
        {/* Vercel Analytics & Speed Insights */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
