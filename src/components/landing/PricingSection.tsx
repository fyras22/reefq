"use client";

import { CheckIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { TFunction } from "i18next";

interface PricingSectionProps {
  t: TFunction;
  isRTL: boolean;
}

export function PricingSection({ t, isRTL }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-24 bg-gray-50 dark:bg-gray-800/30">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-nile-teal/10 text-nile-teal dark:bg-nile-teal/30 dark:text-white ring-1 ring-inset ring-nile-teal/20 mb-4"
          >
            {t("pricing.badge", "Pricing Plans")}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            {t("pricing.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300 mx-auto"
          >
            {t("pricing.description")}
          </motion.p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {/* Free tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-gray-900/50 overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
          >
            <div className="px-6 py-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("pricing.free.name")}
              </h3>
              <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
                {t("pricing.free.price")}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t("pricing.oneTime")}
              </p>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                {t("pricing.free.description")}
              </p>
              <ul className="mt-6 space-y-4">
                {[0, 1, 2, 3].map((featureIndex) => (
                  <li key={featureIndex} className="flex">
                    <CheckIcon className="h-5 w-5 text-nile-teal dark:text-nile-teal/80 shrink-0" />
                    <span className="ml-3 text-gray-500 dark:text-gray-400">
                      {t(`pricing.free.features.${featureIndex}`)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <a
                  href="#"
                  className="block w-full rounded-md border border-nile-teal dark:border-nile-teal/80 py-2 text-center text-sm font-semibold text-nile-teal dark:text-nile-teal/80 shadow-sm hover:bg-nile-teal dark:hover:bg-nile-teal/20 hover:text-white dark:hover:text-white transition-all duration-200"
                >
                  {t("pricing.free.cta")}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Professional tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-gray-900/50 overflow-hidden hover:shadow-2xl transition-shadow duration-300 relative border-2 border-nile-teal dark:border-nile-teal/80"
          >
            <div className="absolute top-0 w-full bg-nile-teal dark:bg-nile-teal/80 py-1.5 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-white">
                {t("pricing.mostPopular")}
              </p>
            </div>
            <div className="px-6 py-8 pt-12">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("pricing.professional.name")}
              </h3>
              <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
                {t("pricing.professional.price")}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t("pricing.oneTime")}
              </p>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                {t("pricing.professional.description")}
              </p>
              <ul className="mt-6 space-y-4">
                {[0, 1, 2, 3, 4, 5].map((featureIndex) => (
                  <li key={featureIndex} className="flex">
                    <CheckIcon className="h-5 w-5 text-nile-teal dark:text-nile-teal/80 shrink-0" />
                    <span className="ml-3 text-gray-500 dark:text-gray-400">
                      {t(`pricing.professional.features.${featureIndex}`)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <a
                  href="#"
                  className="block w-full rounded-md bg-nile-teal dark:bg-nile-teal/80 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-nile-teal-dark dark:hover:bg-nile-teal transition-all duration-200"
                >
                  {t("pricing.professional.cta")}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Enterprise tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-gray-900/50 overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
          >
            <div className="px-6 py-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("pricing.enterprise.name")}
              </h3>
              <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
                {t("pricing.enterprise.price")}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t("pricing.contactUs")}
              </p>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                {t("pricing.enterprise.description")}
              </p>
              <ul className="mt-6 space-y-4">
                {[0, 1, 2, 3, 4, 5].map((featureIndex) => (
                  <li key={featureIndex} className="flex">
                    <CheckIcon className="h-5 w-5 text-nile-teal dark:text-nile-teal/80 shrink-0" />
                    <span className="ml-3 text-gray-500 dark:text-gray-400">
                      {t(`pricing.enterprise.features.${featureIndex}`)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <a
                  href="#"
                  className="block w-full rounded-md border border-nile-teal dark:border-nile-teal/80 py-2 text-center text-sm font-semibold text-nile-teal dark:text-nile-teal/80 shadow-sm hover:bg-nile-teal dark:hover:bg-nile-teal/20 hover:text-white dark:hover:text-white transition-all duration-200"
                >
                  {t("pricing.enterprise.cta")}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
