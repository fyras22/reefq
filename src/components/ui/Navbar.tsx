"use client";

import { useTranslation } from "@/app/i18n-client";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { cn } from "@/lib/utils";
import {
  Bars3Icon,
  HeartIcon,
  ShoppingCartIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Collections", path: "/collections" },
  { name: "Try & Fit", path: "/try-and-fit" },
  { name: "Jewelry Knowledge", path: "/jewelry-knowledge" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const params = useParams();
  const pathname = usePathname();
  const lang = (params?.lang as string) || "en";
  const { t } = useTranslation(lang, "common");

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
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href={`/${lang}`}
          className="text-2xl font-bold text-[--color-primary-teal] dark:text-[--color-primary-teal]"
        >
          ReefQ
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={`/${lang}${link.path === "/" ? "" : link.path}`}
              className={cn(
                "text-neutral-700 dark:text-neutral-300 hover:text-[--color-primary-teal] dark:hover:text-[--color-primary-teal] transition-colors",
                pathname === `/${lang}${link.path === "/" ? "" : link.path}` &&
                  "text-[--color-primary-teal] dark:text-[--color-primary-teal] font-medium"
              )}
            >
              {t(link.name.toLowerCase().replace(" & ", "_").replace(" ", "_"))}
            </Link>
          ))}
        </div>

        {/* User Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          <ThemeSwitch className="mr-2 border border-neutral-300 dark:border-neutral-700" />
          <Link
            href={`/${lang}/wishlist`}
            className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-[--color-primary-teal] dark:hover:text-[--color-primary-teal] transition-colors"
          >
            <HeartIcon className="h-6 w-6" />
          </Link>
          <Link
            href={`/${lang}/cart`}
            className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-[--color-primary-teal] dark:hover:text-[--color-primary-teal] transition-colors"
          >
            <ShoppingCartIcon className="h-6 w-6" />
          </Link>
          <Link
            href={`/${lang}/account`}
            className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-[--color-primary-teal] dark:hover:text-[--color-primary-teal] transition-colors"
          >
            <UserIcon className="h-6 w-6" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-2">
          <ThemeSwitch className="border border-neutral-300 dark:border-neutral-700" />
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white dark:bg-neutral-900 shadow-lg dark:shadow-neutral-800/30 py-4 px-6 absolute top-full left-0 right-0">
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
                onClick={() => setIsOpen(false)}
              >
                {t(
                  link.name.toLowerCase().replace(" & ", "_").replace(" ", "_")
                )}
              </Link>
            ))}
            <div className="flex space-x-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <Link
                href={`/${lang}/wishlist`}
                className="flex items-center text-neutral-700 dark:text-neutral-300 hover:text-[--color-primary-teal] dark:hover:text-[--color-primary-teal] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <HeartIcon className="h-5 w-5 mr-2" />
                {t("wishlist")}
              </Link>
              <Link
                href={`/${lang}/cart`}
                className="flex items-center text-neutral-700 dark:text-neutral-300 hover:text-[--color-primary-teal] dark:hover:text-[--color-primary-teal] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                {t("cart")}
              </Link>
              <Link
                href={`/${lang}/account`}
                className="flex items-center text-neutral-700 dark:text-neutral-300 hover:text-[--color-primary-teal] dark:hover:text-[--color-primary-teal] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <UserIcon className="h-5 w-5 mr-2" />
                {t("account")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
