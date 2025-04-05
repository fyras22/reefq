import { MetalType, GemstoneType } from '@/data/materialsData';

export interface CustomizationSettings {
  productType: string;
  designStyle: string;
  metal: string;
  gemstone: string | null;
  gemCount: number;
  size: number | null;
  engravingText: string;
  culturalStyle: string;
  chainStyle?: string;
  backingStyle?: string;
  giftWrapping: boolean;
}

export interface CustomDesign {
  id: string;
  name: string;
  settings: CustomizationSettings;
  previewImage: string;
  createdAt: Date;
  price: number;
  isPublic: boolean;
  userId?: string | null; // User ID for owned designs
}

// Mock popular designs data
const POPULAR_DESIGNS: CustomDesign[] = [
  {
    id: 'popular-1',
    name: 'Classic Solitaire',
    settings: {
      productType: 'ring',
      designStyle: 'solitaire',
      metal: 'platinum',
      gemstone: 'diamond',
      gemCount: 1,
      size: 6.5,
      engravingText: '',
      culturalStyle: 'default',
      giftWrapping: false
    },
    previewImage: '/images/designs/classic-solitaire.jpg',
    createdAt: new Date('2023-06-15'),
    price: 2499,
    isPublic: true
  },
  {
    id: 'popular-2',
    name: 'Vintage Halo',
    settings: {
      productType: 'ring',
      designStyle: 'vintage',
      metal: 'rosegold',
      gemstone: 'sapphire',
      gemCount: 9,
      size: 7,
      engravingText: '',
      culturalStyle: 'default',
      giftWrapping: false
    },
    previewImage: '/images/designs/vintage-halo.jpg',
    createdAt: new Date('2023-07-22'),
    price: 1899,
    isPublic: true
  },
  {
    id: 'popular-3',
    name: 'Art Deco Pendant',
    settings: {
      productType: 'pendant',
      designStyle: 'art-deco',
      metal: 'whitegold',
      gemstone: 'emerald',
      gemCount: 3,
      size: null,
      engravingText: '',
      culturalStyle: 'default',
      giftWrapping: true
    },
    previewImage: '/images/designs/art-deco-pendant.jpg',
    createdAt: new Date('2023-09-05'),
    price: 1299,
    isPublic: true
  }
];

// Mock AI recommendation engine
export function getRecommendationsByOccasion(occasion: string): Partial<CustomizationSettings> {
  const recommendations: Record<string, Partial<CustomizationSettings>> = {
    'wedding': {
      designStyle: 'vintage',
      metal: 'platinum',
      gemstone: 'diamond',
      gemCount: 7,
      culturalStyle: 'default'
    },
    'engagement': {
      designStyle: 'solitaire',
      metal: 'platinum',
      gemstone: 'diamond',
      gemCount: 1,
      culturalStyle: 'default'
    },
    'anniversary': {
      designStyle: 'three-stone',
      metal: 'gold',
      gemstone: 'ruby',
      gemCount: 3,
      culturalStyle: 'default'
    },
    'birthday': {
      designStyle: 'minimalist',
      metal: 'rosegold',
      gemstone: 'amethyst',
      gemCount: 1,
      culturalStyle: 'default'
    },
    'graduation': {
      designStyle: 'minimalist',
      metal: 'silver',
      gemstone: 'sapphire',
      gemCount: 1,
      culturalStyle: 'default'
    }
  };
  
  return recommendations[occasion] || {};
}

export function getRecommendationsByBudget(budget: number): Partial<CustomizationSettings> {
  // Simple budget-based recommendation algorithm
  if (budget < 500) {
    return {
      designStyle: 'minimalist',
      metal: 'silver',
      gemstone: 'amethyst',
      gemCount: 1,
      culturalStyle: 'default'
    };
  } else if (budget < 1000) {
    return {
      designStyle: 'solitaire',
      metal: 'gold',
      gemstone: 'topaz',
      gemCount: 1,
      culturalStyle: 'default'
    };
  } else if (budget < 2000) {
    return {
      designStyle: 'vintage',
      metal: 'rosegold',
      gemstone: 'sapphire',
      gemCount: 3,
      culturalStyle: 'default'
    };
  } else {
    return {
      designStyle: 'halo',
      metal: 'platinum',
      gemstone: 'diamond',
      gemCount: 7,
      culturalStyle: 'default'
    };
  }
}

export function getRecommendationsByPersonality(personality: string): Partial<CustomizationSettings> {
  const recommendations: Record<string, Partial<CustomizationSettings>> = {
    'classic': {
      designStyle: 'solitaire',
      metal: 'platinum',
      gemstone: 'diamond',
      culturalStyle: 'default'
    },
    'bold': {
      designStyle: 'art-deco',
      metal: 'gold',
      gemstone: 'ruby',
      culturalStyle: 'default'
    },
    'romantic': {
      designStyle: 'vintage',
      metal: 'rosegold',
      gemstone: 'sapphire',
      culturalStyle: 'default'
    },
    'nature': {
      designStyle: 'nature-inspired',
      metal: 'whitegold',
      gemstone: 'emerald',
      culturalStyle: 'default'
    }
  };
  
  return recommendations[personality] || {};
}

// User's saved designs functions
const STORAGE_KEY = 'user_jewelry_designs';

export function saveUserDesign(design: Omit<CustomDesign, 'id' | 'createdAt'>): CustomDesign {
  // Create a new design with ID and date
  const newDesign: CustomDesign = {
    ...design,
    id: `design-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date()
  };
  
  // Get existing designs
  const existingDesigns = getUserDesigns();
  
  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...existingDesigns, newDesign]));
  
  return newDesign;
}

export function getUserDesigns(): CustomDesign[] {
  if (typeof window === 'undefined') return [];
  
  const storedDesigns = localStorage.getItem(STORAGE_KEY);
  if (!storedDesigns) return [];
  
  try {
    const designs = JSON.parse(storedDesigns) as CustomDesign[];
    // Convert string dates back to Date objects
    return designs.map(design => ({
      ...design,
      createdAt: new Date(design.createdAt)
    }));
  } catch (error) {
    console.error('Error parsing saved designs:', error);
    return [];
  }
}

export function deleteUserDesign(id: string): boolean {
  const designs = getUserDesigns();
  const filteredDesigns = designs.filter(design => design.id !== id);
  
  if (filteredDesigns.length === designs.length) {
    return false; // No design was removed
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredDesigns));
  return true;
}

export function getPopularDesigns(): CustomDesign[] {
  return POPULAR_DESIGNS;
}

// Calculate price based on customization settings
export function calculatePrice(settings: CustomizationSettings): number {
  let basePrice = 0;
  
  // Base price by product type
  switch (settings.productType) {
    case 'ring':
      basePrice = 500;
      break;
    case 'necklace':
      basePrice = 450;
      break;
    case 'bracelet':
      basePrice = 400;
      break;
    case 'earrings':
      basePrice = 350;
      break;
    case 'pendant':
      basePrice = 300;
      break;
    default:
      basePrice = 300;
  }
  
  // Add cost for design style complexity
  switch (settings.designStyle) {
    case 'halo':
      basePrice *= 1.4;
      break;
    case 'three-stone':
      basePrice *= 1.3;
      break;
    case 'vintage':
      basePrice *= 1.5;
      break;
    case 'art-deco':
      basePrice *= 1.6;
      break;
    case 'minimalist':
      basePrice *= 0.9;
      break;
  }
  
  // Add cost for metal
  switch (settings.metal) {
    case 'platinum':
      basePrice += 400;
      break;
    case 'gold':
      basePrice += 300;
      break;
    case 'rosegold':
      basePrice += 250;
      break;
    case 'whitegold':
      basePrice += 275;
      break;
    case 'silver':
      basePrice += 100;
      break;
  }
  
  // Add cost for gemstone
  if (settings.gemstone) {
    switch (settings.gemstone) {
      case 'diamond':
        basePrice += 800;
        break;
      case 'ruby':
      case 'sapphire':
        basePrice += 600;
        break;
      case 'emerald':
        basePrice += 500;
        break;
      case 'amethyst':
        basePrice += 200;
        break;
      case 'topaz':
        basePrice += 150;
        break;
      case 'pearl':
        basePrice += 100;
        break;
    }
    
    // Multiply by gem count
    if (settings.gemCount > 1) {
      // Discount per additional gem (economies of scale)
      const additionalGemPrice = (basePrice * 0.7) * (settings.gemCount - 1);
      basePrice += additionalGemPrice;
    }
  }
  
  // Add cost for cultural style
  if (settings.culturalStyle !== 'default') {
    basePrice += 150;
  }
  
  // Add cost for engraving
  if (settings.engravingText.length > 0) {
    basePrice += 50;
  }
  
  // Add cost for gift wrapping
  if (settings.giftWrapping) {
    basePrice += 25;
  }
  
  return Math.round(basePrice);
}

// Get compatible gemstones for a given metal (for better aesthetic combinations)
export function getCompatibleGemstones(metalId: string): string[] {
  const compatibilityMap: Record<string, string[]> = {
    'gold': ['diamond', 'ruby', 'sapphire', 'emerald', 'topaz'],
    'rosegold': ['diamond', 'morganite', 'amethyst', 'ruby'],
    'whitegold': ['diamond', 'sapphire', 'emerald', 'amethyst'],
    'platinum': ['diamond', 'sapphire', 'ruby', 'emerald'],
    'silver': ['amethyst', 'topaz', 'pearl', 'opal']
  };
  
  return compatibilityMap[metalId] || ['diamond', 'ruby', 'sapphire', 'emerald', 'amethyst', 'topaz', 'pearl'];
} 