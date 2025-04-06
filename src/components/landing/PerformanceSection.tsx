"use client";

import { TFunction } from 'i18next';
import { motion } from 'framer-motion';

interface Metric {
  id: string;
  icon: JSX.Element;
  titleKey: string;
  value: string;
  unitKey: string;
  avgKey: string;
  avgValue: string;
  comparisonKey: string;
  percentage: number;
  color: 'nile-teal' | 'pharaonic-gold';
}

interface PerformanceSectionProps {
  t: TFunction<any, undefined>;
}

const PerformanceSection: React.FC<PerformanceSectionProps> = ({ t }) => {

  const metrics: Metric[] = [
    {
      id: 'speed',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-nile-teal">
          <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clipRule="evenodd" />
        </svg>
      ),
      titleKey: 'performance.metric1.title',
      value: '0.7s',
      unitKey: 'performance.metric1.unit',
      avgKey: 'performance.metric1.avgLabel',
      avgValue: '2.1s',
      comparisonKey: 'performance.metric1.comparison',
      percentage: 85,
      color: 'nile-teal'
    },
    {
      id: 'accuracy',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-pharaonic-gold">
          <path d="M12 .75a8.25 8.25 0 00-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 00.577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 01-.937-.171.75.75 0 11.374-1.453 5.261 5.261 0 002.626 0 .75.75 0 11.374 1.452 6.712 6.712 0 01-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 00.577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0012 .75z" />
          <path fillRule="evenodd" d="M9.013 19.9a.75.75 0 01.877-.597 11.319 11.319 0 004.22 0 .75.75 0 11.28 1.473 12.819 12.819 0 01-4.78 0 .75.75 0 01-.597-.876zM9.754 22.344a.75.75 0 01.824-.668 13.682 13.682 0 002.844 0 .75.75 0 11.156 1.492 15.156 15.156 0 01-3.156 0 .75.75 0 01-.668-.824z" clipRule="evenodd" />
        </svg>
      ),
      titleKey: 'performance.metric2.title',
      value: '98.2%',
      unitKey: 'performance.metric2.unit',
      avgKey: 'performance.metric2.avgLabel',
      avgValue: '86%',
      comparisonKey: 'performance.metric2.comparison',
      percentage: 98,
      color: 'pharaonic-gold'
    },
    {
      id: 'dataUsage',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-pharaonic-gold">
          <path d="M4.08 5.227A3 3 0 016.979 3H17.02a3 3 0 012.9 2.227l2.113 7.926A5.228 5.228 0 0018.75 12H5.25a5.228 5.228 0 00-3.284 1.153L4.08 5.227z" />
          <path fillRule="evenodd" d="M5.25 13.5a3.75 3.75 0 100 7.5h13.5a3.75 3.75 0 100-7.5H5.25zm0 4.5a.75.75 0 010-1.5h13.5a.75.75 0 010 1.5H5.25z" clipRule="evenodd" />
        </svg>
      ),
      titleKey: 'performance.metric3.title',
      value: '1.3MB',
      unitKey: 'performance.metric3.unit',
      avgKey: 'performance.metric3.avgLabel',
      avgValue: '5.8MB',
      comparisonKey: 'performance.metric3.comparison',
      percentage: 75,
      color: 'pharaonic-gold'
    },
    {
      id: 'deviceSupport',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-nile-teal">
          <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
      titleKey: 'performance.metric4.title',
      value: '96%',
      unitKey: 'performance.metric4.unit',
      avgKey: 'performance.metric4.avgLabel',
      avgValue: '', // No avg value for this one in the original code
      comparisonKey: 'performance.metric4.comparison',
      percentage: 96,
      color: 'nile-teal'
    },
  ];

  const chartData = [35, 45, 60, 50, 70, 65, 80, 90, 85, 70, 75, 65];

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
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
  
  const visualVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <motion.section 
      id="performance" 
      className="py-24 bg-gradient-to-br from-gray-50 to-pharaonic-gold/5 overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16 items-center">
            {/* Left Side: Performance Stats */}
            <motion.div variants={itemVariants}>
              <span className="inline-block px-3 py-1 text-sm font-medium bg-nile-teal/10 text-nile-teal rounded-full mb-3">
                {t('performance.badge')}
              </span>
              <h2 className="text-3xl font-bold text-gray-900 font-serif mb-6">
                {t('performance.title')}
              </h2>
              <p className="text-gray-600 mb-10">
                {t('performance.description')}
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                {metrics.map((metric) => (
                  <motion.div 
                    key={metric.id} 
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                    variants={itemVariants}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {metric.icon}
                      <h3 className="font-semibold text-gray-900">{t(metric.titleKey)}</h3>
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
                      <span className="text-sm text-gray-500 mb-1">{t(metric.unitKey)}</span>
                    </div>
                    <div className="mt-3">
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div 
                          className={`h-2 ${metric.color === 'nile-teal' ? 'bg-nile-teal' : 'bg-pharaonic-gold'} rounded-full`}
                          style={{ width: `${metric.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{t(metric.avgKey)} {metric.avgValue}</span>
                        <span>{t(metric.comparisonKey)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Right Side: Visual Demo */}
            <motion.div className="relative" variants={visualVariants}>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-nile-teal">
                      <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4.5 7.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0V12zm2.25-3a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V9.75A.75.75 0 0113.5 9zm3.75-1.5a.75.75 0 00-1.5 0v9a.75.75 0 001.5 0v-9z" clipRule="evenodd" />
                    </svg>
                    <h3 className="font-medium text-gray-900">{t('performance.monitor.title')}</h3>
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-500">{t('performance.monitor.live')}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Performance Simulation */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-gray-700">{t('performance.monitor.chartTitle')}</h4>
                      <span className="text-xs text-gray-500">{t('performance.monitor.chartSubtitle')}</span>
                    </div>
                    <div className="h-40 flex items-end gap-1">
                      {chartData.map((value, index) => (
                        <motion.div 
                          key={index} 
                          className={`w-full ${index === 7 ? 'bg-pharaonic-gold' : 'bg-nile-teal/60'} rounded-t`} 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: `${value}%`, opacity: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                          title={`${value}%`}
                        ></motion.div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>{t('performance.monitor.timeLabel1')}</span>
                      <span>{t('performance.monitor.timeLabel2')}</span>
                      <span>{t('performance.monitor.timeLabel3')}</span>
                      <span>{t('performance.monitor.timeLabel4')}</span>
                      <span>{t('performance.monitor.timeLabel5')}</span>
                      <span>{t('performance.monitor.timeLabel6')}</span>
                    </div>
                  </div>
                  
                  {/* Network Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <motion.div className="bg-nile-teal/5 rounded-lg p-4" variants={itemVariants}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">{t('performance.monitor.stat1.label')}</span>
                        <span className="text-xs text-green-600 font-medium">{t('performance.monitor.stat1.change')}</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">{t('performance.monitor.stat1.value')}</span>
                        <span className="text-xs text-gray-500">{t('performance.monitor.stat1.context')}</span>
                      </div>
                    </motion.div>
                    
                    <motion.div className="bg-pharaonic-gold/5 rounded-lg p-4" variants={itemVariants}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">{t('performance.monitor.stat2.label')}</span>
                        <span className="text-xs text-green-600 font-medium">{t('performance.monitor.stat2.change')}</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">{t('performance.monitor.stat2.value')}</span>
                        <span className="text-xs text-gray-500">{t('performance.monitor.stat2.context')}</span>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Device Compatibility */}
                  <motion.div className="bg-gray-50 rounded-lg p-4" variants={itemVariants}>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">{t('performance.monitor.compatibilityTitle')}</h4>
                    <div className="space-y-2">
                      {[ // Assuming percentages from original code
                        { labelKey: 'performance.monitor.compat1.label', percentage: 98 },
                        { labelKey: 'performance.monitor.compat2.label', percentage: 99 },
                        { labelKey: 'performance.monitor.compat3.label', percentage: 92 },
                      ].map((compat, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">{t(compat.labelKey)}</span>
                            <span className="text-gray-900 font-medium">{compat.percentage}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <motion.div 
                              className="h-2 bg-nile-teal rounded-full" 
                              initial={{ width: 0 }}
                              animate={{ width: `${compat.percentage}%` }}
                              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                            ></motion.div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Decorative Elements - kept outside motion for simplicity */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-pharaonic-gold/10 rounded-full -z-10 hidden lg:block"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-nile-teal/10 rounded-full -z-10 hidden lg:block"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default PerformanceSection; 