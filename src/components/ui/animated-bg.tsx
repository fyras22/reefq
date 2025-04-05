'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Define the FloatingElementsBgProps type
type FloatingElementsBgProps = {
  variant?: 'purple' | 'blue' | 'green' | 'amber';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
};

interface AnimatedBgProps {
  variant?: 'purple' | 'blue' | 'green';
  intensity?: 'light' | 'medium' | 'strong';
  className?: string;
}

export default function AnimatedBg({
  variant = 'purple',
  intensity = 'medium',
  className = '',
}: AnimatedBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Get color scheme based on variant
  const getColors = () => {
    switch (variant) {
      case 'blue':
        return {
          primary: '#3b82f6',
          secondary: '#2563eb',
          tertiary: '#1d4ed8',
          quaternary: '#60a5fa',
        };
      case 'green':
        return {
          primary: '#10b981',
          secondary: '#059669',
          tertiary: '#047857',
          quaternary: '#34d399',
        };
      case 'purple':
      default:
        return {
          primary: '#8b5cf6',
          secondary: '#7c3aed',
          tertiary: '#6d28d9',
          quaternary: '#a78bfa',
        };
    }
  };
  
  // Get opacity based on intensity
  const getOpacity = () => {
    switch (intensity) {
      case 'light': return 0.07;
      case 'strong': return 0.18;
      case 'medium':
      default: return 0.12;
    }
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const colors = getColors();
    const opacity = getOpacity();
    
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    
    // Create gradient circles
    const circles = [
      { x: width * 0.25, y: height * 0.3, radius: width * 0.2, color: colors.primary, vx: 0.3, vy: 0.1 },
      { x: width * 0.7, y: height * 0.5, radius: width * 0.25, color: colors.secondary, vx: -0.2, vy: 0.2 },
      { x: width * 0.5, y: height * 0.8, radius: width * 0.3, color: colors.tertiary, vx: 0.1, vy: -0.25 },
      { x: width * 0.15, y: height * 0.7, radius: width * 0.15, color: colors.quaternary, vx: -0.15, vy: -0.1 },
    ];
    
    // Handle resize
    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      
      // Adjust circle positions on resize
      circles[0].x = width * 0.25;
      circles[0].y = height * 0.3;
      circles[0].radius = width * 0.2;
      
      circles[1].x = width * 0.7;
      circles[1].y = height * 0.5;
      circles[1].radius = width * 0.25;
      
      circles[2].x = width * 0.5;
      circles[2].y = height * 0.8;
      circles[2].radius = width * 0.3;
      
      circles[3].x = width * 0.15;
      circles[3].y = height * 0.7;
      circles[3].radius = width * 0.15;
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    let animationId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw circles
      circles.forEach(circle => {
        // Move circles
        circle.x += circle.vx;
        circle.y += circle.vy;
        
        // Bounce off edges
        if (circle.x < 0 || circle.x > width) circle.vx *= -1;
        if (circle.y < 0 || circle.y > height) circle.vy *= -1;
        
        // Draw gradient circle
        const gradient = ctx.createRadialGradient(
          circle.x, circle.y, 0,
          circle.x, circle.y, circle.radius
        );
        
        gradient.addColorStop(0, `${circle.color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${circle.color}00`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [variant, intensity]);
  
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{ opacity: getOpacity() * 2.5 }}
      />
    </div>
  );
}

// Animated background with floating elements
export function FloatingElementsBg({
  variant = 'purple',
  intensity = 'medium',
  className = '',
}: FloatingElementsBgProps) {
  // Get color scheme based on variant
  const getColors = () => {
    switch (variant) {
      case 'purple':
        return ['rgba(139, 92, 246, 0.2)', 'rgba(124, 58, 237, 0.2)', 'rgba(109, 40, 217, 0.2)'];
      case 'blue':
        return ['rgba(96, 165, 250, 0.2)', 'rgba(59, 130, 246, 0.2)', 'rgba(37, 99, 235, 0.2)'];
      case 'green':
        return ['rgba(52, 211, 153, 0.2)', 'rgba(16, 185, 129, 0.2)', 'rgba(5, 150, 105, 0.2)'];
      case 'amber':
        return ['rgba(251, 191, 36, 0.2)', 'rgba(245, 158, 11, 0.2)', 'rgba(217, 119, 6, 0.2)'];
      default:
        return ['rgba(139, 92, 246, 0.2)', 'rgba(124, 58, 237, 0.2)', 'rgba(109, 40, 217, 0.2)'];
    }
  };

  // Get the number of elements and animation settings based on intensity
  const getIntensitySettings = () => {
    switch (intensity) {
      case 'low':
        return { 
          count: 10, 
          speedMultiplier: 0.7,
          opacityMin: 0.3,
          opacityMax: 0.5
        };
      case 'high':
        return { 
          count: 30, 
          speedMultiplier: 1.3,
          opacityMin: 0.5,
          opacityMax: 0.8
        };
      case 'medium':
      default:
        return { 
          count: 20, 
          speedMultiplier: 1,
          opacityMin: 0.4,
          opacityMax: 0.7
        };
    }
  };

  const intensitySettings = getIntensitySettings();
  const colors = getColors();

  // Update to use intensity for generating elements
  const elements = Array.from({ length: intensitySettings.count }).map((_, i) => {
    const size = Math.random() * 100 + 50;
    const xPos = Math.random() * 100;
    const yPos = Math.random() * 100;
    const duration = (Math.random() * 20 + 15) / intensitySettings.speedMultiplier;
    const delay = Math.random() * 10;
    const opacity = Math.random() * 
      (intensitySettings.opacityMax - intensitySettings.opacityMin) + 
      intensitySettings.opacityMin;
    
    return (
      <motion.div
        key={i}
        className="rounded-full absolute"
        style={{
          width: size,
          height: size,
          left: `${xPos}%`,
          top: `${yPos}%`,
          backgroundColor: colors[i % colors.length],
          opacity,
          zIndex: 0,
        }}
        animate={{
          x: [
            -(Math.random() * 20),
            Math.random() * 20,
            -(Math.random() * 20),
          ],
          y: [
            -(Math.random() * 20),
            Math.random() * 20,
            -(Math.random() * 20),
          ],
        }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay,
        }}
      />
    );
  });

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {elements}
    </div>
  );
} 