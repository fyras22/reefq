import { CollectionLoader } from "@/components/data/CollectionLoader";
import { LoadingSpinner } from "@/components/ui";
import { AuthProvider } from "@/providers/AuthProvider";
import { I18nProvider } from "@/providers/I18nProvider";
import { LoadingProvider } from "@/providers/LoadingProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

// Set up fonts
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// Generate a timestamp for cache busting
const timestamp = Date.now();

export const metadata: Metadata = {
  title: {
    default: "ReefQ - 3D Jewelry Visualization & AR Try-On Platform",
    template: "%s | ReefQ",
  },
  description:
    "Transform your jewelry business with stunning 3D visualization and AR try-on experiences. Boost sales with interactive product showcases.",
  keywords: [
    "jewelry visualization",
    "3D jewelry",
    "AR try-on",
    "jewelry ecommerce",
    "3D product viewer",
    "jewelry technology",
  ],
  authors: [{ name: "ReefQ" }],
  creator: "ReefQ",
  publisher: "ReefQ",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://reefq.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      {
        url: `/favicon.ico?v=${timestamp}`,
        sizes: "any",
        type: "image/x-icon",
      },
    ],
    apple: [
      {
        url: `/favicon.ico?v=${timestamp}`,
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://reefq.com",
    siteName: "ReefQ",
    title: "ReefQ - 3D Jewelry Visualization & AR Try-On Platform",
    description:
      "Transform your jewelry business with stunning 3D visualization and AR try-on experiences. Boost sales with interactive product showcases.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ReefQ Platform Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ReefQ - 3D Jewelry Visualization & AR Try-On Platform",
    description:
      "Transform your jewelry business with stunning 3D visualization and AR try-on experiences.",
    images: ["/og-image.jpg"],
    creator: "@reefq",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
  },
};

export default function RootLayout({
  children,
  params = { lang: "en" },
}: {
  children: React.ReactNode;
  params?: { lang: string };
}) {
  // Determine text direction based on language
  const dir = params.lang === "ar" ? "rtl" : "ltr";

  return (
    <html lang={params.lang} dir={dir} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "ReefQ",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "499",
                priceCurrency: "USD",
              },
              description:
                "3D jewelry visualization and AR try-on platform for e-commerce businesses",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "150",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ReefQ",
              url: "https://reefq.com",
              logo: "https://reefq.com/logo.png",
              sameAs: [
                "https://twitter.com/reefq",
                "https://linkedin.com/company/reefq",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-555-0123",
                contactType: "customer service",
                email: "support@reefq.com",
              },
            }),
          }}
        />
        {/* Debug script for theme troubleshooting */}
        <script src="/scripts/theme-debug.js" async></script>

        {/* Optimized mounting and hydration handling */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Mark initial loading state
                document.documentElement.classList.add('js-loading');
                
                // Theme detection for minimizing flash
                try {
                  const storedTheme = localStorage.getItem('theme');
                  if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.dataset.theme = 'dark';
                  } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.dataset.theme = 'light';
                  }
                } catch (e) {
                  // If localStorage is not available, default to light theme
                  document.documentElement.classList.add('light');
                  document.documentElement.dataset.theme = 'light';
                }
                
                function handleClientLoad() {
                  // Check if we're in a browser environment
                  if (typeof window === 'undefined') return;
                  
                  // Set a flag to indicate client-side JavaScript is available
                  document.documentElement.dataset.jsEnabled = 'true';
                  
                  // Handle page load completion
                  function completeLoading() {
                    // Force initial content visibility
                    document.body.style.visibility = 'visible';
                    document.body.style.opacity = '1';
                    
                    // Ensure home page content is visible without scrolling
                    const mainElement = document.querySelector('main');
                    if (mainElement && mainElement.classList.contains('home-layout')) {
                      // Add specific handling for home layout
                      const heroSection = mainElement.querySelector('section:first-of-type');
                      if (heroSection) {
                        heroSection.style.visibility = 'visible';
                        heroSection.style.opacity = '1';
                      }
                    }
                    
                    document.documentElement.classList.remove('js-loading');
                    document.documentElement.classList.add('js-loaded');
                    
                    const loadingElement = document.getElementById('app-loading');
                    if (loadingElement) {
                      loadingElement.style.opacity = '0';
                      setTimeout(function() {
                        if (loadingElement.parentNode) {
                          loadingElement.parentNode.removeChild(loadingElement);
                        }
                      }, 300);
                    }
                  }
                  
                  // Check if page is already loaded
                  if (document.readyState === 'complete') {
                    completeLoading();
                  } else {
                    // Wait for load event
                    window.addEventListener('load', completeLoading, { once: true });
                  }
                }
                
                // Execute client load handler immediately
                handleClientLoad();
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.className} antialiased bg-skin-base text-skin-base transition-colors duration-300`}
      >
        <noscript>
          <div className="fixed inset-0 bg-white dark:bg-neutral-900 z-50 flex items-center justify-center">
            <div className="text-center p-4">
              <h1 className="text-xl font-bold">JavaScript Required</h1>
              <p>Please enable JavaScript to use ReefQ.</p>
            </div>
          </div>
        </noscript>

        {/* Loading overlay with improved fade-out transition */}
        <div
          id="app-loading"
          className="fixed inset-0 bg-skin-base dark:bg-neutral-900 z-50 flex items-center justify-center transition-opacity duration-300"
        >
          <div className="text-center p-4">
            <LoadingSpinner size="xl" label="Loading ReefQ..." />
          </div>
        </div>

        <ThemeProvider>
          <AuthProvider>
            <I18nProvider>
              <LoadingProvider>
                <CollectionLoader />
                {children}
              </LoadingProvider>
            </I18nProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
