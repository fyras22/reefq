/**
 * Media Assets Manager
 * 
 * Centralized management of all media assets including:
 * - Product images
 * - Diamond and gemstone images
 * - 3D models
 * - AR content
 */

// Base URLs for different asset types
const BASE_ASSETS_URL = '/assets';
const BASE_IMAGES_URL = `${BASE_ASSETS_URL}/images`;
const BASE_MODELS_URL = `${BASE_ASSETS_URL}/models`;
const BASE_AR_URL = `${BASE_ASSETS_URL}/ar`;

// Jewelry Types
export enum JewelryType {
  RING = 'rings',
  NECKLACE = 'necklaces',
  EARRING = 'earrings',
  BRACELET = 'bracelets'
}

// Diamond Cut Types
export enum DiamondCut {
  ROUND = 'round',
  PRINCESS = 'princess',
  CUSHION = 'cushion',
  OVAL = 'oval',
  EMERALD = 'emerald',
  ASSCHER = 'asscher',
  MARQUISE = 'marquise',
  PEAR = 'pear',
  RADIANT = 'radiant',
  HEART = 'heart'
}

// Diamond Color Grades
export enum DiamondColor {
  D = 'd', // Colorless
  E = 'e', // Colorless
  F = 'f', // Colorless
  G = 'g', // Near Colorless
  H = 'h', // Near Colorless
  I = 'i', // Near Colorless
  J = 'j', // Near Colorless
  K = 'k'  // Faint Color
}

// Diamond Clarity Grades
export enum DiamondClarity {
  FL = 'fl',    // Flawless
  IF = 'if',    // Internally Flawless
  VVS1 = 'vvs1', // Very Very Slightly Included 1
  VVS2 = 'vvs2', // Very Very Slightly Included 2
  VS1 = 'vs1',  // Very Slightly Included 1
  VS2 = 'vs2',  // Very Slightly Included 2
  SI1 = 'si1',  // Slightly Included 1
  SI2 = 'si2'   // Slightly Included 2
}

// Gemstone Types
export enum GemstoneType {
  DIAMOND = 'diamond',
  RUBY = 'ruby',
  SAPPHIRE = 'sapphire',
  EMERALD = 'emerald',
  AMETHYST = 'amethyst'
}

// Metal Types
export enum MetalType {
  YELLOW_GOLD = 'yellow-gold',
  WHITE_GOLD = 'white-gold',
  ROSE_GOLD = 'rose-gold',
  PLATINUM = 'platinum',
  SILVER = 'silver'
}

// Image Views
export enum ImageView {
  TOP = 'top',
  ANGLE = 'angle',
  SIDE = 'side',
  FRONT = 'front',
  FULL = 'full',
  DETAIL = 'detail'
}

// 3D Model File Types
export enum ModelFormat {
  GLB = 'glb',
  USDZ = 'usdz'
}

// Interfaces
export interface ProductImageSet {
  thumbnails: Partial<Record<ImageView, string>>;
  fullSize: Partial<Record<ImageView, string>>;
}

export interface ModelSet {
  web: string; // GLB format
  ios: string; // USDZ format
}

export interface DiamondAsset {
  cut: DiamondCut;
  images: Partial<Record<ImageView, string>>;
  model?: ModelSet;
}

// Helper Functions

/**
 * Generate path for a product image
 */
export function getProductImagePath(
  jewelryType: JewelryType,
  productName: string,
  view: ImageView = ImageView.TOP,
  isThumbnail: boolean = false
): string {
  const folder = isThumbnail ? 'thumbnails' : 'products';
  return `${BASE_IMAGES_URL}/${folder}/${jewelryType}/${productName}/${view}.jpg`;
}

/**
 * Generate path for a 3D model
 */
export function getModelPath(
  jewelryType: JewelryType,
  productName: string,
  format: ModelFormat = ModelFormat.GLB
): string {
  return `${BASE_MODELS_URL}/${format}/${jewelryType}/${productName}.${format}`;
}

/**
 * Generate path for a diamond image
 */
export function getDiamondImagePath(
  cut: DiamondCut,
  view: ImageView = ImageView.TOP
): string {
  return `${BASE_IMAGES_URL}/diamonds/${cut}/${cut}-${view}.png`;
}

/**
 * Generate path for a diamond clarity example
 */
export function getDiamondClarityImagePath(clarity: DiamondClarity): string {
  return `${BASE_IMAGES_URL}/diamonds/clarity/clarity-${clarity}.jpg`;
}

/**
 * Generate path for a diamond color example
 */
export function getDiamondColorImagePath(color: DiamondColor): string {
  return `${BASE_IMAGES_URL}/diamonds/colors/color-${color}.jpg`;
}

/**
 * Generate path for a gemstone image
 */
export function getGemstoneImagePath(type: GemstoneType): string {
  return `${BASE_IMAGES_URL}/gemstones/${type}.jpg`;
}

/**
 * Generate path for a metal texture
 */
export function getMetalTexturePath(metal: MetalType): string {
  return `${BASE_IMAGES_URL}/metals/${metal}.jpg`;
}

/**
 * Generate path for a jewelry icon
 */
export function getJewelryIconPath(type: JewelryType): string {
  return `${BASE_IMAGES_URL}/icons/${type.slice(0, -1)}-icon.svg`;
}

/**
 * Generate path for a diamond cut icon
 */
export function getDiamondCutIconPath(cut: DiamondCut): string {
  return `${BASE_IMAGES_URL}/icons/${cut}-cut.svg`;
}

// Sample Assets - Used in the application

/**
 * Get product assets for a specific jewelry type
 */
export function getProductAssets(jewelryType: JewelryType, productName: string) {
  return {
    name: productName,
    type: jewelryType,
    images: {
      thumbnails: {
        [ImageView.TOP]: getProductImagePath(jewelryType, productName, ImageView.TOP, true),
        [ImageView.ANGLE]: getProductImagePath(jewelryType, productName, ImageView.ANGLE, true),
        [ImageView.SIDE]: getProductImagePath(jewelryType, productName, ImageView.SIDE, true),
      },
      fullSize: {
        [ImageView.TOP]: getProductImagePath(jewelryType, productName, ImageView.TOP, false),
        [ImageView.ANGLE]: getProductImagePath(jewelryType, productName, ImageView.ANGLE, false),
        [ImageView.SIDE]: getProductImagePath(jewelryType, productName, ImageView.SIDE, false),
        [ImageView.DETAIL]: getProductImagePath(jewelryType, productName, ImageView.DETAIL, false),
      }
    },
    models: {
      web: getModelPath(jewelryType, productName, ModelFormat.GLB),
      ios: getModelPath(jewelryType, productName, ModelFormat.USDZ)
    }
  };
}

/**
 * Get diamond assets for a specific cut
 */
export function getDiamondAssets(cut: DiamondCut): DiamondAsset {
  return {
    cut,
    images: {
      [ImageView.TOP]: getDiamondImagePath(cut, ImageView.TOP),
      [ImageView.ANGLE]: getDiamondImagePath(cut, ImageView.ANGLE),
      [ImageView.SIDE]: getDiamondImagePath(cut, ImageView.SIDE),
    },
    model: {
      web: getModelPath(JewelryType.RING, `diamond-${cut}`, ModelFormat.GLB),
      ios: getModelPath(JewelryType.RING, `diamond-${cut}`, ModelFormat.USDZ)
    }
  };
}

/**
 * Get educational assets for diamond 4Cs
 */
export function getDiamond4CsAssets() {
  return {
    clarity: {
      fl: getDiamondClarityImagePath(DiamondClarity.FL),
      if: getDiamondClarityImagePath(DiamondClarity.IF),
      vvs1: getDiamondClarityImagePath(DiamondClarity.VVS1),
      vvs2: getDiamondClarityImagePath(DiamondClarity.VVS2),
      vs1: getDiamondClarityImagePath(DiamondClarity.VS1),
      vs2: getDiamondClarityImagePath(DiamondClarity.VS2),
      si1: getDiamondClarityImagePath(DiamondClarity.SI1),
      si2: getDiamondClarityImagePath(DiamondClarity.SI2),
      comparison: `${BASE_IMAGES_URL}/diamonds/clarity/clarity-grades.jpg`
    },
    color: {
      d: getDiamondColorImagePath(DiamondColor.D),
      e: getDiamondColorImagePath(DiamondColor.E),
      f: getDiamondColorImagePath(DiamondColor.F),
      g: getDiamondColorImagePath(DiamondColor.G),
      h: getDiamondColorImagePath(DiamondColor.H),
      i: getDiamondColorImagePath(DiamondColor.I),
      j: getDiamondColorImagePath(DiamondColor.J),
      k: getDiamondColorImagePath(DiamondColor.K),
      comparison: `${BASE_IMAGES_URL}/diamonds/colors/color-grades.jpg`
    },
    cut: Object.values(DiamondCut).reduce((acc, cut) => {
      acc[cut] = getDiamondImagePath(cut as DiamondCut, ImageView.TOP);
      return acc;
    }, {} as Record<string, string>)
  };
}

// Sample Jewelry Products
export const sampleProducts = {
  rings: {
    'diamond-solitaire': getProductAssets(JewelryType.RING, 'diamond-solitaire'),
    'ruby-solitaire': getProductAssets(JewelryType.RING, 'ruby-solitaire'),
    'sapphire-solitaire': getProductAssets(JewelryType.RING, 'sapphire-solitaire'),
  },
  necklaces: {
    'diamond-pendant': getProductAssets(JewelryType.NECKLACE, 'diamond-pendant'),
    'sapphire-pendant': getProductAssets(JewelryType.NECKLACE, 'sapphire-pendant'),
  },
  earrings: {
    'diamond-studs': getProductAssets(JewelryType.EARRING, 'diamond-studs'),
  },
  bracelets: {
    'diamond-tennis': getProductAssets(JewelryType.BRACELET, 'diamond-tennis'),
  }
};

// Sample Diamond Assets
export const diamondAssets = Object.values(DiamondCut).reduce((acc, cut) => {
  acc[cut] = getDiamondAssets(cut as DiamondCut);
  return acc;
}, {} as Record<string, DiamondAsset>);

// Export everything
export default {
  getProductImagePath,
  getModelPath,
  getDiamondImagePath,
  getDiamondClarityImagePath,
  getDiamondColorImagePath,
  getGemstoneImagePath,
  getMetalTexturePath,
  getJewelryIconPath,
  getDiamondCutIconPath,
  getProductAssets,
  getDiamondAssets,
  getDiamond4CsAssets,
  sampleProducts,
  diamondAssets,
  BASE_IMAGES_URL,
  BASE_MODELS_URL,
  BASE_AR_URL
}; 