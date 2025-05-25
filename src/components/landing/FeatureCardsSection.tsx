"use client";

import {
  BookOpenIcon,
  ChartBarIcon,
  CubeIcon,
  DevicePhoneMobileIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { TFunction } from "i18next";
import Image from "next/image";

interface FeatureCardsSectionProps {
  t: TFunction;
  isRTL: boolean;
}

export function FeatureCardsSection({ t, isRTL }: FeatureCardsSectionProps) {
  // Define feature cards
  const featureCards = [
    {
      id: "visualization",
      title: t("featureCards.visualization.title") || "3D Visualization",
      description:
        t("featureCards.visualization.description") ||
        "Experience jewelry in stunning 3D detail before purchase",
      icon: CubeIcon,
      color: "bg-gradient-to-br from-emerald-500 to-teal-700",
      darkColor: "dark:from-emerald-600/90 dark:to-teal-800/90",
      delay: 0.1,
    },
    {
      id: "tryOn",
      title: t("featureCards.tryOn.title") || "Virtual Try-On",
      description:
        t("featureCards.tryOn.description") ||
        "See how jewelry looks on you with our AR technology",
      icon: DevicePhoneMobileIcon,
      color: "bg-gradient-to-br from-amber-500 to-yellow-700",
      darkColor: "dark:from-amber-600/90 dark:to-yellow-800/90",
      delay: 0.2,
    },
    {
      id: "customization",
      title: t("featureCards.customization.title") || "Jewelry Customization",
      description:
        t("featureCards.customization.description") ||
        "Create your perfect jewelry piece with our advanced customization tools",
      icon: SparklesIcon,
      color: "bg-gradient-to-br from-blue-500 to-indigo-700",
      darkColor: "dark:from-blue-600/90 dark:to-indigo-800/90",
      delay: 0.3,
      highlighted: true,
    },
    {
      id: "collections",
      title: t("featureCards.collections.title") || "Curated Collections",
      description:
        t("featureCards.collections.description") ||
        "Explore our handcrafted jewelry collections for every style and occasion",
      icon: SquaresPlusIcon,
      color: "bg-gradient-to-br from-pink-500 to-rose-700",
      darkColor: "dark:from-pink-600/90 dark:to-rose-800/90",
      delay: 0.4,
    },
    {
      id: "knowledgeHub",
      title: t("featureCards.knowledgeHub.title") || "Knowledge Hub",
      description:
        t("featureCards.knowledgeHub.description") ||
        "Educational resources to help you understand jewelry craftsmanship and care",
      icon: BookOpenIcon,
      color: "bg-gradient-to-br from-violet-500 to-purple-700",
      darkColor: "dark:from-violet-600/90 dark:to-purple-800/90",
      delay: 0.5,
    },
    {
      id: "sizing",
      title: t("featureCards.sizing.title") || "Accurate Sizing",
      description:
        t("featureCards.sizing.description") ||
        "Get the perfect fit with our precise sizing technology",
      icon: ChartBarIcon,
      color: "bg-gradient-to-br from-purple-500 to-violet-700",
      darkColor: "dark:from-purple-600/90 dark:to-violet-800/90",
      delay: 0.6,
    },
    {
      id: "security",
      title: t("featureCards.security.title") || "Secure Shopping",
      description:
        t("featureCards.security.description") ||
        "Shop with confidence with our secure payment and data protection",
      icon: ShieldCheckIcon,
      color: "bg-gradient-to-br from-red-500 to-pink-700",
      darkColor: "dark:from-red-600/90 dark:to-pink-800/90",
      delay: 0.7,
    },
    {
      id: "ai",
      title: t("featureCards.ai.title") || "AI Recommendations",
      description:
        t("featureCards.ai.description") ||
        "Get personalized jewelry suggestions based on your preferences",
      icon: LightBulbIcon,
      color: "bg-gradient-to-br from-pharaonic-gold to-amber-700",
      darkColor: "dark:from-pharaonic-gold/90 dark:to-amber-800/90",
      delay: 0.8,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section
      id="why-choose-reefq"
      className="py-24 bg-gray-50 dark:bg-neutral-800/50 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-nile-teal/10 text-nile-teal dark:bg-nile-teal/30 dark:text-white ring-1 ring-inset ring-nile-teal/20 mb-4"
          >
            {t("featureCards.badge", "Why Choose ReefQ")}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4"
          >
            {t(
              "featureCards.sectionTitle",
              "Powerful Features for Your Jewelry Business"
            )}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-300"
          >
            {t(
              "featureCards.sectionDescription",
              "Discover how ReefQ transforms your jewelry business with cutting-edge technology and innovative solutions."
            )}
          </motion.p>
        </div>

        <motion.div
          className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featureCards.map((feature) => (
            <motion.div
              key={feature.id}
              className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full"
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div
                className={`${feature.color} ${feature.darkColor} p-6 h-28 flex items-center justify-center relative overflow-hidden`}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10 dark:opacity-20">
                  <svg
                    className="w-full h-full"
                    width="100%"
                    height="100%"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern
                        id={`grid-${feature.id}`}
                        width="10"
                        height="10"
                        patternUnits="userSpaceOnUse"
                      >
                        <circle cx="5" cy="5" r="1" fill="white" />
                      </pattern>
                    </defs>
                    <rect
                      width="100%"
                      height="100%"
                      fill={`url(#grid-${feature.id})`}
                    />
                  </svg>
                </div>

                <feature.icon
                  className="h-12 w-12 text-white drop-shadow-lg"
                  aria-hidden="true"
                />
              </div>

              <div className="px-6 py-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured jewelry showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-24 relative"
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-black rounded-2xl overflow-hidden shadow-2xl border-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="p-8 md:p-12 relative">
                {/* Subtle decorative elements for the text side */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-pharaonic-gold/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-nile-teal/5 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center p-2 bg-pharaonic-gold/10 rounded-lg mb-6">
                    <SparklesIcon className="h-6 w-6 text-pharaonic-gold" />
                  </div>

                  <h3 className="text-3xl font-bold text-white mb-4">
                    {t(
                      "featureCards.showcase.title",
                      "Transform Your Jewelry Experience"
                    )}
                  </h3>
                  <p className="text-gray-300 text-lg mb-8">
                    {t(
                      "featureCards.showcase.description",
                      "Experience the future of jewelry shopping with our cutting-edge platform that brings your designs to life."
                    )}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-nile-teal/20 flex items-center justify-center">
                        <svg
                          className="h-4 w-4 text-nile-teal"
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
                      <span className="text-gray-300 text-sm">
                        Interactive 3D View
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-nile-teal/20 flex items-center justify-center">
                        <svg
                          className="h-4 w-4 text-nile-teal"
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
                      <span className="text-gray-300 text-sm">
                        Custom Designs
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-nile-teal/20 flex items-center justify-center">
                        <svg
                          className="h-4 w-4 text-nile-teal"
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
                      <span className="text-gray-300 text-sm">
                        Real-time Preview
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-nile-teal/20 flex items-center justify-center">
                        <svg
                          className="h-4 w-4 text-nile-teal"
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
                      <span className="text-gray-300 text-sm">
                        Virtual Try-On
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg bg-pharaonic-gold text-black hover:bg-pharaonic-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pharaonic-gold transition-all duration-200"
                  >
                    {t("featureCards.showcase.cta", "Explore Features")}
                  </motion.button>
                </div>
              </div>

              <div className="relative h-full flex items-center justify-center p-8 md:p-0">
                <div className="relative w-full max-w-md mx-auto">
                  {/* Decorative elements */}
                  <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-pharaonic-gold/20 dark:bg-pharaonic-gold/10 blur-xl"></div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-nile-teal/20 dark:bg-nile-teal/10 blur-xl"></div>

                  {/* Custom jewelry diagram */}
                  <div className="relative z-10 flex items-center justify-center">
                    <div className="relative">
                      {/* Top row */}
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mr-4">
                          <Image
                            src="/images/customize-jewelery.png"
                            alt="Pendant"
                            width={60}
                            height={60}
                            className="object-contain"
                          />
                        </div>
                        <div className="text-gray-400 text-2xl mx-2">+</div>
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                          <svg
                            className="h-10 w-10 text-gray-200"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Main jewelry image */}
                      <div className="relative mx-auto w-48 h-48 bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
                        <Image
                          src="/images/customize-jewelery.png"
                          alt={t(
                            "featureCards.showcaseAlt",
                            "Jewelry showcase"
                          )}
                          fill
                          className="object-contain"
                          priority
                        />
                      </div>

                      {/* Bottom row */}
                      <div className="flex items-center justify-end">
                        <div className="text-gray-400 text-2xl mx-2">−</div>
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                          <svg
                            className="h-10 w-10 text-gray-200"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
