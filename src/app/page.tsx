"use client";

import { useTranslation } from "@/app/i18n";
import { LandingFooter } from "@/components/landing/LandingFooter";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LandingSidebar from "@/components/layout/LandingSidebar";
import { Button, Card, ThemeSwitch } from "@/components/ui";
import {
  BookOpenIcon,
  CheckIcon,
  SparklesIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import { Bars3Icon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { JewelryViewer } from "../components/JewelryViewer";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
      <button
        className="flex w-full items-center justify-between py-3 text-left text-lg font-medium leading-7 text-gray-900 dark:text-white hover:text-nile-teal dark:hover:text-[--color-primary-teal] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <ChevronDownIcon
          className={`h-5 w-5 text-pharaonic-gold dark:text-[--color-primary-gold] transition-transform ${isOpen ? "rotate-180 transform" : ""}`}
        />
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

export default function Home() {
  const { t, i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const [pageLoaded, setPageLoaded] = useState(false);

  // Add scroll event listener and track active section
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }

      // Determine active section
      const sections = [
        "hero",
        "features",
        "how-it-works",
        "performance",
        "testimonials",
        "pricing",
        "faq",
      ];

      // Find the current section in view
      let currentSection = "hero";
      let minDistance = Infinity;

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const distance = Math.abs(rect.top);

          if (distance < minDistance) {
            minDistance = distance;
            currentSection = section;
          }
        }
      });

      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Set page as loaded
    setPageLoaded(true);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled, activeSection]);

  // Get current language
  const isRTL = i18n.dir() === "rtl";

  // Generate features array from translations
  const features = [
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
  ];

  // Generate testimonials array from translations
  const testimonials = [
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
  ];

  // Generate faqs array from translations
  const faqs = [
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
  ];

  return (
    <main
      className={`bg-skin-base dark:bg-neutral-900 home-layout ${isRTL ? "rtl" : "ltr"}`}
    >
      {/* Mobile Sidebar */}
      <LandingSidebar
        isRTL={isRTL}
        activeSection={activeSection}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Header with Logo - Fixed with scroll effect */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 w-full full-width ${
          scrolled
            ? "bg-white/95 backdrop-blur-sm shadow-md dark:bg-neutral-900/95 dark:shadow-neutral-800/30 py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className={`flex items-center justify-between w-full`}>
            {/* Logo - Left in LTR, Right in RTL */}
            <div
              className={`flex lg:flex-1 logo-container ${
                isRTL ? "order-3" : "order-1"
              }`}
            >
              <a
                href="#"
                className={`${
                  isRTL ? "ml-0 mr-4" : "mr-4 ml-0"
                } relative w-48 h-16 flex items-center`}
              >
                <Image
                  src="/logo.png"
                  alt={isRTL ? "رفق" : "ReefQ Logo"}
                  width={180}
                  height={60}
                  className="w-auto h-[200%]"
                  priority
                />
              </a>
            </div>

            {/* Desktop Navigation - Always in the middle */}
            <div className="hidden lg:flex lg:gap-x-8 desktop-nav order-2">
              <a
                href="#features"
                onClick={(e) => scrollToSection(e, "features")}
                className={`font-medium transition-colors ${
                  scrolled
                    ? "text-gray-700 hover:text-pharaonic-gold dark:text-gray-300 dark:hover:text-[--color-primary-gold]"
                    : "text-gray-800 hover:text-pharaonic-gold dark:text-gray-200 dark:hover:text-[--color-primary-gold]"
                }`}
              >
                {t("header.features")}
              </a>
              <a
                href="#testimonials"
                onClick={(e) => scrollToSection(e, "testimonials")}
                className={`font-medium transition-colors ${
                  scrolled
                    ? "text-gray-700 hover:text-pharaonic-gold dark:text-gray-300 dark:hover:text-[--color-primary-gold]"
                    : "text-gray-800 hover:text-pharaonic-gold dark:text-gray-200 dark:hover:text-[--color-primary-gold]"
                }`}
              >
                {t("header.testimonials")}
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => scrollToSection(e, "how-it-works")}
                className={`font-medium transition-colors ${
                  scrolled
                    ? "text-gray-700 hover:text-pharaonic-gold dark:text-gray-300 dark:hover:text-[--color-primary-gold]"
                    : "text-gray-800 hover:text-pharaonic-gold dark:text-gray-200 dark:hover:text-[--color-primary-gold]"
                }`}
              >
                {t("header.howItWorks")}
              </a>
              <a
                href="#pricing"
                onClick={(e) => scrollToSection(e, "pricing")}
                className={`font-medium transition-colors ${
                  scrolled
                    ? "text-gray-700 hover:text-pharaonic-gold dark:text-gray-300 dark:hover:text-[--color-primary-gold]"
                    : "text-gray-800 hover:text-pharaonic-gold dark:text-gray-200 dark:hover:text-[--color-primary-gold]"
                }`}
              >
                {t("header.pricing")}
              </a>
              <a
                href="#faq"
                onClick={(e) => scrollToSection(e, "faq")}
                className={`font-medium transition-colors ${
                  scrolled
                    ? "text-gray-700 hover:text-pharaonic-gold dark:text-gray-300 dark:hover:text-[--color-primary-gold]"
                    : "text-gray-800 hover:text-pharaonic-gold dark:text-gray-200 dark:hover:text-[--color-primary-gold]"
                }`}
              >
                {t("header.faq")}
              </a>
            </div>

            {/* Right side - Login/SignUp + Language Selector */}
            <div
              className={`lg:flex-1 flex items-center justify-end gap-x-6 ${
                isRTL ? "order-1" : "order-3"
              }`}
            >
              <div className="hidden lg:flex items-center gap-2">
                <ThemeSwitch className="border border-neutral-300 dark:border-neutral-700" />
                <LanguageSwitcher />
              </div>

              <a
                href="/auth/register"
                className="hidden lg:block lg:rounded-md lg:px-3 lg:py-2 lg:text-sm lg:font-semibold lg:leading-6 lg:text-white lg:shadow-sm lg:hover:bg-nile-teal/90 lg:bg-nile-teal dark:lg:bg-[--color-primary-teal] dark:lg:hover:bg-[--color-primary-teal]/90"
              >
                {t("header.getStarted") || "Get Started"}
              </a>

              {/* Mobile buttons */}
              <div className="flex items-center gap-2 lg:hidden">
                <ThemeSwitch className="border border-neutral-300 dark:border-neutral-700" />

                {/* Sidebar toggle button - for navigation */}
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open navigation sidebar"
                >
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section - Full height with proper spacing and visibility */}
      <section
        id="hero"
        className="relative w-full h-screen flex items-center justify-center bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 overflow-hidden opacity-100 visible"
      >
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-20">
            {/* Left column with text content */}
            <div className="lg:w-1/2 space-y-8 pt-4 lg:pt-12 text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white">
                <span className="text-brand-teal dark:text-brand-teal">
                  {isRTL ? "رفق" : "ReefQ"}
                </span>
                <br />
                <span className="text-nile-teal dark:text-nile-teal">
                  {t("home.hero.title1")}
                </span>
                <br />
                <span className="text-pharaonic-gold dark:text-pharaonic-gold">
                  {t("home.hero.title2")}
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0">
                {t("home.hero.description")}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  variant="default"
                  className="w-full sm:w-auto"
                  onClick={() => (window.location.href = "/try-and-fit")}
                >
                  {t("buttons.tryAndFit")}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => (window.location.href = "/products")}
                >
                  {t("buttons.exploreJewelry")}
                </Button>
              </div>
            </div>

            {/* Right column with 3D Jewelry Viewer */}
            <div className="lg:w-1/2 relative w-full h-[400px] lg:h-[500px] flex items-center justify-center">
              <JewelryViewer />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <div
        id="features"
        className="py-16 bg-gradient-to-b from-white to-slate-50 dark:from-neutral-900 dark:to-neutral-800"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-serif font-bold tracking-tight text-nile-teal dark:text-[--color-primary-teal] sm:text-4xl">
              {t("features.title")}
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              {t("features.subtitle")}
            </p>
          </div>

          {/* Featured image - decorative */}
          <div className="mt-10 mx-auto max-w-xl overflow-hidden rounded-xl shadow-lg dark:shadow-neutral-800/30">
            <div className="aspect-[16/9] w-full relative">
              <Image
                src="/inspiration/Q.jpg"
                alt="Featured jewelry showcase"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Feature cards with links to feature pages */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-neutral-800"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${feature.color} dark:opacity-10 opacity-30 z-0`}
                ></div>

                <div className="relative z-10 p-6">
                  <div className="flex items-center justify-center h-14 w-14 rounded-full bg-nile-teal text-white mb-4">
                    <feature.icon className="h-8 w-8" aria-hidden="true" />
                  </div>

                  <h3 className="text-xl font-semibold leading-8 text-gray-900 dark:text-white mb-2">
                    {feature.name}
                  </h3>
                  <p className="text-base leading-7 text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                    {feature.description}
                  </p>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-pharaonic-gold dark:text-[--color-primary-gold]">
                        {feature.stat}
                      </span>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {feature.statText}
                      </span>
                    </div>

                    <Link
                      href={feature.url}
                      className="inline-flex items-center px-3 py-1.5 rounded-md bg-nile-teal/10 dark:bg-[--color-primary-teal]/20 text-nile-teal dark:text-[--color-primary-teal] hover:bg-nile-teal/20 dark:hover:bg-[--color-primary-teal]/30 transition-colors text-sm font-medium"
                    >
                      Learn More
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>

                <div className="absolute top-0 right-0 h-24 w-24 opacity-10 rounded-bl-full bg-nile-teal"></div>
              </motion.div>
            ))}
          </div>

          {/* Explore all features button */}
          <div className="mt-12 text-center">
            <Link
              href="/features"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-nile-teal hover:bg-opacity-90 dark:bg-[--color-primary-teal] dark:hover:bg-opacity-90 transition-colors"
            >
              Explore All Features
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="py-16 bg-white dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-nile-teal dark:text-[--color-primary-teal]">
              {t("howItWorks.title")}
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              {t("howItWorks.subtitle")}
            </p>
          </div>

          <div className="relative">
            {/* Timeline connector - hidden on mobile */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-auto h-[calc(100%-80px)] w-0.5 bg-pharaonic-gold/30 dark:bg-[--color-primary-gold]/30 -translate-x-1/2"></div>

            <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
              {/* Step 1 */}
              <motion.div
                className={`relative flex flex-col items-center ${isRTL ? "md:items-start" : "md:items-end md:text-right"}`}
                initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className={`flex ${isRTL ? "" : "md:justify-end"}`}>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-nile-teal dark:bg-[--color-primary-teal] text-white text-lg font-bold md:relative md:z-10 shadow-md">
                    1
                  </div>
                </div>
                <div
                  className={`mt-3 text-center ${isRTL ? "md:text-left md:pl-12" : "md:text-right md:pr-12"}`}
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t("howItWorks.step1.title")}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {t("howItWorks.step1.description")}
                  </p>
                </div>
              </motion.div>

              {/* Empty cell */}
              <div className="hidden md:block"></div>

              {/* Empty cell */}
              <div className="hidden md:block"></div>

              {/* Step 2 */}
              <motion.div
                className={`relative flex flex-col items-center ${isRTL ? "md:items-end md:text-right" : "md:items-start"}`}
                initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className={`flex ${isRTL ? "md:justify-end" : ""}`}>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-nile-teal dark:bg-[--color-primary-teal] text-white text-lg font-bold md:relative md:z-10 shadow-md">
                    2
                  </div>
                </div>
                <div
                  className={`mt-3 text-center ${isRTL ? "md:text-right md:pr-12" : "md:text-left md:pl-12"}`}
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t("howItWorks.step2.title")}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {t("howItWorks.step2.description")}
                  </p>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                className={`relative flex flex-col items-center ${isRTL ? "md:items-start" : "md:items-end md:text-right"}`}
                initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className={`flex ${isRTL ? "" : "md:justify-end"}`}>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-nile-teal dark:bg-[--color-primary-teal] text-white text-lg font-bold md:relative md:z-10 shadow-md">
                    3
                  </div>
                </div>
                <div
                  className={`mt-3 text-center ${isRTL ? "md:text-left md:pl-12" : "md:text-right md:pr-12"}`}
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t("howItWorks.step3.title")}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {t("howItWorks.step3.description")}
                  </p>
                </div>
              </motion.div>

              {/* Empty cell */}
              <div className="hidden md:block"></div>

              {/* Empty cell */}
              <div className="hidden md:block"></div>

              {/* Step 4 */}
              <motion.div
                className={`relative flex flex-col items-center ${isRTL ? "md:items-end md:text-right" : "md:items-start"}`}
                initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className={`flex ${isRTL ? "md:justify-end" : ""}`}>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-nile-teal dark:bg-[--color-primary-teal] text-white text-lg font-bold md:relative md:z-10 shadow-md">
                    4
                  </div>
                </div>
                <div
                  className={`mt-3 text-center ${isRTL ? "md:text-right md:pr-12" : "md:text-left md:pl-12"}`}
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t("howItWorks.step4.title")}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {t("howItWorks.step4.description")}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* CTA */}
            <div className="mt-16 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="px-4"
              >
                <a
                  href="#"
                  className="inline-block rounded-md bg-pharaonic-gold dark:bg-[--color-primary-gold] px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
                >
                  {t("howItWorks.cta")}
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div id="testimonials" className="py-16 bg-white dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-lg font-medium uppercase tracking-wider text-pharaonic-gold dark:text-[--color-primary-gold]">
              {t("testimonials.title")}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-nile-teal dark:text-[--color-primary-teal] sm:text-4xl font-serif">
              {t("testimonials.subtitle")}
            </h2>
          </div>

          <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.author}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col justify-between bg-bg-light dark:bg-neutral-800 p-8 rounded-2xl shadow-lg ring-1 ring-gray-200 dark:ring-neutral-700"
                >
                  <div className="mb-6">
                    <svg
                      className="h-8 w-8 text-pharaonic-gold dark:text-[--color-primary-gold]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                    </svg>
                  </div>
                  <blockquote className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 flex-grow">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                    <div className="text-sm text-pharaonic-gold dark:text-[--color-primary-gold]">
                      {testimonial.company}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" className="py-16 bg-slate-50 dark:bg-neutral-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-base font-medium uppercase tracking-wider text-pharaonic-gold dark:text-[--color-primary-gold]">
              {t("pricing.title")}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-nile-teal dark:text-[--color-primary-teal] sm:text-4xl font-serif">
              {t("pricing.subtitle")}
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              {t("pricing.description")}
            </p>
          </div>
          <div className="isolate mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:mt-20 lg:grid-cols-3">
            {[
              {
                name: t("pricing.free.name"),
                price: t("pricing.free.price"),
                description: t("pricing.free.description"),
                features: [
                  t("pricing.free.features.0"),
                  t("pricing.free.features.1"),
                  t("pricing.free.features.2"),
                  t("pricing.free.features.3"),
                ],
                cta: t("pricing.free.cta"),
                highlighted: false,
              },
              {
                name: t("pricing.professional.name"),
                price: t("pricing.professional.price"),
                description: t("pricing.professional.description"),
                features: [
                  t("pricing.professional.features.0"),
                  t("pricing.professional.features.1"),
                  t("pricing.professional.features.2"),
                  t("pricing.professional.features.3"),
                  t("pricing.professional.features.4"),
                  t("pricing.professional.features.5"),
                ],
                cta: t("pricing.professional.cta"),
                highlighted: true,
              },
              {
                name: t("pricing.enterprise.name"),
                price: t("pricing.enterprise.price"),
                description: t("pricing.enterprise.description"),
                features: [
                  t("pricing.enterprise.features.0"),
                  t("pricing.enterprise.features.1"),
                  t("pricing.enterprise.features.2"),
                  t("pricing.enterprise.features.3"),
                  t("pricing.enterprise.features.4"),
                  t("pricing.enterprise.features.5"),
                ],
                cta: t("pricing.enterprise.cta"),
                highlighted: false,
              },
            ].map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`flex flex-col h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    tier.highlighted
                      ? "bg-brand-teal text-white dark:bg-[--color-primary-teal]"
                      : ""
                  }`}
                >
                  <div>
                    <h3
                      className={`text-lg font-semibold leading-8 ${
                        tier.highlighted
                          ? "text-white"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {tier.name}
                    </h3>
                    <p
                      className={`mt-4 text-sm leading-6 ${
                        tier.highlighted
                          ? "text-white/80"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {tier.description}
                    </p>
                    <p className="mt-6 flex items-baseline gap-x-1">
                      <span
                        className={`text-4xl font-bold tracking-tight ${
                          tier.highlighted
                            ? "text-white"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {tier.price}
                      </span>
                      {tier.price !== t("pricing.enterprise.price") && (
                        <span
                          className={`text-sm font-semibold leading-6 ${
                            tier.highlighted
                              ? "text-white/80"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {t("pricing.oneTime")}
                        </span>
                      )}
                    </p>
                  </div>

                  <ul
                    role="list"
                    className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300 flex-grow"
                  >
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <CheckIcon
                          className={`h-6 w-5 flex-none ${
                            tier.highlighted
                              ? "text-pharaonic-gold"
                              : "text-pharaonic-gold dark:text-[--color-primary-gold]"
                          }`}
                          aria-hidden="true"
                        />
                        <span className={tier.highlighted ? "text-white" : ""}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={tier.highlighted ? "secondary" : "default"}
                    className={`mt-8 ${
                      tier.highlighted
                        ? "bg-white text-brand-teal hover:bg-gray-100 dark:bg-white dark:text-[--color-primary-teal] dark:hover:bg-gray-100"
                        : ""
                    }`}
                    asChild
                  >
                    <a href="/auth/login">{tier.cta}</a>
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div id="faq" className="py-16 bg-white dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <p className="text-base font-medium uppercase tracking-wider text-pharaonic-gold dark:text-[--color-primary-gold]">
              {t("faq.title")}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-nile-teal dark:text-[--color-primary-teal] sm:text-4xl font-serif">
              {t("faq.subtitle")}
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              {t("faq.description")}
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl lg:mt-20">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="dark:text-white"
                >
                  <FaqItem
                    key={faq.question}
                    question={faq.question}
                    answer={faq.answer}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <LandingFooter t={t} isRTL={isRTL} />
    </main>
  );
}
