'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tab } from '@headlessui/react';
import Image from 'next/image';
import { 
  ArrowUturnLeftIcon, 
  CameraIcon, 
  ChevronRightIcon, 
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { FingerSizeCalculator } from './FingerSizeCalculator';
import { MaterialSelector } from './MaterialSelector';
import { MetalType, GemstoneType, METALS, GEMSTONES } from '@/data/materialsData';
import EnhancedJewelryViewer from './EnhancedJewelryViewer';
import ARJewelryViewer from './ARJewelryViewer';
import PerformanceRecommendations from './PerformanceRecommendations';
import { useQualitySettings } from '../utils/performanceUtils';

// Types of jewelry that can be customized
const PRODUCT_TYPES = [
  { id: 'ring', name: 'Ring', image: '/images/products/ring-template.png' },
  { id: 'necklace', name: 'Necklace', image: '/images/products/necklace-template.png' },
  { id: 'bracelet', name: 'Bracelet', image: '/images/products/bracelet-template.png' },
  { id: 'earrings', name: 'Earrings', image: '/images/products/earrings-template.png' },
];

// Types of settings/designs
const DESIGN_STYLES = [
  { id: 'solitaire', name: 'Solitaire', description: 'Classic single stone setting' },
  { id: 'halo', name: 'Halo', description: 'Center stone surrounded by smaller stones' },
  { id: 'three-stone', name: 'Three Stone', description: 'Three stones representing past, present & future' },
  { id: 'vintage', name: 'Vintage', description: 'Detailed designs inspired by historical periods' },
  { id: 'minimalist', name: 'Minimalist', description: 'Clean, simple lines with modern appeal' },
];

// Type declarations for EnhancedJewelryViewer props
const metalTypes = ['gold', 'silver', 'platinum', 'rosegold', 'whitegold'] as const;
const gemTypes = ['diamond', 'ruby', 'sapphire', 'emerald', 'amethyst', 'topaz', 'pearl'] as const;

// Trending styles
const TRENDING_STYLES = [
  {
    id: "vintage-revival",
    name: "Vintage Revival",
    description: "Classic designs with ornate details inspired by the Art Deco and Victorian eras",
    suggestions: {
      productType: "ring",
      designStyle: "vintage",
      metal: "gold" as MetalType,
      gem: "sapphire" as GemstoneType
    },
    imageUrl: "/images/trends/ring-template.png",
    popularityScore: 94
  },
  {
    id: "minimalist-elegance",
    name: "Minimalist Elegance",
    description: "Clean lines and understated beauty for the modern, sophisticated wearer",
    suggestions: {
      productType: "necklace",
      designStyle: "minimalist",
      metal: "silver" as MetalType,
      gem: "diamond" as GemstoneType
    },
    imageUrl: "/images/trends/necklace-template.png",
    popularityScore: 88
  },
  {
    id: "bold-colorful",
    name: "Bold & Colorful",
    description: "Vibrant gemstones in striking settings for those who love to make a statement",
    suggestions: {
      productType: "earrings",
      designStyle: "three-stone",
      metal: "rosegold" as MetalType,
      gem: "ruby" as GemstoneType
    },
    imageUrl: "/images/trends/earrings-template.png",
    popularityScore: 82
  },
  {
    id: "nature-inspired",
    name: "Nature-Inspired",
    description: "Organic shapes and motifs drawn from the natural world, creating harmony and balance",
    suggestions: {
      productType: "bracelet",
      designStyle: "vintage",
      metal: "whitegold" as MetalType,
      gem: "emerald" as GemstoneType
    },
    imageUrl: "/images/trends/bracelet-template.png",
    popularityScore: 78
  }
];

export default function JewelryCustomizer() {
  // Step tracking
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Product options
  const [productType, setProductType] = useState(PRODUCT_TYPES[0]);
  const [designStyle, setDesignStyle] = useState(DESIGN_STYLES[0]);
  const [selectedMetal, setSelectedMetal] = useState<'gold' | 'silver' | 'platinum' | 'rosegold' | 'whitegold'>('gold');
  const [selectedGem, setSelectedGem] = useState<'diamond' | 'ruby' | 'sapphire' | 'emerald' | 'amethyst' | 'topaz' | 'pearl' | undefined>('diamond');
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [engravingText, setEngravingText] = useState('');
  
  // 3D model state
  const [modelPath, setModelPath] = useState('/models/jewelry/ring-solitaire.glb');
  const [viewerKey, setViewerKey] = useState(0); // For forcing re-render
  
  // Price calculation
  const [totalPrice, setTotalPrice] = useState(0);
  
  // AR related state
  const [showARViewer, setShowARViewer] = useState(false);
  
  // Performance optimization settings
  const [performanceSettings, setPerformanceSettings] = useState({
    quality: 'auto' as 'low' | 'medium' | 'high' | 'ultra' | 'auto',
    enableShadows: true,
    enableBloom: true,
    enableReflections: true,
    enableProgressiveLoading: true,
  });
  
  // Device detection for automatic quality settings
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    isHighPerformance: false,
    isLowPower: false,
    isMobile: false,
    supportsWebGPU: false,
    pixelRatio: 1
  });
  
  // Model cache to prevent re-downloading
  const [modelCache, setModelCache] = useState<Record<string, boolean>>({});
  
  // Detect device capabilities on mount
  useEffect(() => {
    const detectCapabilities = async () => {
      // Detect if mobile device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      // Check for WebGPU support
      let supportsWebGPU = false;
      try {
        if (navigator.gpu) {
          const adapter = await navigator.gpu.requestAdapter();
          supportsWebGPU = !!adapter;
        }
      } catch (e) {
        console.warn("WebGPU detection failed:", e);
      }
      
      // Get device pixel ratio
      const pixelRatio = window.devicePixelRatio || 1;
      
      // Check for battery status if available
      let isLowPower = false;
      try {
        if ('getBattery' in navigator) {
          const battery = await (navigator as any).getBattery();
          isLowPower = battery.charging === false && battery.level < 0.2;
        }
      } catch (e) {
        console.warn("Battery status detection failed:", e);
      }
      
      // GPU/CPU detection heuristics
      const isHighPerformance = supportsWebGPU || pixelRatio >= 2;
      
      // Update state with detected capabilities
      setDeviceCapabilities({
        isHighPerformance,
        isLowPower,
        isMobile,
        supportsWebGPU,
        pixelRatio
      });
      
      // Set automatic quality based on capabilities
      if (performanceSettings.quality === 'auto') {
        let autoQuality: 'low' | 'medium' | 'high' | 'ultra' = 'medium';
        
        if (isLowPower) {
          autoQuality = 'low';
        } else if (isMobile && !isHighPerformance) {
          autoQuality = 'medium';
        } else if (supportsWebGPU) {
          autoQuality = 'ultra';
        } else if (isHighPerformance) {
          autoQuality = 'high';
        }
        
        setPerformanceSettings(prev => ({
          ...prev,
          quality: autoQuality,
          enableShadows: autoQuality !== 'low',
          enableBloom: autoQuality !== 'low',
          enableReflections: autoQuality !== 'low',
        }));
      }
    };
    
    detectCapabilities();
  }, []);
  
  // Pre-cache commonly used models
  useEffect(() => {
    const prefetchModels = async () => {
      if (!performanceSettings.enableProgressiveLoading) return;
      
      const commonModels = [
        '/models/jewelry/ring-solitaire.glb',
        '/models/jewelry/ring-halo.glb'
      ];
      
      try {
        // Simple pre-caching mechanism
        commonModels.forEach(async (modelUrl) => {
          if (!modelCache[modelUrl]) {
            const cacheKey = `model_cache_${modelUrl}`;
            
            // Check if already cached in localStorage
            const isCached = localStorage.getItem(cacheKey) === 'true';
            
            if (!isCached) {
              // Fetch the model file to ensure it's cached by the browser
              await fetch(modelUrl, { method: 'HEAD' });
              
              // Mark as cached
              localStorage.setItem(cacheKey, 'true');
              setModelCache(prev => ({...prev, [modelUrl]: true}));
            } else {
              setModelCache(prev => ({...prev, [modelUrl]: true}));
            }
          }
        });
      } catch (e) {
        console.warn("Model prefetching failed:", e);
      }
    };
    
    prefetchModels();
  }, [performanceSettings.enableProgressiveLoading]);
  
  // Add wishlist functionality
  const [wishlistItems, setWishlistItems] = useState<Array<{
    id: string;
    productType: string;
    designStyle: string;
    metalType: string;
    gemType: string | null;
    price: number;
    thumbnail?: string;
  }>>([]);
  
  // AI recommendation feature 
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendationType, setRecommendationType] = useState<'occasion' | 'budget'>('occasion');
  const [recommendationResult, setRecommendationResult] = useState<{
    title: string;
    description: string;
    metalSuggestion: MetalType;
    gemSuggestion: GemstoneType | null;
    designStyleSuggestion: string;
  } | null>(null);
  
  // Compare feature
  const [compareMode, setCompareMode] = useState(false);
  const [comparisonItems, setComparisonItems] = useState<Array<{
    id: string;
    productType: { id: string; name: string };
    designStyle: { id: string; name: string };
    metal: string;
    gem: string | undefined;
    price: number;
    modelPath: string;
  }>>([]);
  
  // Preview animation feature
  const [showPreviewAnimation, setShowPreviewAnimation] = useState(false);
  const [previewScenario, setPreviewScenario] = useState<'daily' | 'evening' | 'sunlight' | 'motion'>('daily');
  
  // Trending styles suggestion feature
  const [showTrendingSuggestions, setShowTrendingSuggestions] = useState(false);
  
  // Virtual try-on visualization feature
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);
  const [selectedSkinTone, setSelectedSkinTone] = useState<'fair' | 'medium' | 'olive' | 'tan' | 'deep'>('medium');
  const [selectedBodyType, setSelectedBodyType] = useState<'neck' | 'hand' | 'ear' | 'wrist'>('hand');
  
  // Gift packaging options
  const [showGiftPackaging, setShowGiftPackaging] = useState(false);
  const [selectedBox, setSelectedBox] = useState<'classic' | 'premium' | 'luxury'>('classic');
  const [selectedWrapping, setSelectedWrapping] = useState<'none' | 'ribbon' | 'paper'>('none');
  const [giftCardMessage, setGiftCardMessage] = useState('');
  const [giftRecipientName, setGiftRecipientName] = useState('');
  
  // Performance settings toggle component
  const PerformanceSettingsPanel = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 text-sm font-medium"
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-nile-teal">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Performance Settings
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="p-4 bg-white">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rendering Quality
              </label>
              <select
                value={performanceSettings.quality}
                onChange={(e) => setPerformanceSettings(prev => ({
                  ...prev,
                  quality: e.target.value as any
                }))}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
              >
                <option value="auto">Automatic (Based on device)</option>
                <option value="low">Low (Better performance)</option>
                <option value="medium">Medium (Balanced)</option>
                <option value="high">High (Better quality)</option>
                <option value="ultra">Ultra (Maximum quality)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {deviceCapabilities.isMobile ? 'Mobile device detected. ' : ''}
                {deviceCapabilities.isLowPower ? 'Low power mode detected. ' : ''}
                {deviceCapabilities.supportsWebGPU ? 'WebGPU supported. ' : ''}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    checked={performanceSettings.enableShadows}
                    onChange={(e) => setPerformanceSettings(prev => ({
                      ...prev,
                      enableShadows: e.target.checked
                    }))}
                    className="mr-2 h-4 w-4 border-gray-300 rounded text-nile-teal focus:ring-nile-teal"
                  />
                  <span className="text-sm text-gray-700">Shadows</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    checked={performanceSettings.enableBloom}
                    onChange={(e) => setPerformanceSettings(prev => ({
                      ...prev,
                      enableBloom: e.target.checked
                    }))}
                    className="mr-2 h-4 w-4 border-gray-300 rounded text-nile-teal focus:ring-nile-teal"
                  />
                  <span className="text-sm text-gray-700">Bloom Effect</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    checked={performanceSettings.enableReflections}
                    onChange={(e) => setPerformanceSettings(prev => ({
                      ...prev,
                      enableReflections: e.target.checked
                    }))}
                    className="mr-2 h-4 w-4 border-gray-300 rounded text-nile-teal focus:ring-nile-teal"
                  />
                  <span className="text-sm text-gray-700">Reflections</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    checked={performanceSettings.enableProgressiveLoading}
                    onChange={(e) => setPerformanceSettings(prev => ({
                      ...prev,
                      enableProgressiveLoading: e.target.checked
                    }))}
                    className="mr-2 h-4 w-4 border-gray-300 rounded text-nile-teal focus:ring-nile-teal"
                  />
                  <span className="text-sm text-gray-700">Progressive Loading</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Calculate price when options change
  useEffect(() => {
    let basePrice = 0;
    
    // Base price by product type
    switch (productType.id) {
      case 'ring':
        basePrice = 500;
        break;
      case 'necklace':
        basePrice = 750;
        break;
      case 'bracelet':
        basePrice = 650;
        break;
      case 'earrings':
        basePrice = 800;
        break;
      default:
        basePrice = 500;
    }
    
    // Add price for metal using METALS data
    if (selectedMetal && METALS[selectedMetal]) {
      basePrice += METALS[selectedMetal].pricePerGram * 5; // Assuming 5 grams of metal
    }
    
    // Add price for gemstone if selected
    if (selectedGem && GEMSTONES[selectedGem]) {
      basePrice += GEMSTONES[selectedGem].pricePerCarat * 0.5; // Assuming 0.5 carat gemstone
    }
    
    // Add price for design style
    switch (designStyle.id) {
      case 'solitaire':
        basePrice += 0; // Basic design, no additional cost
        break;
      case 'halo':
        basePrice += 350; // More complex with additional stones
        break;
      case 'three-stone':
        basePrice += 450; // Multiple main stones
        break;
      case 'vintage':
        basePrice += 250; // Detailed craftsmanship
        break;
      case 'minimalist':
        basePrice += 100; // Simple design
        break;
    }
    
    // Add price for engraving
    if (engravingText.trim()) {
      basePrice += 50;
    }
    
    setTotalPrice(basePrice);
  }, [productType.id, designStyle.id, selectedMetal, selectedGem, engravingText]);
  
  // Mark a step as completed
  const completeStep = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };
  
  // Go to the next step
  const goToNextStep = () => {
    completeStep(currentStep);
    setCurrentStep(currentStep + 1);
  };
  
  // Go to a specific step
  const goToStep = (step: number) => {
    if (step <= Math.max(...completedSteps, 0) + 1) {
      setCurrentStep(step);
    }
  };
  
  // Check if we can proceed to the next step
  const canProceed = () => {
    switch (currentStep) {
      case 0: // Product type
        return true; // Always can proceed from first step
      case 1: // Design style
        return true; // Always can proceed from design step
      case 2: // Materials
        return !!selectedMetal; // Need to select a metal
      case 3: // Size
        return productType.id !== 'ring' || !!selectedSize; // Need size for rings
      case 4: // Personalization
        return true; // Can always proceed
      default:
        return false;
    }
  };
  
  // Steps in the customization process
  const steps = [
    { 
      title: 'Jewelry Type', 
      description: 'Select what type of jewelry you want to create' 
    },
    { 
      title: 'Design Style', 
      description: 'Choose a design style that matches your preference' 
    },
    { 
      title: 'Materials', 
      description: 'Select the metal and gemstone for your piece' 
    },
    { 
      title: 'Size', 
      description: 'Determine the right size for your jewelry' 
    },
    { 
      title: 'Personalization', 
      description: 'Add personal touches like engraving' 
    },
    { 
      title: 'Review', 
      description: 'Review your custom design before ordering' 
    }
  ];
  
  // Add item to wishlist
  const addToWishlist = () => {
    // Generate a unique ID for the wishlist item
    const newItemId = `wish_${Date.now()}`;
    
    // Create a new wishlist item
    const newItem = {
      id: newItemId,
      productType: productType.name,
      designStyle: designStyle.name,
      metalType: selectedMetal,
      gemType: selectedGem || null,
      price: totalPrice,
    };
    
    // Add the new item to the wishlist
    setWishlistItems([...wishlistItems, newItem]);
    
    // Show confirmation toast
    alert("Item added to wishlist!");
  };
  
  // Save design functionality
  const saveDesign = () => {
    const designData = {
      productType: productType.id,
      designStyle: designStyle.id,
      metal: selectedMetal,
      gem: selectedGem,
      size: selectedSize,
      engraving: engravingText,
      totalPrice: totalPrice,
      savedAt: new Date().toISOString(),
    };
    
    // Convert to JSON string
    const designJSON = JSON.stringify(designData);
    
    // Save to localStorage
    const savedDesigns = JSON.parse(localStorage.getItem('savedDesigns') || '[]');
    savedDesigns.push(designData);
    localStorage.setItem('savedDesigns', JSON.stringify(savedDesigns));
    
    // Show confirmation
    alert("Your design has been saved! You can access it later from your account.");
  };
  
  // Share design on social media
  const shareDesign = (platform: 'facebook' | 'twitter' | 'pinterest' | 'email') => {
    const designTitle = `Custom ${productType.name} with ${METALS[selectedMetal].displayName}${selectedGem ? ` and ${GEMSTONES[selectedGem].displayName}` : ''}`;
    const designDescription = `Check out this custom jewelry design I created!`;
    const designPrice = `$${totalPrice.toLocaleString()}`;
    const shareUrl = window.location.href;
    
    // Different share URLs based on platform
    let shareLink = '';
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(designTitle)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(designTitle + ' - ' + designPrice)}`;
        break;
      case 'pinterest':
        shareLink = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(designTitle)}&media=${encodeURIComponent(window.location.origin + '/images/products/' + productType.id + '-template.png')}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(designTitle)}&body=${encodeURIComponent(designDescription + '\n\n' + shareUrl)}`;
        break;
    }
    
    // Open in new window
    if (shareLink) {
      window.open(shareLink, '_blank');
    }
  };
  
  // Function to generate recommendations
  const generateRecommendation = (type: 'occasion' | 'budget', value: string) => {
    setRecommendationType(type);
    
    // Simulated AI recommendation (in a real app, this would call an API)
    let recommendation = {
      title: '',
      description: '',
      metalSuggestion: 'gold' as MetalType,
      gemSuggestion: 'diamond' as GemstoneType,
      designStyleSuggestion: 'solitaire'
    };
    
    if (type === 'occasion') {
      switch (value) {
        case 'wedding':
          recommendation = {
            title: 'Wedding Collection',
            description: 'Classic and timeless pieces that symbolize your eternal bond.',
            metalSuggestion: 'platinum',
            gemSuggestion: 'diamond',
            designStyleSuggestion: 'vintage'
          };
          break;
        case 'engagement':
          recommendation = {
            title: 'Engagement Perfection',
            description: 'Make the moment unforgettable with these stunning designs.',
            metalSuggestion: 'whitegold',
            gemSuggestion: 'diamond',
            designStyleSuggestion: 'halo'
          };
          break;
        case 'anniversary':
          recommendation = {
            title: 'Anniversary Celebration',
            description: 'Commemorate your journey together with these special pieces.',
            metalSuggestion: 'rosegold',
            gemSuggestion: 'sapphire',
            designStyleSuggestion: 'three-stone'
          };
          break;
        case 'birthday':
          recommendation = {
            title: 'Birthday Treat',
            description: 'Celebrate another year with something that sparkles as bright as you.',
            metalSuggestion: 'gold',
            gemSuggestion: 'ruby',
            designStyleSuggestion: 'minimalist'
          };
          break;
        default:
          recommendation = {
            title: 'Perfect Gift',
            description: 'A beautiful piece that will be cherished forever.',
            metalSuggestion: 'silver',
            gemSuggestion: 'emerald',
            designStyleSuggestion: 'minimalist'
          };
      }
    } else if (type === 'budget') {
      // Budget-based recommendations
      const budgetNum = parseInt(value, 10);
      
      if (budgetNum <= 500) {
        recommendation = {
          title: 'Elegant Essentials',
          description: 'Beautiful designs that complement any style without breaking the bank.',
          metalSuggestion: 'silver',
          gemSuggestion: null,
          designStyleSuggestion: 'minimalist'
        };
      } else if (budgetNum <= 1000) {
        recommendation = {
          title: 'Premium Selection',
          description: 'Quality craftsmanship with carefully selected materials.',
          metalSuggestion: 'gold',
          gemSuggestion: 'amethyst',
          designStyleSuggestion: 'solitaire'
        };
      } else if (budgetNum <= 2500) {
        recommendation = {
          title: 'Luxury Collection',
          description: 'Exquisite pieces with premium materials and intricate details.',
          metalSuggestion: 'rosegold',
          gemSuggestion: 'sapphire',
          designStyleSuggestion: 'vintage'
        };
      } else {
        recommendation = {
          title: 'Ultimate Luxury',
          description: 'The most extraordinary pieces from our master craftsmen.',
          metalSuggestion: 'platinum',
          gemSuggestion: 'diamond',
          designStyleSuggestion: 'halo'
        };
      }
    }
    
    setRecommendationResult(recommendation);
    setShowRecommendations(true);
  };
  
  // Apply AI recommendation
  const applyRecommendation = () => {
    if (!recommendationResult) return;
    
    // Find the matching design style
    const matchingStyle = DESIGN_STYLES.find(style => style.id === recommendationResult.designStyleSuggestion);
    
    if (matchingStyle) {
      setDesignStyle(matchingStyle);
    }
    
    // Update metal and gemstone
    setSelectedMetal(recommendationResult.metalSuggestion);
    
    // Handle gemstone with proper type checking
    const gemSuggestion = recommendationResult.gemSuggestion;
    if (gemSuggestion && 
        ['diamond', 'ruby', 'sapphire', 'emerald', 'amethyst', 'topaz', 'pearl'].includes(gemSuggestion)) {
      setSelectedGem(gemSuggestion as 'diamond' | 'ruby' | 'sapphire' | 'emerald' | 'amethyst' | 'topaz' | 'pearl');
    } else {
      setSelectedGem(undefined);
    }
    
    // Close recommendation panel
    setShowRecommendations(false);
    
    // Show success message
    alert('AI recommendation applied! Explore your personalized design.');
  };
  
  // Add current configuration to comparison
  const addToComparison = () => {
    // Generate a unique ID
    const newComparisonId = `compare_${Date.now()}`;
    
    // Create new comparison item
    const newItem = {
      id: newComparisonId,
      productType: {...productType},
      designStyle: {...designStyle},
      metal: selectedMetal,
      gem: selectedGem,
      price: totalPrice,
      modelPath: modelPath
    };
    
    // Add to comparison items (limit to 3)
    if (comparisonItems.length < 3) {
      setComparisonItems([...comparisonItems, newItem]);
      
      // If we have at least 2 items, enable compare mode
      if (comparisonItems.length >= 1) {
        setCompareMode(true);
      }
      
      // Show confirmation
      alert("Added to comparison! You can compare up to 3 designs.");
    } else {
      alert("You can only compare up to 3 designs. Please remove one before adding another.");
    }
  };

  // Remove from comparison
  const removeFromComparison = (id: string) => {
    const updatedItems = comparisonItems.filter(item => item.id !== id);
    setComparisonItems(updatedItems);
    
    // If less than 2 items, disable compare mode
    if (updatedItems.length < 2) {
      setCompareMode(false);
    }
  };

  // Toggle comparison view
  const toggleCompareMode = () => {
    if (comparisonItems.length >= 2) {
      setCompareMode(!compareMode);
    } else {
      alert("Add at least 2 designs to compare.");
    }
  };
  
  // Toggle preview animation
  const togglePreviewAnimation = () => {
    setShowPreviewAnimation(!showPreviewAnimation);
  };
  
  // Function to apply trending style
  const applyTrendingStyle = (style: typeof TRENDING_STYLES[0]) => {
    // Find matching product type and design style
    const matchingProductType = PRODUCT_TYPES.find(p => p.id === style.suggestions.productType);
    const matchingDesignStyle = DESIGN_STYLES.find(d => d.id === style.suggestions.designStyle);
    
    // Apply the selections
    if (matchingProductType) setProductType(matchingProductType);
    if (matchingDesignStyle) setDesignStyle(matchingDesignStyle);
    
    // Set metal and gemstone with proper type casting
    setSelectedMetal(style.suggestions.metal);
    
    // Handle gemstone with proper type checking to avoid type errors
    if (style.suggestions.gem) {
      const gem = style.suggestions.gem;
      // Ensure we only use gemstone types that are valid in our system
      if (gemTypes.includes(gem as any)) {
        setSelectedGem(gem as 'diamond' | 'ruby' | 'sapphire' | 'emerald' | 'amethyst' | 'topaz' | 'pearl');
      } else {
        // Default to a safe option if gem type isn't recognized
        setSelectedGem('diamond');
        console.warn(`Gemstone type "${gem}" not recognized, defaulting to diamond`);
      }
    } else {
      setSelectedGem(undefined);
    }
    
    // Close the trending styles modal
    setShowTrendingSuggestions(false);
    
    // Go to appropriate step
    goToStep(3); // Go to materials step
  };
  
  // Toggle virtual try-on
  const toggleVirtualTryOn = () => {
    setShowVirtualTryOn(!showVirtualTryOn);
  };
  
  // Toggle gift registry modal
  const toggleGiftRegistry = () => {
    setShowGiftRegistry(!showGiftRegistry);
  };
  
  // Add to registry function
  const addToRegistry = (platform: string) => {
    alert(`Your item has been added to your ${platform} ${selectedRegistry} registry!`);
    toggleGiftRegistry();
  };

  // Toggle gift packaging modal
  const toggleGiftPackaging = () => {
    setShowGiftPackaging(!showGiftPackaging);
  };
  
  // Calculate packaging cost
  const getPackagingCost = () => {
    return GIFT_BOXES[selectedBox].price + GIFT_WRAPPING[selectedWrapping].price;
  };
  
  // Add gift packaging to the total price
  useEffect(() => {
    if (selectedBox !== 'classic' || selectedWrapping !== 'none') {
      const packagingCost = getPackagingCost();
      setTotalPrice(prevPrice => prevPrice + packagingCost);
    }
  }, [selectedBox, selectedWrapping]);

  // In the component, use the useQualitySettings hook
  const { settings, capabilities } = useQualitySettings(performanceSettings.quality);

  return (
    <div className="relative">
      {/* Steps indicator */}
      <div className="mb-8">
        {/* ... existing step indicators ... */}
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column: 3D viewer */}
        <div className="md:w-1/2 flex flex-col">
          <div className="bg-white p-6 rounded-lg shadow-md mb-4">
            {/* Pass performance settings to the EnhancedJewelryViewer and enable performance stats */}
            <EnhancedJewelryViewer
              modelPath={modelPath}
              selectedMetal={selectedMetal}
              selectedGem={selectedGem}
              environmentPreset="jewelry_store"
              enableBloom={performanceSettings.enableBloom}
              enableShadows={performanceSettings.enableShadows}
              rotationSpeed={0.5}
              key={viewerKey}
              enableZoom={true}
              quality={performanceSettings.quality === 'auto' ? 'medium' : performanceSettings.quality}
              showPerformanceStats={true}
            />
          </div>
          
          {/* Add Performance Recommendations */}
          <PerformanceRecommendations 
            className="mb-4"
            onQualityChange={(quality) => {
              setPerformanceSettings(prev => ({
                ...prev,
                quality,
                enableShadows: quality !== 'low',
                enableBloom: quality !== 'low',
                enableReflections: quality !== 'low',
              }));
            }}
          />
          
          {/* Performance Settings Panel */}
          <PerformanceSettingsPanel />
        </div>
        
        {/* Right column: Customization controls */}
        <div className="md:w-1/2">
          {/* ... existing customization controls ... */}
        </div>
      </div>
    </div>
  );
} 