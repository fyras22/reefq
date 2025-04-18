'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TFunction } from 'i18next';
import { ArrowsRightLeftIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ComparisonToolSectionProps {
  t: TFunction;
  isRTL: boolean;
}

export default function ComparisonToolSection({ t, isRTL }: ComparisonToolSectionProps) {
  const [activeTab, setActiveTab] = useState('reefq');

  const features = [
    { id: 'feature1', name: t('comparison.features.feature1') },
    { id: 'feature2', name: t('comparison.features.feature2') },
    { id: 'feature3', name: t('comparison.features.feature3') },
    { id: 'feature4', name: t('comparison.features.feature4') },
    { id: 'feature5', name: t('comparison.features.feature5') },
    { id: 'feature6', name: t('comparison.features.feature6') },
    { id: 'feature7', name: t('comparison.features.feature7') },
    { id: 'feature8', name: t('comparison.features.feature8') },
  ];

  const competitors = {
    reefq: {
      name: 'ReefQ',
      features: {
        feature1: true,
        feature2: true,
        feature3: true,
        feature4: true,
        feature5: true,
        feature6: true,
        feature7: true,
        feature8: true,
      }
    },
    competitor1: {
      name: t('comparison.competitors.competitor1'),
      features: {
        feature1: true,
        feature2: true,
        feature3: false,
        feature4: true,
        feature5: false,
        feature6: false,
        feature7: true,
        feature8: false,
      }
    },
    competitor2: {
      name: t('comparison.competitors.competitor2'),
      features: {
        feature1: true,
        feature2: false,
        feature3: true,
        feature4: false,
        feature5: true,
        feature6: false,
        feature7: false,
        feature8: false,
      }
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            {t('comparison.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-2xl text-lg text-gray-600 mx-auto"
          >
            {t('comparison.description')}
          </motion.p>
        </div>

        <div className="mt-16">
          <div className="sm:hidden">
            <label htmlFor="competitor-select" className="sr-only">
              {t('comparison.selectCompetitor')}
            </label>
            <select
              id="competitor-select"
              className="block w-full rounded-md border-gray-300 focus:border-nile-teal focus:ring-nile-teal"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              {Object.keys(competitors).map((key) => (
                <option key={key} value={key}>
                  {competitors[key as keyof typeof competitors].name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="hidden sm:block">
            <nav className="flex space-x-4 justify-center" aria-label="Tabs">
              {Object.keys(competitors).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === key
                      ? 'bg-nile-teal text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  aria-current={activeTab === key ? 'page' : undefined}
                >
                  {competitors[key as keyof typeof competitors].name}
                </button>
              ))}
            </nav>
          </div>
          
          <motion.div 
            className="mt-8 bg-white rounded-lg overflow-hidden shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    {t('comparison.feature')}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {competitors.reefq.name}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {activeTab !== 'reefq' && competitors[activeTab as keyof typeof competitors].name}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {features.map((feature) => (
                  <tr key={feature.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {feature.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {competitors.reefq.features[feature.id as keyof typeof competitors.reefq.features] ? (
                        <CheckIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <XMarkIcon className="h-5 w-5 text-red-500" />
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {activeTab !== 'reefq' && (
                        competitors[activeTab as keyof typeof competitors].features[feature.id as keyof typeof competitors.reefq.features] ? (
                          <CheckIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <XMarkIcon className="h-5 w-5 text-red-500" />
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
          
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <a
              href="#"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-nile-teal hover:bg-nile-teal-dark"
            >
              {t('comparison.cta')}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 