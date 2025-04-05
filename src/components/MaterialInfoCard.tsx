'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MetalType, GemstoneType } from '@/data/materialsData';

interface MaterialInfoCardProps {
  material: MetalType | GemstoneType;
  showDetails?: boolean;
  onClick?: () => void;
  selected?: boolean;
  type: 'gemstone' | 'metal';
}

export function MaterialInfoCard({
  material,
  showDetails = false,
  onClick,
  selected = false,
  type
}: MaterialInfoCardProps) {
  const isGemstone = type === 'gemstone';
  const gem = isGemstone ? material as GemstoneType : null;
  const metal = !isGemstone ? material as MetalType : null;
  
  // Create a tag for the price level
  const renderPriceTag = () => {
    const priceLevel = material.price;
    let bgColor = '';
    let label = '';
    
    switch (priceLevel) {
      case 'low':
        bgColor = 'bg-green-100 text-green-800';
        label = 'Affordable';
        break;
      case 'medium':
        bgColor = 'bg-blue-100 text-blue-800';
        label = 'Moderate';
        break;
      case 'high':
        bgColor = 'bg-amber-100 text-amber-800';
        label = 'Premium';
        break;
      case 'very-high':
        bgColor = 'bg-purple-100 text-purple-800';
        label = 'Luxury';
        break;
      default:
        bgColor = 'bg-gray-100 text-gray-800';
        label = 'Unknown';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
        {label}
      </span>
    );
  };
  
  // Display durability rating based on hardness
  const renderDurabilityRating = () => {
    const hardness = material.hardness;
    const maxRating = 5;
    let rating: number;
    
    if (isGemstone) {
      // For gemstones (Mohs scale 1-10)
      rating = Math.round((hardness / 10) * maxRating);
    } else {
      // For metals (typically 1-5 on Mohs)
      rating = Math.round((hardness / 5) * maxRating);
    }
    
    return (
      <div className="flex items-center">
        {Array.from({ length: maxRating }).map((_, index) => (
          <svg 
            key={index}
            className={`w-4 h-4 ${index < rating ? 'text-nile-teal' : 'text-gray-300'}`}
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-xs text-gray-600">
          {isGemstone ? `${hardness}/10 Mohs` : `${hardness}/5 Mohs`}
        </span>
      </div>
    );
  };
  
  return (
    <motion.div 
      whileHover={!showDetails ? { scale: 1.03 } : undefined}
      whileTap={!showDetails ? { scale: 0.98 } : undefined}
      className={`rounded-lg overflow-hidden shadow-md transition-all ${
        onClick ? 'cursor-pointer' : ''
      } ${
        selected 
          ? 'ring-2 ring-nile-teal bg-nile-teal/5' 
          : 'bg-white hover:shadow-lg'
      }`}
      onClick={onClick}
    >
      {/* Image and basic info */}
      <div className="relative">
        <div className="aspect-[4/3] relative">
          <Image
            src={material.image || '/images/materials/placeholder.jpg'}
            alt={material.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </div>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        {/* Basic info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-bold text-lg">{material.name}</h3>
          
          <div className="flex items-center justify-between mt-1">
            <div>
              {isGemstone && gem?.birthMonth && (
                <span className="text-xs opacity-90">
                  {new Date(0, gem.birthMonth - 1).toLocaleString('default', { month: 'long' })} Birthstone
                </span>
              )}
              {!isGemstone && metal?.purity && (
                <span className="text-xs opacity-90">
                  Available in: {metal.purity.join(', ')}
                </span>
              )}
            </div>
            
            <div 
              className="w-6 h-6 rounded-full border-2 border-white"
              style={{ backgroundColor: material.hexColor }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Additional info for compact view */}
      {!showDetails && (
        <div className="p-3">
          <div className="flex justify-between items-center">
            {renderPriceTag()}
            {renderDurabilityRating()}
          </div>
        </div>
      )}
      
      {/* Detailed information */}
      {showDetails && (
        <div className="p-4">
          <p className="text-gray-700 mb-4">{material.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Properties</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {isGemstone ? (
                  <>
                    <li>Hardness: {gem?.hardness} (Mohs)</li>
                    <li>Refraction: {gem?.refractionIndex}</li>
                    <li>Transparency: {gem?.transparency}</li>
                    <li>Common cuts: {gem?.commonCuts.slice(0, 3).join(', ')}</li>
                  </>
                ) : (
                  <>
                    <li>Hardness: {metal?.hardness} (Mohs)</li>
                    <li>Density: {metal?.density} g/cm³</li>
                    <li>Purity: {metal?.purity.join(', ')}</li>
                    <li>Alloy: {metal?.isAlloy ? 'Yes' : 'No'}</li>
                  </>
                )}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Price Range</h4>
              <div className="mb-2">
                {renderPriceTag()}
              </div>
              
              <h4 className="text-sm font-semibold text-gray-900 mb-1 mt-3">Durability</h4>
              {renderDurabilityRating()}
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Characteristics</h4>
            <ul className="text-sm text-gray-700 space-y-1 pl-5 list-disc">
              {material.characteristics.slice(0, 4).map((char, index) => (
                <li key={index}>{char}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Care Instructions</h4>
            <ul className="text-sm text-gray-700 space-y-1 pl-5 list-disc">
              {material.careInstructions.slice(0, 3).map((instr, index) => (
                <li key={index}>{instr}</li>
              ))}
            </ul>
          </div>
          
          {/* Available colors for gemstones */}
          {isGemstone && gem && gem.colors && gem.colors.length > 1 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Available Colors</h4>
              <div className="flex flex-wrap gap-1">
                {gem.colors.map(color => (
                  <span 
                    key={color}
                    className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Components for metals that are alloys */}
          {!isGemstone && metal?.isAlloy && metal.components && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Components</h4>
              <div className="flex flex-wrap gap-1">
                {metal.components.map(component => (
                  <span 
                    key={component}
                    className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700"
                  >
                    {component}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
} 