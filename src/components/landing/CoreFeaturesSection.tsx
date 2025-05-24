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
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            {t("coreFeatures.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-2xl text-lg text-gray-600 mx-auto"
          >
            {t("coreFeatures.subtitle")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-y-20 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-0">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full bg-nile-teal/10 flex items-center justify-center">
                    <feature.icon
                      className="h-8 w-8 text-nile-teal"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="absolute -top-3 -right-3 bg-pharaonic-gold text-white text-xs rounded-full h-8 w-8 flex items-center justify-center font-bold">
                    {feature.stat}
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  {feature.name}
                </h3>
                <p className="mt-3 text-base text-gray-600">
                  {feature.description}
                </p>
                <div className="mt-4 text-sm font-medium text-nile-teal">
                  {feature.statText}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-24 bg-gradient-to-r from-nile-teal to-nile-teal/80 rounded-2xl overflow-hidden shadow-xl"
        >
          <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:p-20">
            <div className="lg:w-0 lg:flex-1">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                {t("coreFeatures.cta.title")}
              </h2>
              <p className="mt-4 max-w-3xl text-lg text-white/90">
                {t("coreFeatures.cta.description")}
              </p>
            </div>
            <div className="mt-12 sm:w-full sm:max-w-md lg:mt-0 lg:ml-8 lg:flex-1">
              <div className={`sm:flex ${isRTL ? "sm:flex-row-reverse" : ""}`}>
                <div className="mt-4 sm:mt-0 sm:ml-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="block w-full rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-nile-teal shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-nile-teal sm:px-10"
                  >
                    {t("coreFeatures.cta.button")}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
