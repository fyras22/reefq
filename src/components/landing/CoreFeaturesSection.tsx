"use client";

import { motion } from "framer-motion";
import { TFunction } from "i18next";
import React from "react";

interface Feature {
  name: string;
  description: string;
  icon: React.ElementType;
  stat: string;
  statText: string;
}

interface CoreFeaturesSectionProps {
  t: TFunction;
  isRTL: boolean;
  features: Feature[];
}

export function CoreFeaturesSection({
  t,
  isRTL,
  features,
}: CoreFeaturesSectionProps) {
  return (
    <section
      id="core-features"
      className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-block">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-nile-teal/10 text-nile-teal dark:bg-nile-teal/20 dark:text-nile-teal/90 ring-1 ring-inset ring-nile-teal/20 mb-4"
            >
              {t("coreFeatures.badge", "Core Features")}
            </motion.span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl"
          >
            {t("coreFeatures.title", "Elevate Your Jewelry Business")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300 mx-auto"
          >
            {t(
              "coreFeatures.subtitle",
              "Our platform provides powerful tools to transform your jewelry business with cutting-edge technology"
            )}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-y-16 md:grid-cols-2 lg:grid-cols-3 gap-x-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              {/* Card with hover effect */}
              <div className="h-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col">
                {/* Icon and stat container */}
                <div className="flex items-center justify-between mb-6">
                  {/* Icon with background */}
                  <div className="relative">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-nile-teal/20 to-nile-teal/10 dark:from-nile-teal/30 dark:to-nile-teal/5 flex items-center justify-center">
                      <feature.icon
                        className="h-8 w-8 text-nile-teal dark:text-nile-teal/90"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Stat badge */}
                  <div className="flex flex-col items-end">
                    <div className="text-2xl font-bold text-pharaonic-gold dark:text-pharaonic-gold/90">
                      {feature.stat}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {feature.statText}
                    </div>
                  </div>
                </div>

                {/* Feature content */}
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>

                {/* Learn more link */}
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <a
                    href="#"
                    className="inline-flex items-center text-sm font-medium text-nile-teal dark:text-nile-teal/90 hover:text-nile-teal/80 dark:hover:text-nile-teal/70 transition-colors"
                  >
                    {t("coreFeatures.learnMore", "Learn more")}
                    <svg
                      className={`ml-1 h-4 w-4 ${isRTL ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section with enhanced design */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-32 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-nile-teal to-nile-teal/80 rounded-2xl transform -rotate-1 scale-[0.98] opacity-70 blur-[2px]"></div>
          <div className="relative bg-gradient-to-r from-nile-teal to-nile-teal/90 rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 opacity-10">
              <svg className="h-full w-full" viewBox="0 0 800 800">
                <defs>
                  <pattern
                    id="pattern-circles"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                    patternContentUnits="userSpaceOnUse"
                  >
                    <circle
                      id="pattern-circle"
                      cx="10"
                      cy="10"
                      r="1.6257413380501518"
                      fill="#fff"
                    ></circle>
                  </pattern>
                </defs>
                <rect
                  width="800"
                  height="800"
                  fill="url(#pattern-circles)"
                ></rect>
              </svg>
            </div>

            <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:p-20 relative z-10">
              <div className="lg:w-0 lg:flex-1">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  {t(
                    "coreFeatures.cta.title",
                    "Ready to transform your jewelry business?"
                  )}
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-white/90">
                  {t(
                    "coreFeatures.cta.description",
                    "Join thousands of jewelry businesses that have already enhanced their customer experience with our platform."
                  )}
                </p>

                {/* Added testimonial snippet */}
                <div className="mt-8 flex items-center">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white overflow-hidden"
                      >
                        <div className="h-full w-full bg-white/30"></div>
                      </div>
                    ))}
                  </div>
                  <p className="ml-4 text-sm text-white">
                    <span className="font-semibold">+1,500 businesses</span>{" "}
                    trust our platform
                  </p>
                </div>
              </div>

              <div className="mt-12 sm:w-full sm:max-w-md lg:mt-0 lg:ml-8 lg:flex-1">
                <div
                  className={`sm:flex ${isRTL ? "sm:flex-row-reverse" : ""}`}
                >
                  <div className="w-full">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="block w-full rounded-xl border border-transparent bg-white px-5 py-4 text-base font-medium text-nile-teal shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-nile-teal sm:px-10 transition-all duration-200"
                    >
                      {t("coreFeatures.cta.button", "Get Started Today")}
                    </motion.button>

                    {/* Improved no-credit-card text with better visibility */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                      className="mt-4 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30"
                    >
                      <p className="text-sm text-center text-white font-medium flex items-center justify-center">
                        <svg
                          className={`w-4 h-4 ${isRTL ? "ml-2 order-last" : "mr-2"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {t(
                          "coreFeatures.cta.noCreditCard",
                          "No credit card required to start"
                        )}
                      </p>
                    </motion.div>
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
