"use client";

import { useTranslation } from "@/app/i18n-client";
import { FeaturedCollections } from "@/components/FeaturedCollections";
import { JewelryViewer } from "@/components/JewelryViewer";
import { CoreFeaturesSection } from "@/components/landing/CoreFeaturesSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import LandingSidebar from "@/components/layout/LandingSidebar";
import AdvancedSEO from "@/components/seo/AdvancedSEO";
import { Button, Card, FallbackImage } from "@/components/ui";
import {
  BookOpenIcon,
  ChartBarIcon,
  CubeIcon,
  SparklesIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";

// Lazy load non-critical sections
const PricingSection = lazy(() =>
  import("@/components/landing/PricingSection").then((mod) => ({
    default: mod.PricingSection,
  }))
);
const VirtualTryOnSection = lazy(
  () => import("@/components/landing/VirtualTryOnSection")
);
const PerformanceSection = lazy(
  () => import("@/components/landing/PerformanceSection")
);
const ComparisonToolSection = lazy(
  () => import("@/components/landing/ComparisonToolSection")
);
const FaqSection = lazy(() => import("@/components/landing/FaqSection"));

// Add helper function for smooth scrolling
const scrollToSection = (
  e: React.MouseEvent<HTMLAnchorElement>,
  id: string
) => {
  e.preventDefault();
  const element = document.getElementById(id);
  if (element) {
    const headerOffset = 80; // Account for header height
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
      <button
        className="flex w-full items-center justify-between py-3 text-left text-lg font-medium leading-7 text-gray-900 dark:text-white hover:text-nile-teal dark:hover:text-[--color-primary-teal] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <svg
          className={`h-5 w-5 text-pharaonic-gold dark:text-[--color-primary-gold] transition-transform ${isOpen ? "rotate-180 transform" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
        transition={{ duration: 0.3 }}
      >
        <div className="py-3 text-base text-gray-600 dark:text-gray-300">
          {answer}
        </div>
      </motion.div>
    </div>
  );
}

interface ClientHomePageProps {
  lang: string;
}

export default function ClientHomePage({ lang }: ClientHomePageProps) {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize language and load translations
  useEffect(() => {
    const initializeLanguage = async () => {
      if (lang) {
        // Use i18n change language directly instead of loadTranslations
        i18n.changeLanguage(lang);
      } else {
        // Detect language from browser or user preferences
        const detectedLang =
          (typeof window !== "undefined" &&
            window.navigator.language?.split("-")[0]) ||
          "en";

        i18n.changeLanguage(detectedLang);
      }

      // Set RTL status
      setIsRTL(["ar"].includes(i18n.language));
      setIsLoading(false);
    };

    initializeLanguage();
  }, [lang, i18n]);

  // Add scroll event listener for header and section highlighting
  useEffect(() => {
    const handleScroll = () => {
      // Handle header transformation
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }

      // Handle section highlighting
      const sections = [
        "hero",
        "features",
        "collections",
        "core-features",
        "how-it-works",
        "testimonials",
        "pricing",
        "virtual-try-on",
        "performance",
        "jewelry-knowledge",
        "comparison",
        "faq",
      ];

      // Find the current active section
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (current && current !== activeSection) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled, activeSection]);

  // Use useMemo to prevent recreation of these arrays on every render
  const features = useMemo(
    () => [
      {
        name: t("features.3dVisualization.name"),
        description: t("features.3dVisualization.description"),
        icon: CubeIcon,
        stat: t("features.3dVisualization.stat"),
        statText: t("features.3dVisualization.statText"),
      },
      {
        name: t("features.arTryOn.name"),
        description: t("features.arTryOn.description"),
        icon: SparklesIcon,
        stat: t("features.arTryOn.stat"),
        statText: t("features.arTryOn.statText"),
      },
      {
        name: t("features.sizeOptimization.name"),
        description: t("features.sizeOptimization.description"),
        icon: ChartBarIcon,
        stat: t("features.sizeOptimization.stat"),
        statText: t("features.sizeOptimization.statText"),
      },
    ],
    [t]
  );

  // Extended features from the root page
  const extendedFeatures = useMemo(
    () => [
      {
        name: t("features.arTryOn.name"),
        description: t("features.arTryOn.description"),
        icon: SparklesIcon,
        stat: t("features.arTryOn.stat"),
        statText: t("features.arTryOn.statText"),
        image: "/images/features/virtual-try-on.jpg",
        url: "/virtual-try-on",
        color: "from-purple-50",
      },
      {
        name: t("header.customizeJewelry") || "Customize Jewelry",
        description:
          "Design and create your perfect jewelry piece with our advanced customization tools",
        icon: SparklesIcon,
        stat: "+1000",
        statText: "unique combinations",
        image: "/images/features/customize.jpg",
        url: "/customize",
        color: "from-blue-50",
        highlighted: true,
      },
      {
        name: t("collections.title") || "Collections",
        description:
          t("collections.description") ||
          "Explore our curated jewelry collections, designed to match your style and occasions.",
        icon: SquaresPlusIcon,
        stat: "+200",
        statText:
          t("collections.itemCount", { count: 200 }) || "200 unique pieces",
        image: "/images/features/collections.jpg",
        url: "/collections",
        color: "from-rose-50",
      },
      {
        name: t("header.knowledgeHub") || "Knowledge Hub",
        description:
          "Educational resources to help you understand jewelry craftsmanship and care",
        icon: BookOpenIcon,
        stat: "+50",
        statText: "jewelry guides and articles",
        image: "/images/features/knowledge-hub.jpg",
        url: "/knowledge",
        color: "from-violet-50",
      },
    ],
    [t]
  );

  // Generate testimonials array from translations
  const testimonials = useMemo(
    () => [
      {
        quote: t("testimonials.testimonial1.quote"),
        author: t("testimonials.testimonial1.author"),
        role: t("testimonials.testimonial1.role"),
        company: t("testimonials.testimonial1.company"),
      },
      {
        quote: t("testimonials.testimonial2.quote"),
        author: t("testimonials.testimonial2.author"),
        role: t("testimonials.testimonial2.role"),
        company: t("testimonials.testimonial2.company"),
      },
      {
        quote: t("testimonials.testimonial3.quote"),
        author: t("testimonials.testimonial3.author"),
        role: t("testimonials.testimonial3.role"),
        company: t("testimonials.testimonial3.company"),
      },
    ],
    [t]
  );

  // Generate faqs array from translations
  const faqs = useMemo(
    () => [
      {
        question: t("faq.question1.question"),
        answer: t("faq.question1.answer"),
      },
      {
        question: t("faq.question2.question"),
        answer: t("faq.question2.answer"),
      },
      {
        question: t("faq.question3.question"),
        answer: t("faq.question3.answer"),
      },
      {
        question: t("faq.question4.question"),
        answer: t("faq.question4.answer"),
      },
    ],
    [t]
  );

  // SEO data
  const seoData = useMemo(
    () => ({
      title: t("seo.title") || "Reefq - AI-Powered Jewelry Visualization",
      description:
        t("seo.description") ||
        "Revolutionizing jewelry retail with AI-powered 3D visualization. Try, customize, and perfect your jewelry online.",
      openGraph: {
        title: t("seo.ogTitle") || "Reefq - The Future of Jewelry Shopping",
        description:
          t("seo.ogDescription") ||
          "Experience jewelry like never before with our AI-powered 3D visualization.",
        type: "website",
        site_name: "Reefq",
        images: [
          {
            url: "/images/og-image.jpg",
            width: 1200,
            height: 630,
            alt: "Reefq Jewelry Visualization",
          },
        ],
      },
      twitter: {
        card: "summary_large_image" as const,
        site: "@reefq",
        image: "/images/twitter-image.jpg",
      },
    }),
    [t]
  );

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-nile-teal/20 border-t-nile-teal rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <AdvancedSEO
        title={seoData.title}
        description={seoData.description}
        openGraph={seoData.openGraph}
        twitter={seoData.twitter}
      />

      {/* Mobile Sidebar */}
      <LandingSidebar
        isRTL={isRTL}
        activeSection={activeSection}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <AnimatePresence>
        <motion.main
          className={`bg-skin-base ${isRTL ? "rtl" : "ltr"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Arabic decorative elements - only visible in RTL mode */}
          {isRTL && (
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-5">
              <div className="absolute top-0 left-0 w-64 h-64 -translate-x-1/3 -translate-y-1/3">
                <svg
                  viewBox="0 0 200 200"
                  className="text-neutral-700 h-full w-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="currentColor"
                    d="M40.9,-68.5C51.8,-62.1,58.3,-47.3,61.7,-33.1C65.1,-19,65.3,-5.5,61,5.4C56.7,16.2,47.8,24.3,39.8,33C31.8,41.7,24.6,51,15.2,56.4C5.8,61.8,-5.8,63.3,-17.2,61.5C-28.6,59.7,-39.7,54.5,-48.8,46.1C-57.9,37.7,-64.9,26,-64.8,14.4C-64.7,2.9,-57.5,-8.5,-52.4,-20.7C-47.4,-32.9,-44.5,-45.9,-36.1,-53.7C-27.7,-61.5,-13.9,-64,-0.1,-63.9C13.7,-63.8,30,-74.9,40.9,-68.5Z"
                    transform="translate(100 100)"
                  />
                </svg>
              </div>
              <div className="absolute bottom-0 right-0 w-96 h-96 translate-x-1/3 translate-y-1/3">
                <svg
                  viewBox="0 0 200 200"
                  className="text-neutral-700 h-full w-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="currentColor"
                    d="M34.1,-58.5C45.2,-51.9,55.7,-44.5,62.8,-33.7C69.9,-22.9,73.5,-8.6,70.8,4.1C68.1,16.8,59,27.9,49.9,38.1C40.8,48.2,31.6,57.4,20.3,62.3C9,67.2,-4.4,67.8,-16.8,64.3C-29.1,60.8,-40.3,53.2,-49.1,43.1C-57.9,33,-64.3,20.4,-66.7,6.7C-69,-7,-67.4,-21.7,-61.1,-33.7C-54.8,-45.7,-43.9,-54.9,-31.9,-61C-19.9,-67.1,-7,-70,3.4,-75.5C13.8,-81,23,-65.1,34.1,-58.5Z"
                    transform="translate(100 100)"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Header */}
          <LandingHeader
            t={t}
            isRTL={isRTL}
            scrolled={scrolled}
            activeSection={activeSection}
          />

          {/* Hero Section */}
          <HeroSection t={t} isRTL={isRTL} />

          {/* Featured Collections Section */}
          <section
            id="collections"
            className="py-20 bg-skin-soft dark:bg-neutral-800/20"
          >
            <div className="container mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t("collections.title")}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  {t("collections.description")}
                </p>
              </div>
              <FeaturedCollections />
            </div>
          </section>

          {/* Extended Features Section */}
          <section id="features" className="py-20 bg-white dark:bg-neutral-900">
            <div className="container mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t("features.title")}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  {t("features.description")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {extendedFeatures.map((feature, index) => (
                  <Card
                    key={index}
                    className={`relative overflow-hidden group ${
                      feature.highlighted
                        ? "ring-2 ring-nile-teal dark:ring-[--color-primary-teal]"
                        : ""
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-b ${feature.color} dark:from-neutral-800 dark:to-neutral-900 opacity-30 group-hover:opacity-50 transition-opacity`}
                    />
                    <div className="relative p-6 flex flex-col h-full">
                      {feature.highlighted && (
                        <div className="absolute top-0 right-0 bg-nile-teal dark:bg-[--color-primary-teal] text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
                          {t("features.popular")}
                        </div>
                      )}

                      <div className="mb-6">
                        <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg inline-block shadow-sm">
                          <feature.icon className="h-8 w-8 text-nile-teal dark:text-[--color-primary-teal]" />
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        {feature.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                        {feature.description}
                      </p>

                      {feature.image && (
                        <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                          <FallbackImage
                            src={feature.image}
                            alt={feature.name}
                            fill
                            className="object-cover"
                            fallbackSrc="/images/fallback-collection.svg"
                          />
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-2">
                        <div>
                          <p className="text-2xl font-bold text-nile-teal dark:text-[--color-primary-teal]">
                            {feature.stat}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {feature.statText}
                          </p>
                        </div>

                        <Link
                          href={feature.url || "#"}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-nile-teal dark:bg-[--color-primary-teal] hover:bg-nile-teal-dark dark:hover:bg-[--color-primary-teal]/90 transition-colors"
                        >
                          {t("buttons.explore")}
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* 3D Jewelry Viewer Section */}
          <section
            id="jewelry-viewer"
            className="py-20 bg-skin-soft dark:bg-neutral-800/20 overflow-hidden"
          >
            <div className="container mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t("jewelryViewer.title")}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  {t("jewelryViewer.description")}
                </p>
              </div>

              <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="lg:w-1/2">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {t("jewelryViewer.interactiveTitle")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {t("jewelryViewer.interactiveDescription")}
                  </p>

                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-nile-teal dark:bg-[--color-primary-teal] flex items-center justify-center text-white">
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="ml-3 text-gray-600 dark:text-gray-300">
                          {t(`jewelryViewer.benefit${i}`)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <Button className="bg-nile-teal dark:bg-[--color-primary-teal] text-white">
                      {t("buttons.tryItNow")}
                    </Button>
                  </div>
                </div>

                <div className="lg:w-2/5 w-full max-w-md h-[350px] bg-white dark:bg-neutral-800 rounded-lg shadow-xl overflow-hidden p-0 mx-auto">
                  <JewelryViewer />
                </div>
              </div>
            </div>
          </section>

          {/* Core Features */}
          <CoreFeaturesSection t={t} features={features} isRTL={isRTL} />

          {/* How It Works Section */}
          <HowItWorksSection t={t} isRTL={isRTL} />

          {/* Testimonials Section */}
          <TestimonialsSection
            t={t}
            testimonials={testimonials}
            isRTL={isRTL}
          />

          {/* Pricing Section */}
          <Suspense fallback={<div>Loading...</div>}>
            <PricingSection t={t} isRTL={isRTL} />
          </Suspense>

          {/* Virtual Try-On Section */}
          <Suspense fallback={<div>Loading...</div>}>
            <VirtualTryOnSection t={t} isRTL={isRTL} />
          </Suspense>

          {/* Performance Section */}
          <Suspense fallback={<div>Loading...</div>}>
            <PerformanceSection t={t} />
          </Suspense>

          {/* Comparison Tool Section */}
          <Suspense fallback={<div>Loading...</div>}>
            <ComparisonToolSection t={t} isRTL={isRTL} />
          </Suspense>

          {/* FAQ Section (with custom FaqItem component) */}
          <section id="faq" className="py-20 bg-white dark:bg-neutral-900">
            <div className="container mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t("faq.title")}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  {t("faq.description")}
                </p>
              </div>

              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <FaqItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {t("faq.moreQuestions")}
                </p>
                <Link
                  href={`/${lang}/contact`}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-nile-teal hover:bg-nile-teal-dark dark:bg-[--color-primary-teal] dark:hover:bg-[--color-primary-teal]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-teal dark:focus:ring-[--color-primary-teal] transition-colors"
                >
                  {t("buttons.contactUs")}
                </Link>
              </div>
            </div>
          </section>

          {/* Footer */}
          <LandingFooter t={t} isRTL={isRTL} />
        </motion.main>
      </AnimatePresence>
    </>
  );
}
