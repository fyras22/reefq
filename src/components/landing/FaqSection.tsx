"use client";

import { TFunction } from 'i18next';
import { motion } from 'framer-motion';
import { FaqItem } from '@/components/landing/FaqItem'; // Corrected named import

interface Faq {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  t: TFunction<any, undefined>;
  faqs: Faq[];
  // isRTL is not explicitly used in the extracted JSX for animations here, 
  // but keeping it for potential future use or consistency
  isRTL: boolean; 
}

const FaqSection: React.FC<FaqSectionProps> = ({ t, faqs, isRTL }) => {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Reusing itemVariants from FaqItem or defining specific ones if needed
  const faqItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: i * 0.1, // Stagger animation based on index
      },
    }),
  };

  return (
    <motion.section 
      id="faq" 
      className="py-24 sm:py-32 bg-white"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div className="mx-auto max-w-2xl lg:text-center" variants={headingVariants}>
          <p className="text-base font-medium uppercase tracking-wider text-pharaonic-gold">{t('faq.title')}</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-nile-teal sm:text-4xl font-serif">
            {t('faq.subtitle')}
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {t('faq.description')}
          </p>
        </motion.div>
        <div className="mx-auto mt-16 max-w-2xl lg:mt-20">
          <div className="divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question} // Use question as key if unique, otherwise consider an ID
                custom={index} // Pass index to variants for staggering
                variants={faqItemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {/* Pass t and isRTL to FaqItem if needed internally */}
                <FaqItem question={t(faq.question)} answer={t(faq.answer)} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default FaqSection; 