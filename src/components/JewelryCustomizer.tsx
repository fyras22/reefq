'use client';

import React, { useState, useEffect, useRef } from 'react';
import { JewelryViewer } from './JewelryViewer';
import { motion, AnimatePresence } from 'framer-motion';

// Define the available options for customization
const metalOptions = [
  { id: 'gold', name: 'Pharaonic Gold', colorClass: 'bg-[#C4A265]' },
  { id: 'silver', name: 'Silver', colorClass: 'bg-[#E0E0E0]' },
  { id: 'platinum', name: 'Platinum', colorClass: 'bg-[#E5E4E2]' },
  { id: 'rose-gold', name: 'Rose Gold', colorClass: 'bg-[#B76E79]' },
  { id: 'white-gold', name: 'White Gold', colorClass: 'bg-[#F5F5F5]' },
];

const gemOptions = [
  { id: 'diamond', name: 'Diamond', colorClass: 'bg-white border border-gray-300' },
  { id: 'emerald', name: 'Nile Teal Emerald', colorClass: 'bg-[#2A5B5E]' },
  { id: 'ruby', name: 'Ruby', colorClass: 'bg-[#E0115F]' },
  { id: 'sapphire', name: 'Sapphire', colorClass: 'bg-[#0F52BA]' },
  { id: 'amethyst', name: 'Amethyst', colorClass: 'bg-[#9966CC]' },
];

const sizeOptions = [
  { id: 'us4', name: 'US 4', value: 14.8 },
  { id: 'us5', name: 'US 5', value: 15.7 },
  { id: 'us6', name: 'US 6', value: 16.5 },
  { id: 'us7', name: 'US 7', value: 17.3 },
  { id: 'us8', name: 'US 8', value: 18.2 },
  { id: 'us9', name: 'US 9', value: 19.0 },
  { id: 'us10', name: 'US 10', value: 19.8 },
  { id: 'us11', name: 'US 11', value: 20.7 },
  { id: 'us12', name: 'US 12', value: 21.5 },
];

const engraveOptions = [
  { id: 'none', name: 'None' },
  { id: 'names', name: 'Names' },
  { id: 'date', name: 'Date' },
  { id: 'custom', name: 'Custom' },
];

const settingOptions = [
  { id: 'prong', name: 'Prong Setting' },
  { id: 'bezel', name: 'Bezel Setting' },
  { id: 'pave', name: 'Pavé Setting' },
  { id: 'channel', name: 'Channel Setting' },
  { id: 'tension', name: 'Tension Setting' },
];

const chainOptions = [
  { id: '16', name: '16" - Choker', value: 16 },
  { id: '18', name: '18" - Princess', value: 18 },
  { id: '20', name: '20" - Matinee', value: 20 },
  { id: '24', name: '24" - Opera', value: 24 },
  { id: '30', name: '30" - Rope', value: 30 },
];

const materialWeights = {
  'gold': { density: 19.32, label: 'High' },
  'silver': { density: 10.49, label: 'Medium' },
  'platinum': { density: 21.45, label: 'Very High' },
  'rose-gold': { density: 17.5, label: 'High' },
  'white-gold': { density: 18.9, label: 'High' }
};

// New options for gem arrangements
const gemArrangementOptions = [
  { id: 'solitaire', name: 'Solitaire', description: 'A single center stone' },
  { id: 'three-stone', name: 'Three Stone', description: 'Center stone with two side stones' },
  { id: 'halo', name: 'Halo', description: 'Center stone surrounded by smaller stones' },
  { id: 'cluster', name: 'Cluster', description: 'Multiple stones grouped together' },
  { id: 'pave', name: 'Pavé Band', description: 'Small stones set across the band' }
];

// New options for metal finish
const finishOptions = [
  { id: 'polished', name: 'High Polish', description: 'Smooth, mirror-like finish' },
  { id: 'matte', name: 'Matte/Brushed', description: 'Textured, non-reflective finish' },
  { id: 'hammered', name: 'Hammered', description: 'Textured with small indentations' },
  { id: 'satin', name: 'Satin', description: 'Subtle, soft sheen finish' }
];

interface JewelryCustomizerProps {
  productId?: string;
  initialMetal?: string;
  initialGem?: string;
  initialSize?: number;
  onUpdate?: (data: {
    metalType?: string;
    gemType?: string;
    jewelryType?: string;
    settingType?: string;
    finish?: string;
  }) => void;
}

export function JewelryCustomizer({
  productId,
  initialMetal = 'gold',
  initialGem = 'emerald',
  initialSize = 1,
  onUpdate
}: JewelryCustomizerProps) {
  // State for customization options
  const [metalType, setMetalType] = useState<any>(initialMetal);
  const [gemType, setGemType] = useState<any>(initialGem);
  const [ringSize, setRingSize] = useState<string>(sizeOptions[2].id); // Default to US 6
  const [engraveOption, setEngraveOption] = useState<string>(engraveOptions[0].id);
  const [settingType, setSettingType] = useState<string>(settingOptions[0].id);
  const [customText, setCustomText] = useState<string>('');
  const [showCustomText, setShowCustomText] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(1299);
  const [designName, setDesignName] = useState<string>('');
  const [showSaveDesign, setShowSaveDesign] = useState<boolean>(false);
  const [chainLength, setChainLength] = useState<string>(chainOptions[1].id); // Default to 18"
  const [jewelryType, setJewelryType] = useState<string>('ring'); // 'ring', 'necklace', 'bracelet', 'earrings'
  const [showMaterialInfo, setShowMaterialInfo] = useState<boolean>(false);
  const [gemArrangement, setGemArrangement] = useState<string>('solitaire');
  const [finish, setFinish] = useState<string>('polished');
  const [showPreviewHistory, setShowPreviewHistory] = useState<boolean>(false);
  const [previewHistory, setPreviewHistory] = useState<Array<any>>([]);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [customGemColor, setCustomGemColor] = useState<string>('#2A5B5E');
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareDesign, setCompareDesign] = useState<any>(null);
  
  const screenshotRef = useRef<HTMLDivElement>(null);

  // Calculate price based on options
  useEffect(() => {
    let basePrice = 1299;
    
    // Add for premium metals
    if (metalType === 'platinum') basePrice += 500;
    if (metalType === 'white-gold') basePrice += 300;
    
    // Add for premium gems
    if (gemType === 'diamond') basePrice += 700;
    if (gemType === 'sapphire') basePrice += 400;
    
    // Add for engraving
    if (engraveOption !== 'none') basePrice += 50;
    
    // Add for premium settings
    if (settingType === 'pave') basePrice += 200;
    if (settingType === 'channel') basePrice += 150;
    
    setPrice(basePrice);
  }, [metalType, gemType, engraveOption, settingType]);

  // Toggle custom text input visibility
  useEffect(() => {
    setShowCustomText(engraveOption === 'custom' || engraveOption === 'names' || engraveOption === 'date');
  }, [engraveOption]);

  // Get the correct size value for the 3D model
  const getSizeValue = () => {
    const selectedSize = sizeOptions.find(option => option.id === ringSize);
    return selectedSize ? (selectedSize.value / 16.5) : 1; // Scale factor based on US 6 being the reference size
  };

  // Get display text for engraving
  const getEngravingText = () => {
    if (engraveOption === 'none') return '';
    return customText;
  };

  // Save design handler
  const handleSaveDesign = () => {
    if (designName.trim() === '') {
      setShowSaveDesign(true);
      return;
    }
    
    // Save the design details (would connect to API)
    const design = {
      name: designName,
      metal: metalType,
      gem: gemType,
      size: ringSize,
      setting: settingType,
      engraving: engraveOption !== 'none' ? customText : '',
      price
    };
    
    console.log('Saving design:', design);
    // Here you would typically save to backend
    
    // Show success message
    alert('Your design "' + designName + '" has been saved!');
    setShowSaveDesign(false);
  };

  // Get approximate weight based on jewelry type and material
  const getApproximateWeight = () => {
    const baseWeight = jewelryType === 'ring' ? 5 : 
                      jewelryType === 'necklace' ? 15 : 
                      jewelryType === 'bracelet' ? 10 : 7; // in grams
                      
    const densityFactor = materialWeights[metalType]?.density / 10 || 1;
    return (baseWeight * densityFactor).toFixed(1);
  };

  // Save current design to preview history
  const saveToHistory = () => {
    const currentDesign = {
      id: Date.now(),
      metal: metalType,
      gem: gemType,
      setting: settingType,
      arrangement: gemArrangement,
      finish: finish,
      timestamp: new Date().toLocaleTimeString(),
      thumbnail: 'thumbnail-placeholder.jpg'
    };
    
    setPreviewHistory(prev => [currentDesign, ...prev.slice(0, 9)]);
  };
  
  // Apply design from history
  const applyFromHistory = (design) => {
    setMetalType(design.metal);
    setGemType(design.gem);
    setSettingType(design.setting);
    setGemArrangement(design.arrangement);
    setFinish(design.finish);
    setShowPreviewHistory(false);
  };
  
  // Enable comparison mode with selected design
  const enableCompareMode = (design) => {
    setCompareDesign(design);
    setCompareMode(true);
    setShowPreviewHistory(false);
  };

  // Call onUpdate callback whenever relevant state changes
  useEffect(() => {
    if (onUpdate) {
      onUpdate({
        metalType,
        gemType,
        jewelryType,
        settingType,
        finish
      });
    }
  }, [metalType, gemType, jewelryType, settingType, finish, onUpdate]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 3D Viewer */}
        <div className="bg-white rounded-xl shadow-md p-4 order-2 lg:order-1">
          <div ref={screenshotRef}>
            {compareMode ? (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-center text-xs text-gray-500 mb-1">Current Design</div>
                  <JewelryViewer 
                    metalType={metalType} 
                    gemType={gemType} 
                    size={getSizeValue()}
                    setting={settingType}
                    engraving={getEngravingText()}
                    gemArrangement={gemArrangement}
                    finish={finish}
                    customGemColor={gemType === 'custom' ? customGemColor : undefined}
                  />
                </div>
                <div>
                  <div className="text-center text-xs text-gray-500 mb-1">Comparison Design</div>
                  <JewelryViewer 
                    metalType={compareDesign?.metal || initialMetal} 
                    gemType={compareDesign?.gem || initialGem} 
                    size={getSizeValue()}
                    setting={compareDesign?.setting || settingOptions[0].id}
                    engraving={''}
                    gemArrangement={compareDesign?.arrangement || 'solitaire'}
                    finish={compareDesign?.finish || 'polished'}
                  />
                </div>
              </div>
            ) : (
              <JewelryViewer 
                metalType={metalType} 
                gemType={gemType} 
                size={getSizeValue()}
                setting={settingType}
                engraving={getEngravingText()}
                gemArrangement={gemArrangement}
                finish={finish}
                customGemColor={gemType === 'custom' ? customGemColor : undefined}
              />
            )}
          </div>
          
          {/* Viewer control buttons */}
          <div className="flex justify-between mt-4">
            <div className="flex space-x-2">
              <button 
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-xs"
                onClick={() => setCompareMode(false)}
              >
                Front View
              </button>
              <button 
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-xs"
                onClick={() => setCompareMode(false)}
              >
                Side View
              </button>
              <button 
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-xs"
                onClick={() => setCompareMode(false)}
              >
                Top View
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button 
                className="bg-nile-teal/10 hover:bg-nile-teal/20 px-3 py-1 rounded text-xs text-nile-teal"
                onClick={saveToHistory}
              >
                Save View
              </button>
              <button 
                className={`${showPreviewHistory ? 'bg-nile-teal text-white' : 'bg-nile-teal/10 text-nile-teal'} px-3 py-1 rounded text-xs hover:bg-nile-teal/20`}
                onClick={() => setShowPreviewHistory(!showPreviewHistory)}
              >
                History
              </button>
              <button 
                className={`${compareMode ? 'bg-nile-teal text-white' : 'bg-nile-teal/10 text-nile-teal'} px-3 py-1 rounded text-xs hover:bg-nile-teal/20`}
                onClick={() => setCompareMode(!compareMode)}
              >
                Compare
              </button>
            </div>
          </div>
          
          {/* Preview history panel */}
          <AnimatePresence>
            {showPreviewHistory && previewHistory.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 border-t border-gray-200 pt-3 overflow-hidden"
              >
                <h4 className="text-sm font-medium text-gray-700 mb-2">Design History</h4>
                <div className="grid grid-cols-4 gap-2">
                  {previewHistory.map((design) => (
                    <div 
                      key={design.id} 
                      className="border border-gray-200 rounded-md p-1 cursor-pointer hover:border-nile-teal"
                    >
                      <div className="bg-gray-100 rounded aspect-square mb-1 flex items-center justify-center text-xs text-gray-400">
                        Preview
                      </div>
                      <div className="flex justify-between items-center">
                        <button 
                          onClick={() => applyFromHistory(design)}
                          className="text-xs text-nile-teal hover:underline"
                        >
                          Apply
                        </button>
                        <button 
                          onClick={() => enableCompareMode(design)}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Compare
                        </button>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1">{design.timestamp}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Customization Options */}
        <div className="bg-white rounded-xl shadow-md p-6 order-1 lg:order-2">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Customize Your Jewelry</h2>
          
          {/* Jewelry Type Selector */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-700">Jewelry Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['ring', 'necklace', 'bracelet', 'earrings'].map((type) => (
                <button
                  key={type}
                  onClick={() => setJewelryType(type)}
                  className={`relative rounded-md py-2 px-3 text-center transition-all ${
                    jewelryType === type
                      ? 'bg-nile-teal text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm font-medium capitalize">{type}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Metal Type */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium mb-3 text-gray-700">Metal Type</h3>
              <button 
                onClick={() => setShowMaterialInfo(!showMaterialInfo)}
                className="text-nile-teal text-sm font-medium hover:underline flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Material Info
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {metalOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setMetalType(option.id)}
                  className={`relative rounded-md py-2 px-3 flex flex-col items-center transition-all ${
                    metalType === option.id
                      ? 'ring-2 ring-nile-teal ring-offset-2'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full ${option.colorClass} mb-1`}></span>
                  <span className="text-xs font-medium">{option.name}</span>
                </button>
              ))}
            </div>
            
            {showMaterialInfo && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Material:</span>
                  <span>{metalOptions.find(m => m.id === metalType)?.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Durability:</span>
                  <span>{materialWeights[metalType]?.label || 'Medium'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Approx. Weight:</span>
                  <span>{getApproximateWeight()}g</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Gemstone Type */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-700">Gemstone</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {gemOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setGemType(option.id)}
                  className={`relative rounded-md py-2 px-3 flex flex-col items-center transition-all ${
                    gemType === option.id
                      ? 'ring-2 ring-nile-teal ring-offset-2'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full ${option.colorClass} mb-1`}></span>
                  <span className="text-xs font-medium">{option.name}</span>
                </button>
              ))}
              <button
                onClick={() => {
                  setGemType('custom');
                  setShowColorPicker(true);
                }}
                className={`relative rounded-md py-2 px-3 flex flex-col items-center transition-all ${
                  gemType === 'custom'
                    ? 'ring-2 ring-nile-teal ring-offset-2'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className="w-8 h-8 rounded-full mb-1" style={{backgroundColor: customGemColor}}></span>
                <span className="text-xs font-medium">Custom Color</span>
              </button>
            </div>
            
            {/* Custom gem color picker */}
            <AnimatePresence>
              {showColorPicker && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 p-3 border border-gray-200 rounded-md"
                >
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm text-gray-700">Select Custom Color</label>
                    <input
                      type="color"
                      value={customGemColor}
                      onChange={(e) => setCustomGemColor(e.target.value)}
                      className="w-full h-10 p-0 border-0"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() => setShowColorPicker(false)}
                        className="text-xs text-nile-teal hover:underline"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Gem Arrangement */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-700">Gem Arrangement</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {gemArrangementOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setGemArrangement(option.id)}
                  className={`relative rounded-md py-2 px-3 text-center transition-all ${
                    gemArrangement === option.id
                      ? 'bg-nile-teal text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm font-medium">{option.name}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {gemArrangementOptions.find(o => o.id === gemArrangement)?.description}
            </p>
          </div>
          
          {/* Setting Type */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-700">Setting Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {settingOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSettingType(option.id)}
                  className={`relative rounded-md py-2 px-3 text-center transition-all ${
                    settingType === option.id
                      ? 'bg-nile-teal text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm font-medium">{option.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Metal Finish */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-700">Metal Finish</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {finishOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setFinish(option.id)}
                  className={`relative rounded-md py-2 px-3 text-center transition-all ${
                    finish === option.id
                      ? 'bg-nile-teal text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm font-medium">{option.name}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {finishOptions.find(o => o.id === finish)?.description}
            </p>
          </div>
          
          {/* Size Options - Conditional based on jewelry type */}
          <div className="mb-6">
            {jewelryType === 'ring' && (
              <>
                <h3 className="text-lg font-medium mb-3 text-gray-700">Ring Size</h3>
                <div className="relative">
                  <select
                    value={ringSize}
                    onChange={(e) => setRingSize(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-teal focus:ring-nile-teal"
                  >
                    {sizeOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name} - {option.value}mm
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-2">
                  <button 
                    className="text-nile-teal text-sm font-medium hover:underline"
                    onClick={() => window.open('/size-guide', '_blank')}
                  >
                    How to measure your ring size?
                  </button>
                </div>
              </>
            )}
            
            {jewelryType === 'necklace' && (
              <>
                <h3 className="text-lg font-medium mb-3 text-gray-700">Chain Length</h3>
                <div className="relative">
                  <select
                    value={chainLength}
                    onChange={(e) => setChainLength(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-teal focus:ring-nile-teal"
                  >
                    {chainOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">Choker (16"):</span> Sits snugly around the neck
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Princess (18"):</span> Most common length for all styles
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Matinee (20-24"):</span> Falls below collarbone
                  </p>
                </div>
              </>
            )}
            
            {jewelryType === 'bracelet' && (
              <>
                <h3 className="text-lg font-medium mb-3 text-gray-700">Bracelet Size</h3>
                <div className="grid grid-cols-3 gap-2">
                  {['Small (7")', 'Medium (7.5")', 'Large (8")'].map((size) => (
                    <button
                      key={size}
                      onClick={() => {}}
                      className={`relative rounded-md py-2 px-3 text-center transition-all 
                        border border-gray-300 hover:bg-gray-50
                      `}
                    >
                      <span className="text-sm font-medium">{size}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          {/* Engraving */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-700">Engraving</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
              {engraveOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setEngraveOption(option.id)}
                  className={`relative rounded-md py-2 px-3 text-center transition-all ${
                    engraveOption === option.id
                      ? 'bg-nile-teal text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm font-medium">{option.name}</span>
                </button>
              ))}
            </div>
            
            {showCustomText && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder={
                    engraveOption === 'names' 
                      ? "Enter names (e.g., 'John & Sarah')" 
                      : engraveOption === 'date' 
                      ? "Enter date (e.g., '12.24.2023')"
                      : "Enter custom text (max 20 characters)"
                  }
                  maxLength={20}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-teal focus:ring-nile-teal"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum 20 characters • Engraving will be on the inside of the ring
                </p>
              </motion.div>
            )}
          </div>
          
          {/* Price and Add to Cart */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-700">Price</span>
              <span className="text-2xl font-bold text-nile-teal">${price.toFixed(2)}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                className="bg-nile-teal hover:bg-nile-teal/90 text-white font-bold py-3 px-6 rounded-md transition-colors"
              >
                Add to Cart
              </button>
              <button
                type="button"
                onClick={() => setShowSaveDesign(true)}
                className="border border-nile-teal text-nile-teal font-bold py-3 px-6 rounded-md hover:bg-gray-50 transition-colors"
              >
                Save Design
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-sm"
                onClick={() => {
                  if (screenshotRef.current) {
                    const canvas = screenshotRef.current.querySelector('canvas');
                    if (canvas) {
                      const link = document.createElement('a');
                      link.download = 'jewelry-design.png';
                      link.href = canvas.toDataURL('image/png');
                      link.click();
                    }
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Download Image
              </button>
              <button
                type="button"
                className="flex items-center justify-center border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-sm"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'My Custom Jewelry Design',
                      text: 'Check out this custom jewelry I designed!',
                      url: window.location.href,
                    });
                  } else {
                    // Fallback for browsers that don't support Web Share API
                    navigator.clipboard.writeText(window.location.href);
                    alert('Design link copied to clipboard!');
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share Design
              </button>
            </div>
            
            {showSaveDesign && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 border border-gray-200 rounded-lg"
              >
                <h4 className="font-medium text-gray-900 mb-2">Save Your Design</h4>
                <input
                  type="text"
                  value={designName}
                  onChange={(e) => setDesignName(e.target.value)}
                  placeholder="Enter a name for your design"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-teal focus:ring-nile-teal mb-3"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveDesign}
                    className="bg-nile-teal hover:bg-nile-teal/90 text-white py-2 px-4 rounded-md text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowSaveDesign(false)}
                    className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
            
            <p className="text-sm text-gray-500 mt-4">
              Your custom jewelry will be handcrafted after you place your order.
              Please allow 2-3 weeks for production.
            </p>
          </div>
        </div>
      </div>
      
      {/* Accessibility panel that appears at the bottom on mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex justify-around">
        <button
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          className="flex flex-col items-center text-nile-teal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-xs">View</span>
        </button>
        <button
          onClick={saveToHistory}
          className="flex flex-col items-center text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          <span className="text-xs">Save</span>
        </button>
        <button
          onClick={() => setCompareMode(!compareMode)}
          className="flex flex-col items-center text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-xs">Compare</span>
        </button>
        <button
          onClick={() => {
            const addToCartButton = document.querySelector('.bg-nile-teal');
            if (addToCartButton) addToCartButton.scrollIntoView({behavior: 'smooth'});
          }}
          className="flex flex-col items-center text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="text-xs">Buy</span>
        </button>
      </div>
    </>
  );
} 