import './globals.css'
import { Playfair_Display } from 'next/font/google'
import { Metadata } from 'next'
import { I18nProvider } from '@/providers/I18nProvider'
import { AuthProvider } from '@/providers/AuthProvider'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: {
    default: 'ReefQ - 3D Jewelry Visualization & AR Try-On Platform',
    template: '%s | ReefQ'
  },
  description: 'Transform your jewelry business with stunning 3D visualization and AR try-on experiences. Boost sales with interactive product showcases.',
  keywords: ['jewelry visualization', '3D jewelry', 'AR try-on', 'jewelry ecommerce', '3D product viewer', 'jewelry technology'],
  authors: [{ name: 'ReefQ' }],
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
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://reefq.vercel.app',
    siteName: 'ReefQ',
    title: 'ReefQ - 3D Jewelry Visualization & AR Try-On Platform',
    description: 'Transform your jewelry business with stunning 3D visualization and AR try-on experiences. Boost sales with interactive product showcases.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ReefQ Platform Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReefQ - 3D Jewelry Visualization & AR Try-On Platform',
    description: 'Transform your jewelry business with stunning 3D visualization and AR try-on experiences.',
    images: ['/og-image.jpg'],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={playfair.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "ReefQ",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "499",
                "priceCurrency": "USD"
              },
              "description": "3D jewelry visualization and AR try-on platform for e-commerce businesses",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "150"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ReefQ",
              "url": "https://reefq.vercel.app",
              "logo": "https://reefq.vercel.app/logo.png",
              "sameAs": [
                "https://twitter.com/reefq",
                "https://linkedin.com/company/reefq"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-555-0123",
                "contactType": "customer service",
                "email": "support@reefq.com"
              }
            })
          }}
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
