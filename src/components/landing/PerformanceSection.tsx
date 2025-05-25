"use client";

import {
  ArrowDownTrayIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";
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
      icon: ArrowDownTrayIcon,
      color: "from-blue-500 to-blue-600",
      darkColor: "from-blue-600/80 to-blue-700/80",
    },
    {
      id: "rendering",
      name: t("performance.metrics.rendering.name"),
      value: t("performance.metrics.rendering.value"),
      description: t("performance.metrics.rendering.description"),
      icon: ArrowTrendingUpIcon,
      color: "from-green-500 to-green-600",
      darkColor: "from-green-600/80 to-green-700/80",
    },
    {
      id: "memory",
      name: t("performance.metrics.memory.name"),
      value: t("performance.metrics.memory.value"),
      description: t("performance.metrics.memory.description"),
      icon: CpuChipIcon,
      color: "from-purple-500 to-purple-600",
      darkColor: "from-purple-600/80 to-purple-700/80",
    },
    {
      id: "size",
      name: t("performance.metrics.size.name"),
      value: t("performance.metrics.size.value"),
      description: t("performance.metrics.size.description"),
      icon: ChartBarIcon,
      color: "from-amber-500 to-amber-600",
      darkColor: "from-amber-600/80 to-amber-700/80",
    },
  ];

  return (
    <section id="performance" className="py-24 bg-gray-50 dark:bg-gray-800/30">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-nile-teal/10 text-nile-teal dark:bg-nile-teal/30 dark:text-white ring-1 ring-inset ring-nile-teal/20 mb-4"
          >
            {t("performance.badge", "Performance Metrics")}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            {t("performance.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300 mx-auto"
          >
            {t("performance.description")}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative bg-white dark:bg-gray-900 rounded-xl shadow-lg dark:shadow-gray-900/30 p-6 border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div
                className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-gradient-to-br opacity-10 rounded-full"
                style={{
                  background: `linear-gradient(to bottom right, var(--${metric.color.split(" ")[1].replace("to-", "")}), var(--${metric.color.split(" ")[1].replace("to-", "")}/30))`,
                }}
              />

              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br ${metric.color} dark:${metric.darkColor} text-white`}
                >
                  <metric.icon className="h-6 w-6" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                  {metric.name}
                </h3>
              </div>

              <p className="mt-6 text-3xl font-bold bg-gradient-to-r from-nile-teal to-pharaonic-gold bg-clip-text text-transparent">
                {metric.value}
              </p>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {metric.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 bg-white dark:bg-gray-900 rounded-xl shadow-lg dark:shadow-gray-900/30 p-8 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("performance.chart.title")}
            </h3>

            <div className="mt-2 md:mt-0 flex space-x-2">
              <button className="px-3 py-1 bg-nile-teal/10 dark:bg-nile-teal/20 text-nile-teal dark:text-nile-teal/90 rounded-md text-sm font-medium">
                Last 7 days
              </button>
              <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md text-sm font-medium">
                Last 30 days
              </button>
              <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md text-sm font-medium">
                All time
              </button>
            </div>
          </div>

          <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <ChartBarIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">
                {t("performance.chart.placeholder")}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-300 md:max-w-2xl">
              {t("performance.chart.description")}
            </p>

            <button className="mt-4 md:mt-0 px-4 py-2 bg-nile-teal dark:bg-nile-teal/90 text-white rounded-lg text-sm font-medium hover:bg-nile-teal-dark dark:hover:bg-nile-teal transition-colors">
              Download report
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
