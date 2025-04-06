"use client";

import Image from 'next/image';
import Link from 'next/link';
import { TFunction } from 'i18next';
import { motion } from 'framer-motion';

interface VirtualTryOnSectionProps {
  t: TFunction<any, undefined>;
  isRTL: boolean;
}

const VirtualTryOnSection: React.FC<VirtualTryOnSectionProps> = ({ t, isRTL }) => {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };


  return (
    <motion.section 
      id="try-on" 
      className="py-24 bg-gradient-to-br from-nile-teal/5 to-pharaonic-gold/5 overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text & Controls */}
            <motion.div variants={itemVariants}>
              <span className="inline-block px-3 py-1 text-sm font-medium bg-nile-teal/10 text-nile-teal rounded-full mb-3">
                {t('tryOn.badge')}
              </span>
              <h2 className="text-3xl font-bold text-gray-900 font-serif mb-6">
                {t('tryOn.titleLine1')} <br/>{t('tryOn.titleLine2')}
              </h2>
              <p className="text-gray-600 mb-8">
                {t('tryOn.description')}
              </p>
              
              <div className="space-y-6 mb-8">
                {[
                  { icon: 'video', titleKey: 'tryOn.feature1Title', descKey: 'tryOn.feature1Desc' },
                  { icon: 'settings', titleKey: 'tryOn.feature2Title', descKey: 'tryOn.feature2Desc' },
                  { icon: 'share', titleKey: 'tryOn.feature3Title', descKey: 'tryOn.feature3Desc' },
                ].map((feature, index) => (
                  <motion.div key={index} className="flex items-start gap-4" variants={itemVariants}>
                    <div className="w-10 h-10 rounded-lg bg-nile-teal/10 flex items-center justify-center flex-shrink-0">
                      {feature.icon === 'video' && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-nile-teal">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                      )}
                      {feature.icon === 'settings' && (
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-nile-teal">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                           <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                         </svg>
                      )}
                      {feature.icon === 'share' && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-nile-teal">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">{t(feature.titleKey)}</h3>
                      <p className="text-sm text-gray-600">{t(feature.descKey)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 mb-6" variants={itemVariants}>
                <h3 className="font-medium text-gray-900 mb-3">{t('tryOn.typesTitle')}</h3>
                <div className="flex flex-wrap gap-2">
                  {['Earrings', 'Necklaces', 'Bracelets', 'Rings'].map((type, index) => (
                    <button 
                      key={type}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        index === 0 
                          ? 'bg-nile-teal text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {t(`tryOn.types.${type.toLowerCase()}`)}
                    </button>
                  ))}
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Link 
                  href="/try-and-fit" 
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-nile-teal text-white font-medium hover:bg-nile-teal/90 transition-colors shadow-md hover:shadow-lg"
                >
                  {t('tryOn.ctaButton')}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={isRTL ? "M13.5 4.5L6 12m0 0l7.5 7.5M6 12h18" : "M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"} />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Right Column: Interactive Demo */}
            <motion.div className="relative" variants={imageVariants}>
              <div className="aspect-[3/4] bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                {/* Demo Viewport */}
                <div className="relative h-full w-full bg-gray-100 overflow-hidden">
                  {/* Placeholder image */}
                  <Image 
                    src="/images/ar-try-on-demo.jpg"
                    alt={t('tryOn.demoAlt')}
                    className="h-full w-full object-cover"
                    width={400}
                    height={600}
                    priority // Load this image early as it might be above the fold
                  />
                  
                  {/* AR Controls Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button className="w-10 h-10 rounded-full bg-nile-teal flex items-center justify-center text-white shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clipRule="evenodd" />
                          </svg>
                        </button>
                        
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500">{t('tryOn.currentlyTrying')}</p>
                          <p className="text-sm font-medium text-gray-900">{t('tryOn.exampleItem')}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="p-2 rounded-md bg-white shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-700">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </button>
                        <button className="p-2 rounded-md bg-white shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-700">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* AR Badge */}
                  <div className="absolute top-4 right-4 bg-nile-teal text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {t('tryOn.demoBadge')}
                  </div>
                </div>
              </div>
              
              {/* Product Options */}
              <motion.div className="mt-6" variants={itemVariants}>
                <p className="text-sm font-medium text-gray-700 mb-3">{t('tryOn.quickOptions')}</p>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex-shrink-0 w-16 bg-white rounded-lg shadow-sm border border-gray-200 p-1 cursor-pointer hover:border-nile-teal transition-colors">
                      <Image 
                        src={`/images/earring-option-${i}.jpg`} 
                        alt={`${t('tryOn.optionAlt')} ${i}`} 
                        className="w-full aspect-square object-cover rounded"
                        width={64}
                        height={64}
                        loading="lazy" // Lazy load these smaller images
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-pharaonic-gold/10 rounded-full -z-10 hidden lg:block"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-nile-teal/10 rounded-full -z-10 hidden lg:block"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default VirtualTryOnSection; 