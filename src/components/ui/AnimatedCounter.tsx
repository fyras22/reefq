'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInView, motion } from 'framer-motion';

interface AnimatedCounterProps {
  start?: number;
  end: number;
  duration?: number;
  delay?: number;
  formatter?: (value: number) => string;
  prefix?: string;
  suffix?: string;
  className?: string;
  animated?: boolean;
}

export default function AnimatedCounter({
  start = 0,
  end,
  duration = 1.5,
  delay = 0,
  formatter = (value: number) => Math.round(value).toString(),
  prefix = '',
  suffix = '',
  className = '',
  animated = true
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(start);
  const counterRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(counterRef, { once: true, margin: '0px 0px -100px 0px' });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (!animated) {
      setDisplayValue(end);
      return;
    }
    
    if (inView) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        const currentValue = start + (end - start) * progress;
        
        setDisplayValue(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      
      // Apply delay if specified
      if (delay > 0) {
        timerRef.current = setTimeout(() => {
          requestAnimationFrame(step);
        }, delay * 1000);
      } else {
        requestAnimationFrame(step);
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [start, end, duration, delay, inView, animated]);
  
  return (
    <motion.span
      ref={counterRef}
      className={className}
      initial={{ opacity: 0, y: 15 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
      transition={{ duration: 0.5, delay: delay }}
    >
      {prefix}{formatter(displayValue)}{suffix}
    </motion.span>
  );
} 