"use client";

import Image from 'next/image';
import Link from 'next/link';
import { TFunction } from 'i18next';
import { motion } from 'framer-motion';

interface ComparisonItem {
  titleKey: string;
  descKey: string;
}

interface ComparisonColumnProps {
  titleKey: string;
  imageSrc: string;
  imageAltKey: string;
  items: ComparisonItem[];
  isDigital: boolean;
  t: TFunction<any, undefined>;
}

const ComparisonColumn: React.FC<ComparisonColumnProps> = ({ 
  titleKey, imageSrc, imageAltKey, items, isDigital, t 
}) => {
  const columnVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: isDigital ? 20 : -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  const bgColor = isDigital ? 'bg-white' : 'bg-gray-50';
  const borderColor = isDigital ? 'border-nile-teal/20' : 'border-gray-100';
  const imageBgColor = isDigital ? 'bg-nile-teal/10' : 'bg-gray-200';
  const imageOverlayColor = isDigital ? 'bg-nile-teal/40' : 'bg-black/30';
  const stepBgColor = isDigital ? 'bg-nile-teal/10' : 'bg-gray-200';
  const stepTextColor = isDigital ? 'text-nile-teal' : 'text-gray-600';

  return (
    <motion.div 
      className={`${bgColor} rounded-xl overflow-hidden shadow-sm border ${borderColor}`}
      variants={columnVariants} 
    >
      <div className={`h-64 ${imageBgColor} overflow-hidden relative`}>
        <Image 
          src={imageSrc} 
          alt={t(imageAltKey)}
          width={600}
          height={400}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className={`absolute inset-0 ${imageOverlayColor} flex items-center justify-center`}>
          <h3 className="text-2xl font-bold text-white text-center px-4">{t(titleKey)}</h3>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {items.map((item, index) => (
            <motion.div key={index} className="flex items-start gap-3" variants={itemVariants}>
              <div className={`w-6 h-6 rounded-full ${stepBgColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <span className={`text-sm font-medium ${stepTextColor}`}>{index + 1}</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">{t(item.titleKey)}</h4>
                <p className="text-sm text-gray-600">{t(item.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

interface ComparisonToolSectionProps {
  t: TFunction<any, undefined>;
  isRTL: boolean;
}

const ComparisonToolSection: React.FC<ComparisonToolSectionProps> = ({ t, isRTL }) => {
  const traditionalItems: ComparisonItem[] = [
    { titleKey: 'comparison.traditional.item1Title', descKey: 'comparison.traditional.item1Desc' },
    { titleKey: 'comparison.traditional.item2Title', descKey: 'comparison.traditional.item2Desc' },
    { titleKey: 'comparison.traditional.item3Title', descKey: 'comparison.traditional.item3Desc' },
    { titleKey: 'comparison.traditional.item4Title', descKey: 'comparison.traditional.item4Desc' },
    { titleKey: 'comparison.traditional.item5Title', descKey: 'comparison.traditional.item5Desc' },
  ];

  const digitalItems: ComparisonItem[] = [
    { titleKey: 'comparison.digital.item1Title', descKey: 'comparison.digital.item1Desc' },
    { titleKey: 'comparison.digital.item2Title', descKey: 'comparison.digital.item2Desc' },
    { titleKey: 'comparison.digital.item3Title', descKey: 'comparison.digital.item3Desc' },
    { titleKey: 'comparison.digital.item4Title', descKey: 'comparison.digital.item4Desc' },
    { titleKey: 'comparison.digital.item5Title', descKey: 'comparison.digital.item5Desc' },
  ];

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const ctaVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.5 } }
  };

  return (
    <motion.section 
      id="comparison" 
      className="py-24 bg-white overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" variants={headingVariants}>
            <span className="inline-block px-3 py-1 text-sm font-medium bg-nile-teal/10 text-nile-teal rounded-full mb-3">
              {t('comparison.badge')}
            </span>
            <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">
              {t('comparison.title')}
            </h2>
            <p className="mt-2 text-lg text-gray-600 max-w-3xl mx-auto">
              {t('comparison.subtitle')}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ComparisonColumn 
              titleKey="comparison.traditional.title"
              imageSrc="/images/traditional-jewelry-market.jpg"
              imageAltKey="comparison.traditional.imageAlt"
              items={traditionalItems}
              isDigital={false}
              t={t}
            />
            <ComparisonColumn 
              titleKey="comparison.digital.title"
              imageSrc="/images/digital-jewelry-experience.jpg"
              imageAltKey="comparison.digital.imageAlt"
              items={digitalItems}
              isDigital={true}
              t={t}
            />
          </div>
          
          <motion.div className="mt-12 text-center" variants={ctaVariants}>
            <Link 
              href="/explore"
              className={`inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-nile-teal hover:bg-nile-teal/90 hover:shadow-lg transition-all group ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              {t('comparison.ctaButton')}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${isRTL ? 'mr-2 transform rotate-180' : 'ml-2'} transition-transform group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'}`}>
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clipRule="evenodd" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default ComparisonToolSection; 