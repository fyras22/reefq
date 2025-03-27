'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface CircleLoaderProps {
  onLoadingComplete?: () => void;
  duration?: number; // Total duration in milliseconds
  size?: 'default' | 'large'; // Size variant
}

export default function CircleLoader({ 
  onLoadingComplete, 
  duration = 3000, // Changed to 3 seconds default
  size = 'default'
}: CircleLoaderProps) {
  const [loading, setLoading] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const [finalReveal, setFinalReveal] = useState(false);
  
  // Handle the loading animation sequence
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowLogo(true);
    }, duration * 0.3); // Show logo earlier at 30% of the animation
    
    const timer2 = setTimeout(() => {
      setFinalReveal(true);
    }, duration * 0.6); // Final reveal at 60%
    
    const timer3 = setTimeout(() => {
      setLoading(false);
      if (onLoadingComplete) onLoadingComplete();
    }, duration);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [duration, onLoadingComplete]);

  // Size variants - using much larger sizes
  const circleSizes = {
    default: {
      outer: "w-64 h-64",
      inner: "w-48 h-48",
      logo: "w-36 h-36" // Fixed logo size - not too small, not too large
    },
    large: {
      outer: "w-80 h-80",
      inner: "w-60 h-60",
      logo: "w-48 h-48" // Fixed logo size for large variant
    }
  };
  
  const sizeVariant = circleSizes[size];
  
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }} // Faster transition
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
        >
          <div className="relative flex items-center justify-center">
            {/* First animated circle - fades out during final reveal */}
            <motion.div
              initial={{ scale: 0, rotate: 0, opacity: 1 }}
              animate={{ 
                scale: 1,
                rotate: 360,
                opacity: finalReveal ? 0 : 1,
                borderColor: ["#178086", "#C4A265", "#178086"]
              }}
              transition={{ 
                duration: 2, // Faster rotation
                repeat: finalReveal ? 0 : Infinity,
                repeatType: "loop",
                ease: "linear",
                times: [0, 0.5, 1],
                opacity: { duration: 0.4 } // Faster fade out
              }}
              className={`absolute ${sizeVariant.outer} border-t-8 border-b-8 rounded-full shadow-lg`}
            />
            
            {/* Second animated circle - fades out during final reveal */}
            <motion.div
              initial={{ scale: 0, rotate: 0, opacity: 1 }}
              animate={{ 
                scale: 1,
                rotate: -360,
                opacity: finalReveal ? 0 : 1,
                borderColor: ["#C4A265", "#178086", "#C4A265"]
              }}
              transition={{ 
                duration: 2, // Faster rotation
                repeat: finalReveal ? 0 : Infinity,
                repeatType: "loop",
                ease: "linear",
                times: [0, 0.5, 1],
                delay: 0.1, // Shorter delay
                opacity: { duration: 0.4 } // Faster fade out
              }}
              className={`absolute ${sizeVariant.inner} border-l-8 border-r-8 rounded-full shadow-lg`}
            />
            
            {/* Logo remains at consistent size */}
            {showLogo && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1,
                  opacity: 1
                }}
                transition={{ 
                  duration: 0.3, // Faster animation
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                className="relative z-10"
              >
                <div className={`relative ${sizeVariant.logo}`}>
                  <Image
                    src="/logo.png"
                    alt="ReefQ Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 