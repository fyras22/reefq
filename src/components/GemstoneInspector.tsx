'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface GemstoneInspectorProps {
  gemstone?: {
    id: string;
    name: string;
    images: string[];
    description: string;
  };
  gemType?: "diamond" | "ruby" | "sapphire" | "emerald";
  carat?: number;
  quality?: string;
  onInspectionComplete?: (details: any) => void;
}

const GemstoneInspector = ({ 
  gemstone,
  gemType = "diamond",
  carat = 1,
  quality = "good",
  onInspectionComplete
}: GemstoneInspectorProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Use the passed properties or defaults
  const gemImages = gemstone?.images || [
    `/images/gemstones/${gemType}/1.jpg`, 
    `/images/gemstones/${gemType}/2.jpg`,
    `/images/gemstones/${gemType}/3.jpg`
  ];
  
  const gemName = gemstone?.name || `${quality.charAt(0).toUpperCase() + quality.slice(1)} ${carat} Carat ${gemType.charAt(0).toUpperCase() + gemType.slice(1)}`;
  const gemDescription = gemstone?.description || `This is a beautiful ${quality} quality ${carat} carat ${gemType}. It has excellent cut, clarity, and color.`;

  // Call onInspectionComplete after component mounts
  useEffect(() => {
    if (onInspectionComplete) {
      const timer = setTimeout(() => {
        onInspectionComplete({
          gemType,
          carat,
          quality,
          inspectionTime: new Date().toISOString()
        });
      }, 3000); // Call after 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [gemType, carat, quality, onInspectionComplete]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoom) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setPosition({ x, y });
  };

  const toggleZoom = () => {
    setZoom(!zoom);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % gemImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + gemImages.length) % gemImages.length);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-1/2">
        <div 
          className={`relative rounded-lg overflow-hidden aspect-square ${zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
          onClick={toggleZoom}
          onMouseMove={handleMouseMove}
        >
          <div className="absolute top-2 right-2 z-10">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleZoom();
              }} 
              className="bg-white p-2 rounded-full shadow-md"
            >
              <ArrowsPointingOutIcon className="h-5 w-5 text-gray-700" />
            </button>
          </div>
          
          <div className="relative h-full w-full">
            <Image
              src={gemImages[currentImage] || '/images/gemstones/default.jpg'}
              alt={gemName}
              fill
              className={`object-cover transition-transform duration-200 ${zoom ? 'scale-150' : 'scale-100'}`}
              style={zoom ? { transformOrigin: `${position.x}% ${position.y}%` } : {}}
            />
          </div>
        </div>
        
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {gemImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 ${
                currentImage === index ? 'ring-2 ring-nile-teal' : 'opacity-70'
              }`}
            >
              <Image
                src={image || '/images/gemstones/default.jpg'}
                alt={`${gemName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
      
      <div className="lg:w-1/2">
        <h1 className="text-2xl font-bold text-gray-900">{gemName}</h1>
        
        <div className="mt-4 prose prose-sm text-gray-700">
          <p>{gemDescription}</p>
        </div>
        
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900">Gemstone Properties</h2>
          <dl className="mt-2 border-t border-gray-200">
            <div className="py-3 flex justify-between border-b border-gray-200">
              <dt className="text-sm font-medium text-gray-500">Hardness</dt>
              <dd className="text-sm text-gray-900">7.5-8 Mohs</dd>
            </div>
            <div className="py-3 flex justify-between border-b border-gray-200">
              <dt className="text-sm font-medium text-gray-500">Refractive Index</dt>
              <dd className="text-sm text-gray-900">1.762-1.770</dd>
            </div>
            <div className="py-3 flex justify-between border-b border-gray-200">
              <dt className="text-sm font-medium text-gray-500">Density</dt>
              <dd className="text-sm text-gray-900">3.90-4.05 g/cm³</dd>
            </div>
            <div className="py-3 flex justify-between border-b border-gray-200">
              <dt className="text-sm font-medium text-gray-500">Origin</dt>
              <dd className="text-sm text-gray-900">Various</dd>
            </div>
          </dl>
        </div>
        
        <div className="mt-8 flex gap-4">
          <button className="flex-1 bg-nile-teal text-white py-2 px-4 rounded-md hover:bg-nile-teal-dark transition-colors">
            Add to Cart
          </button>
          <button className="flex items-center justify-center bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-colors">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GemstoneInspector; 