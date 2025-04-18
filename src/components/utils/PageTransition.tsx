'use client';

import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TransitionType = 'fade' | 'slide' | 'scale' | 'flip' | 'none';

interface PageTransitionProps {
  children: ReactNode;
  type?: TransitionType;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  className?: string;
}

export default function PageTransition({
  children,
  type = 'fade',
  direction = 'up',
  duration = 0.5,
  className = '',
}: PageTransitionProps) {
  // Define variants based on transition type and direction
  const getVariants = () => {
    switch (type) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 },
        };
      case 'slide':
        let initial = {};
        let exit = {};
        
        switch (direction) {
          case 'left':
            initial = { x: -100, opacity: 0 };
            exit = { x: 100, opacity: 0 };
            break;
          case 'right':
            initial = { x: 100, opacity: 0 };
            exit = { x: -100, opacity: 0 };
            break;
          case 'up':
            initial = { y: 100, opacity: 0 };
            exit = { y: -100, opacity: 0 };
            break;
          case 'down':
            initial = { y: -100, opacity: 0 };
            exit = { y: 100, opacity: 0 };
            break;
        }
        
        return {
          hidden: initial,
          visible: { x: 0, y: 0, opacity: 1 },
          exit: exit,
        };
      case 'scale':
        return {
          hidden: { scale: 0.8, opacity: 0 },
          visible: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 },
        };
      case 'flip':
        return {
          hidden: { rotateY: 90, opacity: 0 },
          visible: { rotateY: 0, opacity: 1 },
          exit: { rotateY: 90, opacity: 0 },
        };
      case 'none':
      default:
        return {
          hidden: {},
          visible: {},
          exit: {},
        };
    }
  };

  const variants = getVariants();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={className}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={variants}
        transition={{ 
          duration: duration, 
          ease: [0.25, 0.1, 0.25, 1.0] // Cubic bezier easing for smooth transitions
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
} 