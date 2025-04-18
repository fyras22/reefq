'use client';

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface CustomCursorProps {
  color?: string;
  size?: number;
  ringSize?: number;
  ringColor?: string;
  blendMode?: string;
  trailEffect?: boolean;
  disableOnMobile?: boolean;
}

export default function CustomCursor({
  color = '#2A5B5E', // nile-teal color
  size = 10,
  ringSize = 40,
  ringColor = 'rgba(196, 162, 101, 0.5)', // pharaonic-gold with opacity
  blendMode = 'normal',
  trailEffect = true,
  disableOnMobile = true,
}: CustomCursorProps) {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Add spring physics for smoother cursor movement
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if it's a touch device
  useEffect(() => {
    const checkIsMobile = () => {
      const isTouchDevice = 
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 || 
        // @ts-ignore
        navigator.msMaxTouchPoints > 0;
      
      const isMobileViewport = window.innerWidth <= 768;
      setIsMobile(isTouchDevice || isMobileViewport);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    if (isMobile && disableOnMobile) return;
    
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };
    
    const handleMouseDown = () => setIsActive(true);
    const handleMouseUp = () => setIsActive(false);
    
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if cursor is over a clickable element
      const isClickable: boolean = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'SELECT' ||
        !!target.closest('a') || 
        !!target.closest('button') ||
        target.getAttribute('role') === 'button' ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsPointer(isClickable);
    };
    
    const handleMouseLeave = () => {
      setIsVisible(false);
    };
    
    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, disableOnMobile, isMobile]);

  if (isMobile && disableOnMobile) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 z-50 rounded-full pointer-events-none mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          width: isPointer ? size * 0.5 : size,
          height: isPointer ? size * 0.5 : size,
          backgroundColor: color,
          mixBlendMode: blendMode as any,
          opacity: isVisible ? 1 : 0,
          transform: `translate(-50%, -50%)`,
        }}
        animate={{
          scale: isActive ? 0.5 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
      
      {/* Cursor ring */}
      <motion.div
        className="fixed top-0 left-0 z-50 rounded-full border-2 pointer-events-none"
        style={{
          x: trailEffect ? cursorX : cursorXSpring,
          y: trailEffect ? cursorY : cursorYSpring,
          width: isPointer ? ringSize * 1.5 : ringSize,
          height: isPointer ? ringSize * 1.5 : ringSize,
          borderColor: ringColor,
          backgroundColor: 'transparent',
          mixBlendMode: blendMode as any,
          opacity: isVisible ? 1 : 0,
          transform: `translate(-50%, -50%)`,
        }}
        animate={{
          scale: isActive ? 0.8 : 1,
        }}
        transition={{ duration: 0.2, ease: 'circOut' }}
      />
      
      {/* Hide default cursor */}
      {isVisible && (
        <style jsx global>{`
          body {
            cursor: none !important;
          }
          a, button, input, textarea, select, [role="button"], [style*="cursor: pointer"] {
            cursor: none !important;
          }
        `}</style>
      )}
    </>
  );
} 