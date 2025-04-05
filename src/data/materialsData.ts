/**
 * Comprehensive materials data for jewelry customization
 */

export type MetalType = 'gold' | 'silver' | 'platinum' | 'rosegold' | 'whitegold';
export type GemstoneType = 'diamond' | 'ruby' | 'sapphire' | 'emerald' | 'amethyst' | 'topaz' | 'pearl' | 'morganite' | 'opal' | null;

// Metal properties
export interface MetalProperties {
  name: string;
  color: string;
  density: number; // g/cm³
  reflectivity: number; // 0-1
  roughness: number; // 0-1
  displayName: string;
  description: string;
  pricePerGram: number; // in dollars
}

// Gemstone properties
export interface GemstoneProperties {
  name: string;
  color: string;
  refractionIndex: number;
  hardness: number; // Mohs scale
  clarity: number; // 0-1
  dispersion: number; // 0-1
  displayName: string;
  description: string;
  pricePerCarat: number; // in dollars
}

export const METALS: Record<MetalType, MetalProperties> = {
  gold: {
    name: 'gold',
    color: '#FFD700',
    density: 19.32,
    reflectivity: 0.9,
    roughness: 0.18,
    displayName: 'Gold',
    description: 'Classic 14k yellow gold with warm, rich tones',
    pricePerGram: 65.0
  },
  silver: {
    name: 'silver',
    color: '#C0C0C0',
    density: 10.49,
    reflectivity: 0.95,
    roughness: 0.12,
    displayName: 'Sterling Silver',
    description: 'Pure 925 sterling silver with a bright, lustrous finish',
    pricePerGram: 0.85
  },
  platinum: {
    name: 'platinum',
    color: '#E5E4E2',
    density: 21.45,
    reflectivity: 0.8,
    roughness: 0.1,
    displayName: 'Platinum',
    description: 'Premium 950 platinum with a subtle, sophisticated shine',
    pricePerGram: 33.0
  },
  rosegold: {
    name: 'rosegold',
    color: '#B76E79',
    density: 15.5,
    reflectivity: 0.85,
    roughness: 0.15,
    displayName: 'Rose Gold',
    description: '14k rose gold with warm pink hues',
    pricePerGram: 55.0
  },
  whitegold: {
    name: 'whitegold',
    color: '#E8E8E8',
    density: 14.8,
    reflectivity: 0.87,
    roughness: 0.13,
    displayName: 'White Gold',
    description: '14k white gold with rhodium plating for extra brilliance',
    pricePerGram: 58.0
  }
};

export const GEMSTONES: Record<Exclude<GemstoneType, null>, GemstoneProperties> = {
  diamond: {
    name: 'diamond',
    color: '#F4F4F4',
    refractionIndex: 2.42,
    hardness: 10,
    clarity: 0.95,
    dispersion: 0.044,
    displayName: 'Diamond',
    description: 'Brilliant-cut diamond with exceptional clarity and sparkle',
    pricePerCarat: 6500
  },
  ruby: {
    name: 'ruby',
    color: '#E0115F',
    refractionIndex: 1.76,
    hardness: 9,
    clarity: 0.8,
    dispersion: 0.018,
    displayName: 'Ruby',
    description: 'Rich red ruby with excellent saturation and brilliance',
    pricePerCarat: 2000
  },
  sapphire: {
    name: 'sapphire',
    color: '#0F52BA',
    refractionIndex: 1.76,
    hardness: 9,
    clarity: 0.85,
    dispersion: 0.018,
    displayName: 'Blue Sapphire',
    description: 'Deep blue sapphire with excellent clarity and color',
    pricePerCarat: 1800
  },
  emerald: {
    name: 'emerald',
    color: '#50C878',
    refractionIndex: 1.57,
    hardness: 7.5,
    clarity: 0.7,
    dispersion: 0.014,
    displayName: 'Emerald',
    description: 'Vivid green emerald with characteristic inclusions',
    pricePerCarat: 1500
  },
  amethyst: {
    name: 'amethyst',
    color: '#9966CC',
    refractionIndex: 1.54,
    hardness: 7,
    clarity: 0.9,
    dispersion: 0.013,
    displayName: 'Amethyst',
    description: 'Rich purple amethyst with excellent transparency',
    pricePerCarat: 300
  },
  topaz: {
    name: 'topaz',
    color: '#FFC87C',
    refractionIndex: 1.61,
    hardness: 8,
    clarity: 0.85,
    dispersion: 0.014,
    displayName: 'Imperial Topaz',
    description: 'Golden-orange imperial topaz with warm tones',
    pricePerCarat: 600
  },
  pearl: {
    name: 'pearl',
    color: '#F5F5F1',
    refractionIndex: 1.52,
    hardness: 2.5,
    clarity: 0.0, // Pearls are opaque
    dispersion: 0.0, // Pearls don't have dispersion
    displayName: 'Pearl',
    description: 'Lustrous cultured pearl with excellent orient',
    pricePerCarat: 200
  },
  morganite: {
    name: 'morganite',
    color: '#F9D1D1',
    refractionIndex: 1.59,
    hardness: 7.5,
    clarity: 0.85,
    dispersion: 0.014,
    displayName: 'Morganite',
    description: 'Delicate pink-peach morganite with excellent clarity',
    pricePerCarat: 450
  },
  opal: {
    name: 'opal',
    color: '#E5E4E2',
    refractionIndex: 1.45,
    hardness: 5.5,
    clarity: 0.6,
    dispersion: 0.0, // Opals create color through diffraction, not dispersion
    displayName: 'Opal',
    description: 'Australian opal with vibrant play-of-color',
    pricePerCarat: 700
  }
};

// Utility functions

/**
 * Get metal by ID
 */
export function getMetalById(id: string): MetalProperties | undefined {
  return METALS[id as MetalType];
}

/**
 * Get gemstone by ID
 */
export function getGemstoneById(id: string): GemstoneProperties | undefined {
  return GEMSTONES[id as Exclude<GemstoneType, null>];
}

// Additional gemstone types just for the birthstone mapping
type ExtendedGemstoneType = GemstoneType | 'garnet' | 'aquamarine' | 'peridot' | 'turquoise';

/**
 * Get birthstone for a given month
 */
export function getBirthstoneForMonth(month: number): GemstoneType | undefined {
  // Month to birthstone mapping
  const birthstoneMap: Record<number, ExtendedGemstoneType> = {
    1: 'garnet', // January, not in our list
    2: 'amethyst', // February
    3: 'aquamarine', // March, not in our list
    4: 'diamond', // April
    5: 'emerald', // May
    6: 'pearl', // June
    7: 'ruby', // July
    8: 'peridot', // August, not in our list
    9: 'sapphire', // September
    10: 'opal', // October
    11: 'topaz', // November
    12: 'turquoise' // December, not in our list
  };
  
  const stone = birthstoneMap[month];
  
  // Check if stone exists and is in our GEMSTONES record
  if (stone && Object.keys(GEMSTONES).includes(stone as string)) {
    return stone as GemstoneType;
  }
  
  return undefined;
}

/**
 * Get all metals of a specific color
 */
export function getMetalsByColor(colorHex: string): MetalType[] {
  return Object.entries(METALS)
    .filter(([_, properties]) => properties.color === colorHex)
    .map(([key]) => key as MetalType);
}

/**
 * Get all gemstones of a specific color
 */
export function getGemstonesByColor(colorHex: string): GemstoneType[] {
  return Object.entries(GEMSTONES)
    .filter(([_, properties]) => properties.color === colorHex)
    .map(([key]) => key as GemstoneType);
}

// Map gemstone types to color categories for recommendations
const gemColorCategories: Record<Exclude<GemstoneType, null>, string> = {
  diamond: 'colorless',
  ruby: 'red',
  sapphire: 'blue',
  emerald: 'green',
  amethyst: 'purple',
  topaz: 'yellow',
  pearl: 'white',
  morganite: 'pink',
  opal: 'multicolor'
};

// Map metal types to color categories for recommendations
const metalColorCategories: Record<MetalType, string> = {
  gold: 'yellow',
  silver: 'white',
  platinum: 'white',
  rosegold: 'rose',
  whitegold: 'white'
};

/**
 * Get recommendations for complementary gemstones and metals
 */
export function getComplementaryPairings(metalId: MetalType, gemId?: GemstoneType): {
  recommendedGems?: GemstoneType[];
  recommendedMetals?: MetalType[];
} {
  const result: {
    recommendedGems?: GemstoneType[];
    recommendedMetals?: MetalType[];
  } = {};
  
  // If we have a gemstone, recommend complementary metals
  if (gemId && gemId !== null) {
    const gemColorCategory = gemColorCategories[gemId];
    
    // Recommend metals based on gemstone color
    switch (gemColorCategory) {
      case 'red':
      case 'pink':
        result.recommendedMetals = Object.entries(metalColorCategories)
          .filter(([_, colorCategory]) => ['white', 'rose'].includes(colorCategory))
          .map(([key]) => key as MetalType);
        break;
      case 'blue':
      case 'green':
        result.recommendedMetals = Object.entries(metalColorCategories)
          .filter(([_, colorCategory]) => ['white', 'yellow'].includes(colorCategory))
          .map(([key]) => key as MetalType);
        break;
      case 'purple':
        result.recommendedMetals = Object.entries(metalColorCategories)
          .filter(([_, colorCategory]) => ['white', 'rose'].includes(colorCategory))
          .map(([key]) => key as MetalType);
        break;
      case 'colorless':
      case 'white':
        // All metals complement colorless gems
        result.recommendedMetals = Object.keys(METALS) as MetalType[];
        break;
      default:
        result.recommendedMetals = Object.entries(metalColorCategories)
          .filter(([key, _]) => key !== metalId)
          .map(([key]) => key as MetalType);
    }
  } else {
    // If no gemstone selected, recommend complementary gems for the metal
    const metalColorCategory = metalColorCategories[metalId];
    
    switch (metalColorCategory) {
      case 'yellow':
        result.recommendedGems = Object.entries(gemColorCategories)
          .filter(([_, colorCategory]) => 
            ['blue', 'purple', 'green', 'colorless'].includes(colorCategory))
          .map(([key]) => key as GemstoneType);
        break;
      case 'white':
        // All gemstones work with white metals
        result.recommendedGems = Object.keys(GEMSTONES) as GemstoneType[];
        break;
      case 'rose':
        result.recommendedGems = Object.entries(gemColorCategories)
          .filter(([_, colorCategory]) => 
            ['purple', 'blue', 'colorless', 'green'].includes(colorCategory))
          .map(([key]) => key as GemstoneType);
        break;
      default:
        result.recommendedGems = Object.keys(GEMSTONES) as GemstoneType[];
    }
  }
  
  return result;
} 