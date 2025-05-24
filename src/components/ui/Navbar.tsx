"use client";

import { useTranslation } from "@/app/i18n-client";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import {
  Bars3Icon,
  HeartIcon,
  ShoppingCartIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { name: "home", path: "/" },
  { name: "products", path: "/products" },
  { name: "collections", path: "/collections" },
  { name: "try_fit", path: "/try-and-fit" },
  { name: "jewelry_knowledge", path: "/jewelry-knowledge" },
  { name: "about", path: "/about" },
  { name: "contact", path: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const params = useParams();
  const pathname = usePathname();
  const lang = (params?.lang as string) || "en";
  const { t } = useTranslation(lang, "common");
  const isRTL = lang === "ar";
  const { user } = useAuth();

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Initialize scroll position on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-sm",
        scrolled
          ? "bg-white/95 dark:bg-neutral-900/95 shadow-md dark:shadow-neutral-800/30 py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href={`/${lang}`} className="flex items-center">
            <span className="sr-only">ReefQ</span>
            <Image
              src="/logo.png"
              alt={isRTL ? "رِفق" : "ReefQ"}
              width={180}
              height={60}
              className="h-14 lg:h-16 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation - show on XL, hidden on smaller screens */}
        <div
          className={`hidden xl:flex items-center ${isRTL ? "mr-4 space-x-reverse space-x-4 xl:space-x-6" : "ml-4 space-x-4 xl:space-x-6"}`}
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

        {/* User Actions */}
        <div
          className={`flex items-center ${isRTL ? "space-x-reverse space-x-2 sm:space-x-3" : "space-x-2 sm:space-x-3"}`}
        >
          <div className="hidden md:block">
            <ThemeSwitch className="border border-neutral-300 dark:border-neutral-700" />
          </div>
          <div className="hidden lg:flex items-center space-x-1">
            {/* Cart is always visible */}
            <Link
              href={`/${lang}/cart`}
              className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-[--color-primary-teal] dark:hover:text-[--color-primary-teal] transition-colors"
            >
              <ShoppingCartIcon className="h-5 w-5" />
            </Link>

            {/* Wishlist and Account only visible when logged in */}
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

            {/* Auth button changes based on login status */}
            <Link
              href={user ? `/${lang}/account` : `/${lang}/auth/login`}
              className="ml-2 inline-flex items-center justify-center rounded-md bg-nile-teal text-white px-3 py-1.5 text-xs font-medium hover:bg-nile-teal/90 transition-all"
            >
              {user ? t("nav.account") : t("header.getStarted")}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center">
            <button
              className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-[--color-primary-teal] dark:hover:text-[--color-primary-teal]"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="xl:hidden bg-white dark:bg-neutral-900 shadow-lg dark:shadow-neutral-800/30 py-4 px-6 absolute top-full left-0 right-0">
          <div className="flex flex-col space-y-4 max-w-7xl mx-auto">
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
                onClick={() => setIsOpen(false)}
              >
                {t(`nav.${link.name}`)}
              </Link>
            ))}

            {/* Only show ThemeSwitch in mobile menu on smaller screens */}
            <div className="md:hidden pt-2">
              <ThemeSwitch className="border border-neutral-300 dark:border-neutral-700" />
            </div>

            <div className="flex space-x-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              {/* Cart is always visible */}
              <Link
                href={`/${lang}/cart`}
                className="flex items-center text-neutral-700 dark:text-neutral-300 hover:text-[--color-primary-teal] dark:hover:text-[--color-primary-teal] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                {t("cart")}
              </Link>

              {/* Wishlist and Account only visible when logged in */}
              {user && (
                <>
                  <Link
                    href={`/${lang}/wishlist`}
                    className="flex items-center text-neutral-700 dark:text-neutral-300 hover:text-[--color-primary-teal] dark:hover:text-[--color-primary-teal] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <HeartIcon className="h-5 w-5 mr-2" />
                    {t("wishlist")}
                  </Link>
                  <Link
                    href={`/${lang}/account`}
                    className="flex items-center text-neutral-700 dark:text-neutral-300 hover:text-[--color-primary-teal] dark:hover:text-[--color-primary-teal] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserIcon className="h-5 w-5 mr-2" />
                    {t("account")}
                  </Link>
                </>
              )}
            </div>

            {/* Auth button in mobile menu */}
            <div className="pt-4">
              <Link
                href={user ? `/${lang}/account` : `/${lang}/auth/login`}
                className="w-full inline-flex items-center justify-center rounded-md bg-nile-teal text-white px-4 py-2 font-medium hover:bg-nile-teal/90 transition-all"
                onClick={() => setIsOpen(false)}
              >
                {user ? t("nav.account") : t("header.getStarted")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
