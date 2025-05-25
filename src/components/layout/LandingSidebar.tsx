"use client";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ThemeSwitch } from "@/components/ui";
import {
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  CubeTransparentIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const navigation = [
  {
    name: "Features",
    href: "#features",
    icon: <CubeTransparentIcon className="h-5 w-5" />,
  },
  {
    name: "How It Works",
    href: "#how-it-works",
    icon: <ChartBarIcon className="h-5 w-5" />,
  },
  {
    name: "Why Choose ReefQ",
    href: "#why-choose-reefq",
    icon: <SparklesIcon className="h-5 w-5" />,
  },
  {
    name: "Brand Vision",
    href: "#branding",
    icon: <PhotoIcon className="h-5 w-5" />,
  },
  {
    name: "Performance",
    href: "#performance",
    icon: <SparklesIcon className="h-5 w-5" />,
  },
  {
    name: "Pricing",
    href: "#pricing",
    icon: <CurrencyDollarIcon className="h-5 w-5" />,
  },
  {
    name: "Testimonials",
    href: "#testimonials",
    icon: <ChatBubbleLeftRightIcon className="h-5 w-5" />,
  },
  {
    name: "FAQ",
    href: "#faq",
    icon: <QuestionMarkCircleIcon className="h-5 w-5" />,
  },
  {
    name: "Try & Fit",
    href: "/try-and-fit",
    highlight: true,
    icon: (
      <SparklesIcon className="h-5 w-5 text-pharaonic-gold dark:text-[--color-primary-gold]" />
    ),
  },
];

interface LandingSidebarProps {
  isRTL?: boolean;
  activeSection?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function LandingSidebar({
  isRTL = false,
  activeSection = "hero",
  isOpen,
  onClose,
}: LandingSidebarProps) {
  // Helper function for smooth scrolling
  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80; // Account for header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      onClose(); // Close the sidebar after clicking a link
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.aside
            className={`block lg:hidden fixed top-0 bottom-0 ${isRTL ? "right-0" : "left-0"} w-[280px] z-50 bg-white dark:bg-neutral-900 shadow-xl dark:shadow-neutral-800/30 overflow-hidden`}
            initial={{ x: isRTL ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? "100%" : "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex flex-col h-full">
              {/* Header with logo and close button */}
              <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-neutral-700">
                <div className="flex items-center gap-3">
                  <Link href="/" className="flex items-center">
                    <Image
                      src="/logo.png"
                      alt="Reefq"
                      width={100}
                      height={32}
                      className="h-8 w-auto object-contain"
                      priority
                    />
                  </Link>
                  <div className="ml-2">
                    <LanguageSwitcher />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeSwitch className="border border-neutral-300 dark:border-neutral-700" />
                  <button
                    onClick={onClose}
                    className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
                    aria-label="Close sidebar"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <nav
                className={`flex-1 overflow-y-auto py-6 px-4 ${isRTL ? "text-right" : "text-left"}`}
              >
                <ul className="space-y-2">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        onClick={(e) =>
                          scrollToSection(e, item.href.replace("#", ""))
                        }
                        className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors relative ${
                          activeSection === item.href.replace("#", "")
                            ? "text-nile-teal dark:text-[--color-primary-teal] bg-nile-teal/10 dark:bg-[--color-primary-teal]/10"
                            : "text-gray-700 dark:text-gray-300 hover:text-nile-teal dark:hover:text-[--color-primary-teal] hover:bg-gray-50 dark:hover:bg-neutral-800"
                        } ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                        {activeSection === item.href.replace("#", "") && (
                          <motion.span
                            className={`absolute ${isRTL ? "right-0" : "left-0"} top-0 bottom-0 w-1 bg-nile-teal dark:bg-[--color-primary-teal] rounded-full`}
                            layoutId="activeSidebarSection"
                            transition={{
                              type: "spring",
                              stiffness: 350,
                              damping: 30,
                            }}
                          />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* CTA */}
              <div className="p-6 border-t border-gray-200 dark:border-neutral-700">
                <a
                  href="/auth/login"
                  className="flex items-center justify-center gap-2 rounded-md w-full px-4 py-2.5 text-sm font-medium text-white bg-nile-teal hover:bg-opacity-90 dark:bg-[--color-primary-teal] dark:hover:bg-opacity-90 transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-teal dark:focus:ring-[--color-primary-teal] dark:focus:ring-offset-neutral-900"
                >
                  Get Started
                </a>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
