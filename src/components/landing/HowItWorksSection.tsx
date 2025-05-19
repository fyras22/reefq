"use client";

import { motion } from "framer-motion";
import { TFunction } from "i18next";
import Image from "next/image";

interface HowItWorksSectionProps {
  t: TFunction;
  isRTL: boolean;
}

export function HowItWorksSection({ t, isRTL }: HowItWorksSectionProps) {
  const steps = [
    {
      id: "step1",
      title: t("howItWorks.step1.title"),
      description: t("howItWorks.step1.description"),
      imageUrl: "/images/how-it-works/step1.webp",
    },
    {
      id: "step2",
      title: t("howItWorks.step2.title"),
      description: t("howItWorks.step2.description"),
      imageUrl: "/images/how-it-works/step2.webp",
    },
    {
      id: "step3",
      title: t("howItWorks.step3.title"),
      description: t("howItWorks.step3.description"),
      imageUrl: "/images/how-it-works/step3.webp",
    },
    {
      id: "step4",
      title: t("howItWorks.step4.title"),
      description: t("howItWorks.step4.description"),
      imageUrl: "/images/how-it-works/step4.webp",
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            {t("howItWorks.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-2xl text-lg text-gray-600 mx-auto"
          >
            {t("howItWorks.subtitle")}
          </motion.p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-nile-teal/20"
            style={{ transform: "translateX(-50%)" }}
          ></div>

          {/* Steps */}
          <div className="relative z-10 space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-12`}
              >
                <div className="md:w-1/2 text-center md:text-left">
                  <div
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-nile-teal text-white text-lg font-semibold mb-4`}
                  >
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                <div className="md:w-1/2">
                  <div className="rounded-2xl overflow-hidden shadow-lg relative aspect-video">
                    <Image
                      src={step.imageUrl}
                      alt={step.title}
                      className="object-cover"
                      fill
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-nile-teal hover:bg-nile-teal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-teal"
          >
            {t("howItWorks.cta")}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
