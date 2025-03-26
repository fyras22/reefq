'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface CircleLoaderProps {
  onLoadingComplete?: () => void;
  duration?: number; // Total duration in milliseconds
}

export default function CircleLoader({ 
  onLoadingComplete, 
  duration = 3000 
}: CircleLoaderProps) {
  const [loading, setLoading] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  
  // Handle the loading animation sequence
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowLogo(true);
    }, duration * 0.7); // Show logo at 70% of the animation
    
    const timer2 = setTimeout(() => {
      setLoading(false);
      if (onLoadingComplete) onLoadingComplete();
    }, duration);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [duration, onLoadingComplete]);
  
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
        >
          <div className="relative flex items-center justify-center">
            {/* First animated circle */}
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ 
                scale: [0, 1, 1.2, 1],
                rotate: [0, 180, 360],
                borderColor: ["#178086", "#C4A265", "#178086"]
              }}
              transition={{ 
                duration: duration * 0.001 * 2, 
                repeat: showLogo ? 0 : Infinity,
                repeatType: "reverse"
              }}
              className="absolute w-32 h-32 border-t-4 border-b-4 rounded-full"
            />
            
            {/* Second animated circle */}
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ 
                scale: [0, 1.2, 1, 1.2],
                rotate: [0, -180, -360],
                borderColor: ["#C4A265", "#178086", "#C4A265"]
              }}
              transition={{ 
                duration: duration * 0.001 * 2, 
                repeat: showLogo ? 0 : Infinity,
                repeatType: "reverse",
                delay: 0.2
              }}
              className="absolute w-24 h-24 border-l-4 border-r-4 rounded-full"
            />
            
            {/* Logo reveal */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={showLogo ? { 
                scale: [0, 1.2, 1],
                opacity: 1
              } : { scale: 0, opacity: 0 }}
              transition={{ 
                duration: 0.8,
                type: "spring",
                stiffness: 200,
                damping: 10
              }}
              className="relative z-10"
            >
              <Image
                src="/logo.png"
                alt="ReefQ Logo"
                width={220}
                height={80}
                priority
                className="w-auto h-auto max-w-[220px]"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 