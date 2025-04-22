"use client";

import { useState, useEffect, Fragment } from "react";
import { useTranslation } from "@/app/i18n-client";
import { 
  XMarkIcon,
  Bars3Icon,
  ShoppingBagIcon,
  UserIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";

// Dynamically import our interactive components
const InteractiveSizeGuide = dynamic(() => import("@/components/InteractiveSizeGuide"), {
  loading: () => <p className="text-center py-10">Loading interactive size guide...</p>,
  ssr: false
});

const SizeComparisonTool = dynamic(() => import("@/components/SizeComparisonToolNew"), {
  loading: () => <p className="text-center py-10">Loading size comparison tool...</p>,
  ssr: false
});

export default function MeasurementsFeature({ params }: { params: { lang: string } }) {
  const { t } = useTranslation(params.lang, "common");
  const [isRTL, setIsRTL] = useState(false);
  const [activeTab, setActiveTab] = useState("guide");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  // Track scroll position for header styling
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollThreshold = 50;

  useEffect(() => {
    // Check if the language is RTL
    setIsRTL(["ar", "he", "fa"].includes(params.lang));
    
    // Add scroll listener
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [params.lang]);

  // Main navigation categories
  const categories = [
    { 
      name: t("navigation.products", "Products"), 
      id: "products",
      items: [
        { name: t("categories.rings", "Rings"), href: `/${params.lang}/collections/rings` },
        { name: t("categories.necklaces", "Necklaces"), href: `/${params.lang}/collections/necklaces` },
        { name: t("categories.bracelets", "Bracelets"), href: `/${params.lang}/collections/bracelets` },
        { name: t("categories.earrings", "Earrings"), href: `/${params.lang}/collections/earrings` },
      ]
    },
    { 
      name: t("navigation.features", "Features"), 
      id: "features",
      items: [
        { name: t("features.measurements", "Size & Measurements"), href: `/${params.lang}/measurements` },
        { name: t("features.visualization", "3D Visualization"), href: `/${params.lang}/visualization` },
        { name: t("features.tryOn", "Virtual Try-On"), href: `/${params.lang}/try-on` },
      ]
    }
  ];

  // Navigation items for the mobile menu
  const navigationItems = [
    { name: t("navigation.home", "Home"), href: `/${params.lang}` },
    { name: t("navigation.collections", "Collections"), href: `/${params.lang}/collections` },
    { name: t("navigation.knowledge", "Jewelry Knowledge"), href: `/${params.lang}/jewelry-knowledge` },
    { name: t("navigation.customize", "Customize"), href: `/${params.lang}/customize` },
    { name: t("navigation.tryOn", "Try On"), href: `/${params.lang}/try-and-fit` },
  ];

  // User account links
  const accountLinks = [
    { name: t("account.profile", "My Profile"), href: `/${params.lang}/account/profile` },
    { name: t("account.orders", "My Orders"), href: `/${params.lang}/account/orders` },
    { name: t("account.wishlist", "Wishlist"), href: `/${params.lang}/account/wishlist` },
    { name: t("account.settings", "Settings"), href: `/${params.lang}/account/settings` },
  ];


  // Handle dropdown toggle
  const toggleDropdown = (id: string) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  return (
    <div className="bg-white">
      {/* Fixed header with mobile menu button */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollPosition > scrollThreshold ? "bg-white shadow-md py-2" : "bg-white/90 backdrop-blur-sm py-4"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={`/${params.lang}`} className="flex-shrink-0 flex items-center">
              <Image 
                src="/logo.png" 
                alt="ReefQ" 
                width={120} 
                height={40} 
                className="h-8 w-auto"
              />
            </Link>
            
            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden lg:flex lg:gap-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* Desktop action buttons - Hidden on mobile */}
            <div className="hidden lg:flex lg:items-center lg:gap-x-4">
              <button className="p-2 text-gray-500 hover:text-indigo-600 transition-colors">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
              <Link href={`/${params.lang}/account/wishlist`} className="p-2 text-gray-500 hover:text-indigo-600 transition-colors">
                <HeartIcon className="h-5 w-5" />
              </Link>
              <Link href={`/${params.lang}/cart`} className="p-2 text-gray-500 hover:text-indigo-600 transition-colors">
                <ShoppingBagIcon className="h-5 w-5" />
              </Link>
              <Link href={`/${params.lang}/account`} className="p-2 text-gray-500 hover:text-indigo-600 transition-colors">
                <UserIcon className="h-5 w-5" />
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center gap-x-4">
              <button className="p-2 text-gray-500 hover:text-indigo-600">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
              <Link href={`/${params.lang}/cart`} className="p-2 text-gray-500 hover:text-indigo-600">
                <ShoppingBagIcon className="h-5 w-5" />
              </Link>
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-indigo-600"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu dialog with animation */}
      <Transition show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="lg:hidden relative z-50" onClose={setMobileMenuOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex h-full items-center justify-center p-0 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom={`${isRTL ? 'translate-x-full' : '-translate-x-full'} opacity-0`}
                enterTo="translate-x-0 opacity-100"
                leave="ease-in duration-200"
                leaveFrom="translate-x-0 opacity-100"
                leaveTo={`${isRTL ? 'translate-x-full' : '-translate-x-full'} opacity-0`}
              >
                <Dialog.Panel className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} w-full max-w-sm overflow-y-auto bg-white py-6 px-6 shadow-xl transform transition-all`}>
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Link href={`/${params.lang}`} className="-m-1.5 p-1.5 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                      <Image src="/logo.png" alt="ReefQ" width={120} height={40} className="h-8 w-auto" />
                    </Link>
                    <button
                      type="button"
                      className="-m-2.5 rounded-md p-2.5 text-gray-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  
                  {/* Search box */}
                  <div className="mt-6 mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={t("search.placeholder", "Search products...")}
                        className="w-full bg-gray-100 rounded-full px-4 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2" />
                    </div>
                  </div>
                  
                  <div className="mt-2 flow-root">
                    <div className="-my-6 divide-y divide-gray-200">
                      {/* Categories with dropdowns */}
                      <div className="space-y-2 py-6">
                        {/* Main Navigation Links */}
                        {navigationItems.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 ${isRTL ? 'text-right' : 'text-left'}`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                        
                        {/* Product Categories Dropdown */}
                        {categories.map((category) => (
                          <div key={category.id} className="py-1">
                            <button
                              onClick={() => toggleDropdown(category.id)}
                              className="w-full text-left flex justify-between items-center rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                            >
                              {category.name}
                              <ChevronDownIcon
                                className={`h-5 w-5 transition-transform ${
                                  dropdownOpen === category.id ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                            
                            {/* Dropdown content with animation */}
                            {dropdownOpen === category.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="pl-6 space-y-1 mt-1"
                              >
                                {category.items.map((item) => (
                                  <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {item.name}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* User account section */}
                      <div className="py-6">
                        <div className="mb-3 px-3">
                          <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            {t("account.title", "My Account")}
                          </h3>
                        </div>
                        {accountLinks.map((link) => (
                          <Link
                            key={link.name}
                            href={link.href}
                            className="block rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-indigo-600"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {link.name}
                          </Link>
                        ))}
                        
                        <div className="mt-6 px-3">
                          <button
                            type="button"
                            className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            {t("account.signIn", "Sign In")}
                          </button>
                        </div>
                      </div>
                      
                      {/* Language Selector */}
                      <div className="py-6">
                        <div className="mb-3 px-3">
                          <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            {t("language.select", "Select Language")}
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-2 px-3">
                          {["en", "fr", "es", "ar"].map((lang) => (
                            <Link
                              key={lang}
                              href={`/${lang}/features/measurements`}
                              className={`flex justify-center rounded-md px-3 py-2 text-sm font-medium ${
                                params.lang === lang 
                                  ? "bg-indigo-100 text-indigo-700" 
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {lang.toUpperCase()}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Hero section - Add margin top to account for fixed header */}
      <div className="relative bg-gray-50 pt-32 pb-20 px-4 sm:px-6 lg:pt-40 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
              {t("measurements.title", "Jewelry Measurement Methods")}
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              {t(
                "measurements.description",
                "Find your perfect fit with our comprehensive measurement tools and guides."
              )}
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <div
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 cursor-pointer"
                  onClick={() => setActiveTab("guide")}
                >
                  {t("measurements.tryTool", "Try Measurement Tool")}
                </div>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  href={`/${params.lang}/collections`}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  {t("measurements.viewCollections", "View Collections")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tool section with tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            defaultValue={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <option value="guide">Measurement Guide</option>
            <option value="conversion">Size Conversion</option>
            <option value="charts">Size Charts</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                className={`${
                  activeTab === "guide"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab("guide")}
              >
                Measurement Guide
              </button>
              <button
                className={`${
                  activeTab === "conversion"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab("conversion")}
              >
                Size Conversion
              </button>
              <button
                className={`${
                  activeTab === "charts"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab("charts")}
              >
                Size Charts
              </button>
            </nav>
          </div>
        </div>

        <div className="mt-8">
          {activeTab === "guide" && (
            <div className="bg-white shadow rounded-lg">
              <InteractiveSizeGuide />
            </div>
          )}
          
          {activeTab === "conversion" && (
            <div className="bg-white shadow rounded-lg">
              <SizeComparisonTool jewelryType="ring" />
            </div>
          )}
          
          {activeTab === "charts" && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Size Charts</h3>
                
                {/* Ring Sizing Chart */}
                <div className="mt-5">
                  <h4 className="text-md font-medium text-gray-800 mb-3">Ring Sizes</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            US Size
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            UK Size
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            EU Size
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Diameter (mm)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">H</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">47</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">14.9</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">J</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">49</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15.7</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">L</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">51</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">16.5</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">N</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">54</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">17.3</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">P</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">56</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18.1</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Bracelet Sizing Chart */}
                <div className="mt-8">
                  <h4 className="text-md font-medium text-gray-800 mb-3">Bracelet Sizes</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Size
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Wrist (cm)
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Wrist (inches)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">XS</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5.9</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">S</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">16.5</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6.5</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">M</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">17.8</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">L</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">19</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7.5</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">XL</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">20.5</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8.1</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Necklace Sizing Chart */}
                <div className="mt-8">
                  <h4 className="text-md font-medium text-gray-800 mb-3">Necklace Lengths</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Style
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Inches
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Centimeters
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Collar</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">14</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">35.6</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Choker</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">16</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">40.6</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Princess</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">45.7</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Matinee</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">20-22</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">50.8-55.9</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Opera</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">24-30</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">61.0-76.2</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rope</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">36+</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">91.4+</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related features section */}
      <div className="bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
              {t("features.relatedTitle", "Related Features")}
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              {t(
                "features.relatedDescription",
                "Explore these additional features to enhance your jewelry experience"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 