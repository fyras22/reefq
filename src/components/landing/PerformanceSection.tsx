"use client";

import { ChartBarIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { TFunction } from "i18next";

interface PerformanceSectionProps {
  t: TFunction;
}

export default function PerformanceSection({ t }: PerformanceSectionProps) {
  const metrics = [
    {
      id: "loading",
      name: t("performance.metrics.loading.name"),
      value: t("performance.metrics.loading.value"),
      description: t("performance.metrics.loading.description"),
    },
    {
      id: "rendering",
      name: t("performance.metrics.rendering.name"),
      value: t("performance.metrics.rendering.value"),
      description: t("performance.metrics.rendering.description"),
    },
    {
      id: "memory",
      name: t("performance.metrics.memory.name"),
      value: t("performance.metrics.memory.value"),
      description: t("performance.metrics.memory.description"),
    },
    {
      id: "size",
      name: t("performance.metrics.size.name"),
      value: t("performance.metrics.size.value"),
      description: t("performance.metrics.size.description"),
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            {t("performance.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-2xl text-lg text-gray-600 mx-auto"
          >
            {t("performance.description")}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {metrics.map((metric, index) => (
            <div key={metric.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-nile-teal" />
                <h3 className="ml-2 text-lg font-medium text-gray-900">
                  {metric.name}
                </h3>
              </div>
              <p className="mt-4 text-3xl font-bold text-nile-teal">
                {metric.value}
              </p>
              <p className="mt-2 text-sm text-gray-600">{metric.description}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 bg-white rounded-lg shadow-md p-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {t("performance.chart.title")}
          </h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">
              {t("performance.chart.placeholder")}
            </p>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            {t("performance.chart.description")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
