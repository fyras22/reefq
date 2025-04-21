export type RingSize = {
  us: number;
  uk: number | string;
  eu: number | string;
  diameter: number; // mm
  circumference: number; // mm
};

export type BraceletSize = {
  size: string;
  cm: number;
  inches: number;
  wristCircumference: {
    min: number; // cm
    max: number; // cm
  };
};

export type NecklaceSize = {
  type: string;
  inches: number;
  cm: number;
  description: string;
};

export type EarringSize = {
  type: string;
  mm: number;
  description: string;
};

// Ring size data with conversions between US, UK, EU systems and diameters
export const ringSizes = [
  { us: 3, uk: "F", eu: 44, diameter: 1.4 },
  { us: 3.5, uk: "G", eu: 45.5, diameter: 1.45 },
  { us: 4, uk: "H", eu: 47, diameter: 1.5 },
  { us: 4.5, uk: "I", eu: 48.5, diameter: 1.55 },
  { us: 5, uk: "J", eu: 50, diameter: 1.6 },
  { us: 5.5, uk: "K", eu: 51, diameter: 1.65 },
  { us: 6, uk: "L", eu: 52, diameter: 1.67 },
  { us: 6.5, uk: "M", eu: 53, diameter: 1.72 },
  { us: 7, uk: "N", eu: 54, diameter: 1.76 },
  { us: 7.5, uk: "O", eu: 55, diameter: 1.79 },
  { us: 8, uk: "P", eu: 57, diameter: 1.82 },
  { us: 8.5, uk: "Q", eu: 58, diameter: 1.86 },
  { us: 9, uk: "R", eu: 59, diameter: 1.9 },
  { us: 9.5, uk: "S", eu: 60, diameter: 1.93 },
  { us: 10, uk: "T", eu: 61.5, diameter: 1.97 },
  { us: 10.5, uk: "U", eu: 63, diameter: 2.01 },
  { us: 11, uk: "V", eu: 64, diameter: 2.05 },
  { us: 11.5, uk: "W", eu: 65, diameter: 2.09 },
  { us: 12, uk: "X", eu: 66.5, diameter: 2.13 },
  { us: 12.5, uk: "Z", eu: 68, diameter: 2.17 },
  { us: 13, uk: "Z+1", eu: 69, diameter: 2.2 }
];

// Bracelet size data with conversions between letter sizing and measurements
export const braceletSizes = [
  { size: "XS", cm: "14-15", inches: "5.5-6.0" },
  { size: "S", cm: "15-16", inches: "6.0-6.5" },
  { size: "M", cm: "16-17", inches: "6.5-6.75" },
  { size: "L", cm: "17-18", inches: "6.75-7.0" },
  { size: "XL", cm: "18-19", inches: "7.0-7.5" },
  { size: "XXL", cm: "19-20", inches: "7.5-8.0" }
];

// Necklace types with standard lengths and descriptions
export const necklaceSizes = [
  { 
    type: "Collar", 
    inches: 14, 
    cm: 35, 
    description: "Sits tightly around the neck" 
  },
  { 
    type: "Choker", 
    inches: 16, 
    cm: 40, 
    description: "Sits at the base of the neck" 
  },
  { 
    type: "Princess", 
    inches: 18, 
    cm: 45, 
    description: "Sits on or just below the collarbone" 
  },
  { 
    type: "Matinee", 
    inches: 20, 
    cm: 50, 
    description: "Sits between the collarbone and the bust" 
  },
  { 
    type: "Opera", 
    inches: 24, 
    cm: 60, 
    description: "Sits at or below the bust line" 
  },
  { 
    type: "Rope", 
    inches: 36, 
    cm: 90, 
    description: "Can be worn as a single long strand or doubled" 
  }
];

// Earring sizes with types and descriptions
export const earringSizes = [
  { 
    type: "Stud", 
    mm: 3, 
    description: "Tiny studs, subtle and minimalist" 
  },
  { 
    type: "Small Stud", 
    mm: 5, 
    description: "Classic small studs, everyday wear" 
  },
  { 
    type: "Medium Stud", 
    mm: 7, 
    description: "Medium-sized statement studs" 
  },
  { 
    type: "Large Stud", 
    mm: 10, 
    description: "Larger statement studs" 
  },
  { 
    type: "Small Drop", 
    mm: 15, 
    description: "Small hanging earrings" 
  },
  { 
    type: "Medium Drop", 
    mm: 25, 
    description: "Medium length drops or dangles" 
  },
  { 
    type: "Long Drop", 
    mm: 50, 
    description: "Long statement dangles or chandeliers" 
  }
];

// Utility functions for size conversions

/**
 * Size conversion utilities for jewelry measurements
 */

/**
 * Convert inner diameter in millimeters to US ring size
 * @param diameterMm - Inner diameter of the ring in mm
 * @returns US ring size
 */
export function diameterToUSRingSize(diameterMm: number): number {
  // Formula based on standard US ring sizing
  const size = (diameterMm / 0.81) - 11.11;
  return Math.round(size * 2) / 2; // Round to nearest half size
}

/**
 * Convert US ring size to other sizing standards
 * @param usSize - US ring size
 * @param targetStandard - Target sizing standard ('uk', 'eu', or 'mm')
 * @returns Converted ring size in the target standard
 */
export function convertRingSize(usSize: number, targetStandard: 'uk' | 'eu' | 'mm'): string | number {
  // Conversion formulas for different standards
  switch(targetStandard) {
    case 'uk':
      // US to UK conversion (approximate)
      const ukSizeNum = usSize - 2;
      const ukLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Z'];
      const index = Math.round(ukSizeNum * 2);
      return index >= 0 && index < ukLetters.length ? ukLetters[index] : 'Unknown';
      
    case 'eu':
      // US to European conversion
      return Math.round(usSize * 2 + 32.5);
      
    case 'mm':
      // US to diameter in mm
      return (usSize + 11.11) * 0.81;
      
    default:
      return usSize;
  }
}

/**
 * Convert inches to centimeters
 * @param inches - Length in inches
 * @returns Length in centimeters
 */
export function convertToCentimeters(inches: number): number {
  return inches * 2.54;
}

/**
 * Convert centimeters to inches
 * @param cm - Length in centimeters
 * @returns Length in inches
 */
export function convertToInches(cm: number): number {
  return cm / 2.54;
}

/**
 * Get wrist size description based on circumference
 * @param circumferenceCm - Wrist circumference in cm
 * @returns Description of wrist size
 */
export function getWristSizeDescription(circumferenceCm: number): string {
  if (circumferenceCm < 14) return 'Very Slim';
  if (circumferenceCm < 16) return 'Slim';
  if (circumferenceCm < 19) return 'Average';
  if (circumferenceCm < 21) return 'Large';
  return 'Very Large';
}

/**
 * Calculate bracelet size based on wrist measurement
 * @param wristCircumferenceCm - Wrist circumference in cm
 * @param fitPreference - Preferred fit ('snug', 'regular', 'loose')
 * @returns Recommended bracelet size ('XS', 'S', 'M', 'L', 'XL')
 */
export function calculateBraceletSize(
  wristCircumferenceCm: number, 
  fitPreference: 'snug' | 'regular' | 'loose' = 'regular'
): string {
  // Add extra room based on fit preference
  let totalCircumference = wristCircumferenceCm;
  if (fitPreference === 'regular') totalCircumference += 1;
  if (fitPreference === 'loose') totalCircumference += 2;
  
  // Determine size based on total circumference
  if (totalCircumference < 15) return 'XS';
  if (totalCircumference < 17) return 'S';
  if (totalCircumference < 19) return 'M';
  if (totalCircumference < 21) return 'L';
  return 'XL';
}

/**
 * Calculate necklace length based on neck size
 * @param neckCircumferenceCm - Neck circumference in cm
 * @param style - Desired necklace style ('choker', 'princess', 'matinee', 'opera', 'rope')
 * @returns Recommended necklace length in inches
 */
export function calculateNecklaceLength(
  neckCircumferenceCm: number,
  style: 'choker' | 'princess' | 'matinee' | 'opera' | 'rope'
): number {
  // Convert neck circumference to inches
  const neckCircumferenceInches = convertToInches(neckCircumferenceCm);
  
  // Add length based on desired style
  switch(style) {
    case 'choker':
      return Math.round(neckCircumferenceInches + 2);
    case 'princess':
      return Math.round(neckCircumferenceInches + 4);
    case 'matinee':
      return Math.round(neckCircumferenceInches + 8);
    case 'opera':
      return Math.round(neckCircumferenceInches + 14);
    case 'rope':
      return Math.round(neckCircumferenceInches + 24);
  }
} 