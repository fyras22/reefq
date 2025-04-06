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
  
  // Gift box options with pricing
  const GIFT_BOXES = {
    classic: { 
      name: 'Classic Box', 
      description: 'Elegant black velvet box with satin interior', 
      price: 15,
      image: '/images/packaging/classic-box.png'
    },
    premium: { 
      name: 'Premium Box', 
      description: 'Wooden box with custom engraving option and LED lighting', 
      price: 35,
      image: '/images/packaging/premium-box.png'
    },
    luxury: { 
      name: 'Luxury Box', 
      description: 'Handcrafted leather case with gold accents and certificate of authenticity', 
      price: 75,
      image: '/images/packaging/luxury-box.png'
    }
  };
  
  // Gift wrapping options
  const GIFT_WRAPPING = {
    none: { 
      name: 'No Wrapping', 
      description: 'Just the gift box', 
      price: 0,
      image: '/images/packaging/no-wrapping.png'
    },
    ribbon: { 
      name: 'Ribbon', 
      description: 'Elegant satin ribbon with bow', 
      price: 8,
      image: '/images/packaging/ribbon.png'
    },
    paper: { 
      name: 'Gift Paper', 
      description: 'Premium wrapping paper with ribbon', 
      price: 12,
      image: '/images/packaging/gift-paper.png'
    }
  };
  
  // Skin tone options for visualization
  const SKIN_TONES = [
    { id: 'fair', name: 'Fair', color: '#F8D9C0' },
    { id: 'medium', name: 'Medium', color: '#E5C298' },
    { id: 'olive', name: 'Olive', color: '#C5A679' },
    { id: 'tan', name: 'Tan', color: '#A67B52' },
    { id: 'deep', name: 'Deep', color: '#794E3D' },
  ];
  
  // Gift registry integration
  const [showGiftRegistry, setShowGiftRegistry] = useState(false);
  const [selectedRegistry, setSelectedRegistry] = useState<'wedding' | 'baby' | 'anniversary' | 'birthday'>('wedding');
  const [giftMessage, setGiftMessage] = useState('');
  
  // Registry platform options
  const REGISTRY_PLATFORMS = [
    'Zola', 'The Knot', 'Amazon', 'Macy\'s'
  ];
  
  // Update model path when selections change
  useEffect(() => {
    // In a real app, you'd have more models and dynamically select them
    // This is just a simple example
    if (productType.id === 'ring') {
      if (designStyle.id === 'solitaire') {
        setModelPath('/models/jewelry/ring-solitaire.glb');
      } else if (designStyle.id === 'halo') {
        setModelPath('/models/jewelry/ring-halo.glb');
      } else if (designStyle.id === 'three-stone') {
        setModelPath('/models/jewelry/ring-three-stone.glb');
      } else {
        setModelPath('/models/jewelry/ring-solitaire.glb');
      }
    } else if (productType.id === 'necklace') {
      setModelPath('/models/jewelry/necklace.glb');
    } else if (productType.id === 'bracelet') {
      setModelPath('/models/jewelry/bracelet.glb');
    } else if (productType.id === 'earrings') {
      setModelPath('/models/jewelry/earrings.glb');
    }
    
    // Force re-render of the 3D viewer
    setViewerKey(prev => prev + 1);
  }, [productType.id, designStyle.id]);
  
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

  // Make sure the component is properly closed
  return (
    {/* Component JSX */}
  );
} // End of JewelryCustomizer component