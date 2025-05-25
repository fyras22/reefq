"use client";

import { FallbackImage, ThemeSwitch } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import {
  HeartIcon,
  ShoppingCartIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import { TFunction } from "i18next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import LanguageSwitcher from "../LanguageSwitcher";

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
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

interface LandingHeaderProps {
  t: TFunction; // Pass translation function as prop
  isRTL: boolean;
  scrolled: boolean;
  activeSection?: string;
}

export function LandingHeader({
  t,
  isRTL,
  scrolled,
  activeSection = "hero",
}: LandingHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const productsRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "en";
  const { user } = useAuth();

  // Define navigation links
  const navLinks = [
    { name: "home", path: "/" },
    { name: "products", path: "/products" },
    { name: "collections", path: "/collections" },
    { name: "try_fit", path: "/try-and-fit" },
    { name: "jewelry_knowledge", path: "/jewelry-knowledge" },
    { name: "about", path: "/about" },
    { name: "contact", path: "/contact" },
  ];

  // Close products dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        productsRef.current &&
        !productsRef.current.contains(event.target as Node)
      ) {
        setProductsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // New state for features dropdown
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const featuresRef = useRef<HTMLLIElement>(null);

  // Close products dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        featuresRef.current &&
        !featuresRef.current.contains(event.target as Node)
      ) {
        setFeaturesOpen(false);
      }
      if (
        productsRef.current &&
        !productsRef.current.contains(event.target as Node)
      ) {
        setProductsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-neutral-900/95 shadow-md dark:shadow-neutral-800/30 py-2"
          : "bg-transparent backdrop-blur-sm py-4"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo - Left in LTR, Right in RTL */}
        <div
          className={`flex-shrink-0 ${isRTL ? "order-3 lg:order-3" : "order-1"}`}
        >
          <Link href={`/${lang}`} className="flex items-center">
            <span className="sr-only">Reefq</span>
            {/* Consistent logo regardless of scroll state */}
            <FallbackImage
              src="/logo.png"
              alt={isRTL ? "رِفق" : "ReefQ"}
              width={200}
              height={70}
              className="h-16 lg:h-20 w-auto object-contain"
              priority
              fallbackSrc="/images/fallback-logo.svg"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div
          className={`hidden xl:flex items-center ${isRTL ? "order-2 justify-end space-x-reverse space-x-4 xl:space-x-6" : "order-2 justify-center space-x-4 xl:space-x-6"}`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={`/${lang}${link.path === "/" ? "" : link.path}`}
              className={cn(
                "text-neutral-700 dark:text-neutral-300 hover:text-[--color-primary-teal] dark:hover:text-[--color-primary-teal] transition-colors whitespace-nowrap text-xs lg:text-sm",
                pathname === `/${lang}${link.path === "/" ? "" : link.path}` &&
                  "text-[--color-primary-teal] dark:text-[--color-primary-teal] font-medium"
              )}
            >
              {t(`nav.${link.name}`)}
            </Link>
          ))}
        </div>

        {/* Right Actions - Language, Theme, User Actions */}
        <div
          className={`hidden lg:flex items-center gap-2 sm:gap-3 ${isRTL ? "order-1" : "order-3"}`}
        >
          <LanguageSwitcher />
          <ThemeSwitch className="border border-neutral-300 dark:border-neutral-700" />

          <div className="hidden lg:flex items-center space-x-1">
            {/* Cart is always visible */}
            <Link
              href={`/${lang}/cart`}
              className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-[--color-primary-teal] dark:hover:text-[--color-primary-teal] transition-colors"
            >
              <ShoppingCartIcon className="h-5 w-5" />
            </Link>

            {/* Wishlist and Account icons only visible when logged in */}
            {user && (
              <>
                <Link
                  href={`/${lang}/wishlist`}
                  className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-[--color-primary-teal] dark:hover:text-[--color-primary-teal] transition-colors"
                >
                  <HeartIcon className="h-5 w-5" />
                </Link>
                <Link
                  href={`/${lang}/account`}
                  className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-[--color-primary-teal] dark:hover:text-[--color-primary-teal] transition-colors"
                >
                  <UserIcon className="h-5 w-5" />
                </Link>
              </>
            )}
          </div>

          <a
            href={user ? `/${lang}/account` : `/${lang}/auth/login`}
            className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              scrolled
                ? "bg-nile-teal dark:bg-nile-teal focus:ring-nile-teal"
                : "bg-pharaonic-gold dark:bg-pharaonic-gold focus:ring-pharaonic-gold"
            }`}
          >
            {user ? t("nav.account") : t("header.getStarted")}
          </a>
        </div>

        {/* Mobile menu button and Language Switcher - Right in LTR, Left in RTL */}
        <div
          className={`flex items-center lg:hidden ${isRTL ? "order-1" : "order-3"}`}
        >
          <div className="mr-2">
            <LanguageSwitcher />
          </div>
          <div className="hidden sm:block mr-2">
            <ThemeSwitch className="border border-neutral-300 dark:border-neutral-700" />
          </div>
          <button
            type="button"
            className={`inline-flex items-center justify-center rounded-md p-2 ${
              scrolled
                ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-black/30 backdrop-blur-sm hover:text-gray-900 dark:hover:text-white"
            }`}
            aria-expanded="false"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden"
          >
            <div className="space-y-1 px-4 pb-3 pt-2 bg-white dark:bg-neutral-900 shadow-lg dark:shadow-neutral-800/30 rounded-b-xl">
              {/* Navigation Links for Mobile */}
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={`/${lang}${link.path === "/" ? "" : link.path}`}
                    className={cn(
                      "text-neutral-700 dark:text-neutral-300 hover:text-[--color-primary-teal] dark:hover:text-[--color-primary-teal] transition-colors py-2",
                      pathname ===
                        `/${lang}${link.path === "/" ? "" : link.path}` &&
                        "text-[--color-primary-teal] dark:text-[--color-primary-teal] font-medium"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(`nav.${link.name}`)}
                  </Link>
                ))}
              </div>

              {/* Theme toggle for small screens */}
              <div className="sm:hidden pt-2">
                <ThemeSwitch className="border border-neutral-300 dark:border-neutral-700" />
              </div>

              {/* User Actions for Mobile */}
              <div className="flex space-x-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <Link
                  href={`/${lang}/cart`}
                  className="flex items-center text-neutral-700 dark:text-neutral-300 hover:text-[--color-primary-teal] dark:hover:text-[--color-primary-teal] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  {t("cart")}
                </Link>
                {user && (
                  <>
                    <Link
                      href={`/${lang}/wishlist`}
                      className="flex items-center text-neutral-700 dark:text-neutral-300 hover:text-[--color-primary-teal] dark:hover:text-[--color-primary-teal] transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <HeartIcon className="h-5 w-5 mr-2" />
                      {t("wishlist")}
                    </Link>
                    <Link
                      href={`/${lang}/account`}
                      className="flex items-center text-neutral-700 dark:text-neutral-300 hover:text-[--color-primary-teal] dark:hover:text-[--color-primary-teal] transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserIcon className="h-5 w-5 mr-2" />
                      {t("account")}
                    </Link>
                  </>
                )}
              </div>

              <div
                className={`border-t border-gray-200 dark:border-gray-700 py-6 px-4 ${isRTL ? "text-right" : "text-left"} bg-gray-50 dark:bg-gray-800 rounded-b-xl`}
              >
                <a
                  href={user ? `/${lang}/account` : `/${lang}/auth/login`}
                  className="w-full inline-flex items-center justify-center rounded-md bg-nile-teal dark:bg-nile-teal px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-nile-teal focus:ring-offset-2 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {user ? t("nav.account") : t("header.getStarted")}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
