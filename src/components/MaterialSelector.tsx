'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Tab } from '@headlessui/react';
import { ChevronRightIcon, ChevronDownIcon, SparklesIcon, StarIcon, ScaleIcon } from '@heroicons/react/24/outline';
import { 
  METALS, 
  GEMSTONES, 
  MetalType, 
  GemstoneType,
  getComplementaryPairings,
  getBirthstoneForMonth
} from '@/data/materialsData';
import { MaterialInfoCard } from './MaterialInfoCard';

interface MaterialSelectorProps {
  onMetalSelect: (metal: MetalType) => void;
  onGemSelect: (gem: GemstoneType | null) => void;
  initialMetal?: MetalType;
  initialGem?: GemstoneType | null;
  productType?: 'ring' | 'necklace' | 'earrings' | 'bracelet';
}

export function MaterialSelector({
  onMetalSelect,
  onGemSelect,
  initialMetal = 'gold',
  initialGem = null,
  productType = 'ring'
}: MaterialSelectorProps) {
  const [selectedMetal, setSelectedMetal] = useState<MetalType>(initialMetal);
  const [selectedGem, setSelectedGem] = useState<GemstoneType | null>(initialGem);
  const [tabIndex, setTabIndex] = useState(0);
  const [showBirthstones, setShowBirthstones] = useState(false);
  const [showMetalDetails, setShowMetalDetails] = useState<string | null>(null);
  const [showGemDetails, setShowGemDetails] = useState<string | null>(null);
  const [showAiRecommendations, setShowAiRecommendations] = useState(false);
  const [showMaterialComparison, setShowMaterialComparison] = useState(false);
  const [comparisonItems, setComparisonItems] = useState<{
    metals: MetalType[];
    gems: GemstoneType[];
  }>({
    metals: [],
    gems: []
  });
  
  // Get complementary pairings based on current selections
  const [recommendations, setRecommendations] = useState<{
    recommendedGems?: GemstoneType[];
    recommendedMetals?: MetalType[];
  }>({});
  
  // Calculate durability score for materials
  const getDurabilityScore = (materialType: 'metal' | 'gem', id: string): number => {
    if (materialType === 'metal') {
      const metal = METALS.find(m => m.id === id);
      // Scale: platinum (most durable) = 10, gold = 8, silver = 6
      switch(id) {
        case 'platinum': return 10;
        case 'whitegold': return 9;
        case 'gold': return 8;
        case 'rosegold': return 7;
        case 'silver': return 6;
        default: return 5;
      }
    } else {
      // Scale based on Mohs hardness: diamond=10, ruby/sapphire=9, emerald=7.5, etc.
      switch(id) {
        case 'diamond': return 10;
        case 'ruby': 
        case 'sapphire': return 9;
        case 'emerald': return 7.5;
        case 'topaz': return 8;
        case 'amethyst': return 7;
        case 'pearl': return 3;
        default: return 5;
      }
    }
  };
  
  // Get price range indicator for materials
  const getPriceIndicator = (materialType: 'metal' | 'gem', id: string): number => {
    if (materialType === 'metal') {
      const metal = METALS.find(m => m.id === id);
      // Scale: platinum (most expensive) = 10, gold = 8, silver = 4
      switch(id) {
        case 'platinum': return 10;
        case 'whitegold': return 9;
        case 'gold': return 8;
        case 'rosegold': return 7;
        case 'silver': return 4;
        default: return 5;
      }
    } else {
      // Price scale
      switch(id) {
        case 'diamond': return 10;
        case 'ruby': return 9;
        case 'emerald': return 9;
        case 'sapphire': return 8;
        case 'topaz': return 5;
        case 'amethyst': return 4;
        case 'pearl': return 5;
        default: return 5;
      }
    }
  };
  
  // Calculate sustainability score
  const getSustainabilityScore = (materialType: 'metal' | 'gem', id: string): number => {
    if (materialType === 'metal') {
      // Lab-created and recycled metals are more sustainable
      switch(id) {
        case 'silver': return 7; // More abundant, easier to recycle
        case 'gold': 
        case 'rosegold': 
        case 'whitegold': return 5; // Can be recycled but mining impact
        case 'platinum': return 4; // Rare, more mining impact
        default: return 5;
      }
    } else {
      // Lab-created gems are more sustainable than mined ones
      switch(id) {
        case 'pearl': return 8; // Cultured pearls are more sustainable
        case 'amethyst': return 7;
        case 'topaz': return 6;
        case 'diamond': 
        case 'ruby': 
        case 'sapphire': 
        case 'emerald': return 5; // Heavily impacted by whether lab-created
        default: return 5;
      }
    }
  };
  
  // AI recommendations based on selections and preferences
  const generateAiRecommendations = () => {
    // In a real application, this would call an API to get ML-based recommendations
    // Here we're simulating it with a rule-based system
    
    const recommendations = {
      metals: [] as MetalType[],
      gems: [] as GemstoneType[]
    };
    
    // Based on product type
    if (productType === 'ring') {
      // Rings often benefit from more durable materials
      recommendations.metals.push('platinum', 'whitegold');
      recommendations.gems.push('diamond', 'sapphire');
    } else if (productType === 'earrings') {
      // Earrings often use lighter metals and colorful stones
      recommendations.metals.push('whitegold', 'gold');
      recommendations.gems.push('emerald', 'sapphire', 'ruby');
    } else if (productType === 'necklace') {
      // Necklaces often feature gold and pearls
      recommendations.metals.push('gold', 'rosegold');
      recommendations.gems.push('pearl', 'diamond');
    } else if (productType === 'bracelet') {
      // Bracelets need durability and style
      recommendations.metals.push('whitegold', 'platinum');
      recommendations.gems.push('diamond', 'sapphire');
    }
    
    return recommendations;
  };
  
  // Update recommendations when selections change
  useEffect(() => {
    if (selectedMetal) {
      const newRecs = getComplementaryPairings(
        selectedMetal, 
        selectedGem
      );
      setRecommendations(newRecs);
    }
  }, [selectedMetal, selectedGem]);
  
  // Handle metal selection
  const handleMetalSelect = (metal: MetalType) => {
    setSelectedMetal(metal);
    onMetalSelect(metal);
    setShowMetalDetails(null);
  };
  
  // Handle gemstone selection
  const handleGemSelect = (gem: GemstoneType | null) => {
    setSelectedGem(gem);
    onGemSelect(gem);
    setShowGemDetails(null);
  };
  
  // Add item to comparison
  const addToComparison = (type: 'metal' | 'gem', id: string) => {
    if (type === 'metal') {
      if (comparisonItems.metals.includes(id as MetalType)) {
        // Remove if already present
        setComparisonItems({
          ...comparisonItems,
          metals: comparisonItems.metals.filter(m => m !== id)
        });
      } else if (comparisonItems.metals.length < 3) {
        // Add if space available (limit to 3)
        setComparisonItems({
          ...comparisonItems,
          metals: [...comparisonItems.metals, id as MetalType]
        });
      }
    } else {
      if (comparisonItems.gems.includes(id as GemstoneType)) {
        // Remove if already present
        setComparisonItems({
          ...comparisonItems,
          gems: comparisonItems.gems.filter(g => g !== id)
        });
      } else if (comparisonItems.gems.length < 3) {
        // Add if space available (limit to 3)
        setComparisonItems({
          ...comparisonItems,
          gems: [...comparisonItems.gems, id as GemstoneType]
        });
      }
    }
  };

  // Get birthstone for current month
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const currentBirthstone = getBirthstoneForMonth(currentMonth);
  
  // Compute AI recommendations on mount
  const aiRecommendations = useMemo(() => {
    return generateAiRecommendations();
  }, [productType]);
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-5">
      <Tab.Group selectedIndex={tabIndex} onChange={setTabIndex}>
        <Tab.List className="flex space-x-1 rounded-xl bg-nile-teal/10 p-1">
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
            ${selected 
              ? 'bg-white text-nile-teal shadow' 
              : 'text-nile-teal/60 hover:bg-white/[0.25] hover:text-nile-teal'
            }`
          }>
            Metal Selection
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
            ${selected 
              ? 'bg-white text-nile-teal shadow' 
              : 'text-nile-teal/60 hover:bg-white/[0.25] hover:text-nile-teal'
            }`
          }>
            Gemstone Selection
          </Tab>
        </Tab.List>
        
        <Tab.Panels className="mt-4">
          {/* Metal selection panel */}
          <Tab.Panel>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Metal</h3>
              <p className="text-gray-600">
                Choose the perfect metal for your {productType}. Each metal has unique properties that affect 
                appearance, durability, and price.
              </p>
            </div>
            
            {/* AI Recommendations for metals */}
            <div className="mb-4">
              <button
                onClick={() => setShowAiRecommendations(!showAiRecommendations)}
                className="flex items-center text-nile-teal hover:text-nile-teal/80 font-medium text-sm"
              >
                <SparklesIcon className="w-4 h-4 mr-1" />
                AI Recommendations
                {showAiRecommendations ? (
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                )}
              </button>
              
              <AnimatePresence>
                {showAiRecommendations && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-2"
                  >
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Recommended for {productType}:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {aiRecommendations.metals.map(metalId => {
                          const metal = METALS.find(m => m.id === metalId);
                          if (!metal) return null;
                          
                          return (
                            <button
                              key={metal.id}
                              onClick={() => handleMetalSelect(metal.id as MetalType)}
                              className="px-2 py-1 bg-white rounded border border-gray-200 text-xs flex items-center hover:bg-gray-50"
                            >
                              <div 
                                className="w-3 h-3 rounded-full mr-1"
                                style={{ backgroundColor: metal.hexColor }}
                              ></div>
                              {metal.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Metal Comparison Button */}
            <div className="mb-4">
              <button
                onClick={() => setShowMaterialComparison(!showMaterialComparison)}
                className="flex items-center text-nile-teal hover:text-nile-teal/80 font-medium text-sm"
              >
                <ScaleIcon className="w-4 h-4 mr-1" />
                Compare Metals
                {showMaterialComparison ? (
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                )}
              </button>
              
              <AnimatePresence>
                {showMaterialComparison && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-2"
                  >
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        {comparisonItems.metals.length ? 'Comparison:' : 'Select up to 3 metals to compare'}
                      </h4>
                      
                      {/* Comparison table */}
                      {comparisonItems.metals.length > 0 && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left pb-2">Metal</th>
                                <th className="text-center pb-2">Durability</th>
                                <th className="text-center pb-2">Price</th>
                                <th className="text-center pb-2">Sustainability</th>
                              </tr>
                            </thead>
                            <tbody>
                              {comparisonItems.metals.map(metalId => {
                                const metal = METALS.find(m => m.id === metalId);
                                if (!metal) return null;
                                
                                return (
                                  <tr key={metal.id} className="border-b border-gray-100">
                                    <td className="py-2 flex items-center">
                                      <div 
                                        className="w-3 h-3 rounded-full mr-1"
                                        style={{ backgroundColor: metal.hexColor }}
                                      ></div>
                                      {metal.name}
                                    </td>
                                    <td className="py-2 text-center">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <span 
                                          key={i} 
                                          className={`inline-block w-1 h-1 rounded-full mx-px ${
                                            i < Math.round(getDurabilityScore('metal', metal.id)/2)
                                              ? 'bg-nile-teal' 
                                              : 'bg-gray-200'
                                          }`}
                                        />
                                      ))}
                                    </td>
                                    <td className="py-2 text-center">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <span 
                                          key={i} 
                                          className={`inline-block w-1 h-1 rounded-full mx-px ${
                                            i < Math.round(getPriceIndicator('metal', metal.id)/2)
                                              ? 'bg-pharaonic-gold' 
                                              : 'bg-gray-200'
                                          }`}
                                        />
                                      ))}
                                    </td>
                                    <td className="py-2 text-center">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <span 
                                          key={i} 
                                          className={`inline-block w-1 h-1 rounded-full mx-px ${
                                            i < Math.round(getSustainabilityScore('metal', metal.id)/2)
                                              ? 'bg-green-500' 
                                              : 'bg-gray-200'
                                          }`}
                                        />
                                      ))}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Selected metal summary */}
            {selectedMetal && (
              <div className="p-3 bg-nile-teal/5 rounded-lg border border-nile-teal/20 mb-4 flex items-center">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm mr-3"
                  style={{ backgroundColor: METALS.find(m => m.id === selectedMetal)?.hexColor }}
                ></div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{METALS.find(m => m.id === selectedMetal)?.name}</h4>
                  <p className="text-xs text-gray-600">{METALS.find(m => m.id === selectedMetal)?.purity.join(', ')}</p>
                </div>
                <button 
                  onClick={() => setShowMetalDetails(selectedMetal === showMetalDetails ? null : selectedMetal)}
                  className="text-nile-teal hover:text-nile-teal/70"
                >
                  {showMetalDetails === selectedMetal ? (
                    <ChevronDownIcon className="w-5 h-5" />
                  ) : (
                    <ChevronRightIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            )}
            
            {/* Metal details */}
            <AnimatePresence>
              {showMetalDetails === selectedMetal && selectedMetal && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-4"
                >
                  <MaterialInfoCard 
                    material={METALS.find(m => m.id === selectedMetal)}
                    showDetails
                    type="metal"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Metal options */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {METALS.map((metal) => (
                <div 
                  key={metal.id}
                  onClick={() => handleMetalSelect(metal.id as MetalType)}
                  className={`rounded-lg cursor-pointer transition-all ${
                    selectedMetal === metal.id 
                      ? 'ring-2 ring-nile-teal' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="p-3 flex items-center">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm mr-2"
                      style={{ backgroundColor: metal.hexColor }}
                    ></div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{metal.name}</h4>
                      <div className="flex items-center mt-1">
                        {/* Price indicator */}
                        {Array.from({ length: 4 }).map((_, i) => (
                          <span 
                            key={i} 
                            className={`w-4 h-1 rounded-full mr-0.5 ${
                              (metal.price === 'low' && i === 0) ||
                              (metal.price === 'medium' && i <= 1) ||
                              (metal.price === 'high' && i <= 2) ||
                              (metal.price === 'very-high' && i <= 3)
                                ? 'bg-nile-teal' 
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Compare button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToComparison('metal', metal.id);
                      }}
                      className={`ml-auto w-5 h-5 flex items-center justify-center rounded-full ${
                        comparisonItems.metals.includes(metal.id as MetalType)
                          ? 'bg-nile-teal text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      <ScaleIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Tab.Panel>
          
          {/* Gemstone selection panel */}
          <Tab.Panel>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Gemstone</h3>
              <p className="text-gray-600">
                Choose your perfect gemstone or select "No gemstone" for a metal-only design.
              </p>
            </div>
            
            {/* Selected gemstone summary */}
            {selectedGem ? (
              <div className="p-3 bg-nile-teal/5 rounded-lg border border-nile-teal/20 mb-4 flex items-center">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm mr-3"
                  style={{ backgroundColor: selectedGem.hexColor }}
                ></div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{selectedGem.name}</h4>
                  <p className="text-xs text-gray-600">
                    {selectedGem.birthMonth 
                      ? new Date(0, selectedGem.birthMonth - 1).toLocaleString('default', { month: 'long' }) + ' Birthstone'
                      : selectedGem.primaryColor.charAt(0).toUpperCase() + selectedGem.primaryColor.slice(1)
                    }
                  </p>
                </div>
                <button 
                  onClick={() => setShowGemDetails(selectedGem.id === showGemDetails ? null : selectedGem.id)}
                  className="text-nile-teal hover:text-nile-teal/70"
                >
                  {showGemDetails === selectedGem.id ? (
                    <ChevronDownIcon className="w-5 h-5" />
                  ) : (
                    <ChevronRightIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mb-4 flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">N/A</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-700">No Gemstone</h4>
                  <p className="text-xs text-gray-500">Metal only design</p>
                </div>
              </div>
            )}
            
            {/* Gemstone details */}
            <AnimatePresence>
              {showGemDetails === selectedGem?.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-4"
                >
                  <MaterialInfoCard 
                    material={selectedGem}
                    showDetails
                    type="gemstone"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Birthstone toggle */}
            <div className="mb-4 flex items-center">
              <button
                onClick={() => setShowBirthstones(!showBirthstones)}
                className="flex items-center text-sm text-nile-teal hover:text-nile-teal/80"
              >
                {showBirthstones ? (
                  <ChevronDownIcon className="w-4 h-4 mr-1" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 mr-1" />
                )}
                {showBirthstones ? 'Hide birthstones' : 'Show birthstones by month'}
              </button>
              
              {currentBirthstone && (
                <div className="ml-auto flex items-center text-sm text-gray-600">
                  <span>Current birthstone:</span>
                  <button 
                    onClick={() => handleGemSelect(currentBirthstone)}
                    className="ml-1 font-medium text-nile-teal hover:underline"
                  >
                    {currentBirthstone.name}
                  </button>
                </div>
              )}
            </div>
            
            {/* Birthstone selector */}
            <AnimatePresence>
              {showBirthstones && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-4"
                >
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {Array.from({ length: 12 }).map((_, index) => {
                        const month = index + 1;
                        const birthstone = getBirthstoneForMonth(month);
                        const monthName = new Date(0, index).toLocaleString('default', { month: 'long' });
                        
                        return (
                          <div 
                            key={month}
                            onClick={() => birthstone && handleGemSelect(birthstone)}
                            className={`rounded-lg p-2 text-center ${
                              birthstone ? 'cursor-pointer hover:bg-white' : 'opacity-50'
                            } ${
                              selectedGem?.id === birthstone?.id ? 'bg-white ring-1 ring-nile-teal' : ''
                            }`}
                          >
                            <div className="text-xs font-medium text-gray-500 mb-1">{monthName}</div>
                            {birthstone ? (
                              <>
                                <div 
                                  className="w-8 h-8 rounded-full mx-auto mb-1"
                                  style={{ backgroundColor: birthstone.hexColor }}
                                />
                                <div className="text-xs font-medium">{birthstone.name}</div>
                              </>
                            ) : (
                              <>
                                <div className="w-8 h-8 rounded-full bg-gray-200 mx-auto mb-1" />
                                <div className="text-xs">None</div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* No gemstone option */}
            <div className="mb-4">
              <button
                onClick={() => handleGemSelect(null)}
                className={`w-full p-3 rounded-lg border text-left ${
                  selectedGem === null
                    ? 'border-nile-teal bg-nile-teal/5 text-nile-teal'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">No Gemstone</div>
                <div className="text-sm opacity-80">Create a metal-only design</div>
              </button>
            </div>
            
            {/* Gem recommendations based on selected metal */}
            {recommendations.recommendedGems && recommendations.recommendedGems.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Recommended for {selectedMetal.name}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {recommendations.recommendedGems.slice(0, 5).map((gem) => (
                    <div 
                      key={gem.id}
                      onClick={() => handleGemSelect(gem)}
                      className={`rounded-lg p-2 text-center cursor-pointer transition-all ${
                        selectedGem?.id === gem.id 
                          ? 'ring-2 ring-nile-teal bg-nile-teal/5' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div 
                        className="w-10 h-10 rounded-full mx-auto mb-1 border border-gray-200"
                        style={{ backgroundColor: gem.hexColor }}
                      />
                      <div className="text-xs font-medium">{gem.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* All gemstones */}
            <h4 className="text-sm font-medium text-gray-900 mb-2">All Gemstones</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {GEMSTONES.map((gem) => (
                <div 
                  key={gem.id}
                  onClick={() => handleGemSelect(gem)}
                  className={`rounded-lg cursor-pointer transition-all ${
                    selectedGem?.id === gem.id 
                      ? 'ring-2 ring-nile-teal' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="p-3 flex items-center">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm mr-2"
                      style={{ backgroundColor: gem.hexColor }}
                    ></div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{gem.name}</h4>
                      <div className="flex items-center mt-1">
                        {/* Price indicator */}
                        {Array.from({ length: 4 }).map((_, i) => (
                          <span 
                            key={i} 
                            className={`w-4 h-1 rounded-full mr-0.5 ${
                              (gem.price === 'low' && i === 0) ||
                              (gem.price === 'medium' && i <= 1) ||
                              (gem.price === 'high' && i <= 2) ||
                              (gem.price === 'very-high' && i <= 3)
                                ? 'bg-nile-teal' 
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
} 