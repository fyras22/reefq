// Ring size reference data
export interface RingSizeChart {
  usSize: number;
  ukSize: string;
  euSize: number;
  diameterMM: number;
  circumferenceMM: number;
}

export interface ReferenceObject {
  name: string;
  diameter: number;
  image: string;
}

// Complete international ring size chart with accurate measurements
export const RING_SIZE_CHART: RingSizeChart[] = [
  { usSize: 3, ukSize: "F", euSize: 44, diameterMM: 14.1, circumferenceMM: 44.2 },
  { usSize: 3.5, ukSize: "G", euSize: 45.5, diameterMM: 14.5, circumferenceMM: 45.5 },
  { usSize: 4, ukSize: "H", euSize: 47.5, diameterMM: 14.9, circumferenceMM: 46.8 },
  { usSize: 4.5, ukSize: "I", euSize: 48.5, diameterMM: 15.3, circumferenceMM: 48.0 },
  { usSize: 5, ukSize: "J 1/2", euSize: 49.5, diameterMM: 15.7, circumferenceMM: 49.3 },
  { usSize: 5.5, ukSize: "K 1/2", euSize: 50.5, diameterMM: 16.1, circumferenceMM: 50.6 },
  { usSize: 6, ukSize: "L 1/2", euSize: 51.5, diameterMM: 16.5, circumferenceMM: 51.9 },
  { usSize: 6.5, ukSize: "M 1/2", euSize: 53, diameterMM: 16.9, circumferenceMM: 53.1 },
  { usSize: 7, ukSize: "N 1/2", euSize: 54, diameterMM: 17.3, circumferenceMM: 54.4 },
  { usSize: 7.5, ukSize: "O 1/2", euSize: 55.5, diameterMM: 17.7, circumferenceMM: 55.7 },
  { usSize: 8, ukSize: "P 1/2", euSize: 57, diameterMM: 18.1, circumferenceMM: 56.9 },
  { usSize: 8.5, ukSize: "Q 1/2", euSize: 58, diameterMM: 18.5, circumferenceMM: 58.1 },
  { usSize: 9, ukSize: "R 1/2", euSize: 59, diameterMM: 18.9, circumferenceMM: 59.4 },
  { usSize: 9.5, ukSize: "S 1/2", euSize: 61, diameterMM: 19.3, circumferenceMM: 60.6 },
  { usSize: 10, ukSize: "T 1/2", euSize: 62, diameterMM: 19.7, circumferenceMM: 61.9 },
  { usSize: 10.5, ukSize: "U 1/2", euSize: 63.5, diameterMM: 20.1, circumferenceMM: 63.2 },
  { usSize: 11, ukSize: "V 1/2", euSize: 65, diameterMM: 20.5, circumferenceMM: 64.5 },
  { usSize: 11.5, ukSize: "W 1/2", euSize: 66.5, diameterMM: 20.9, circumferenceMM: 65.7 },
  { usSize: 12, ukSize: "Y", euSize: 67.5, diameterMM: 21.3, circumferenceMM: 67.0 },
  { usSize: 12.5, ukSize: "Z", euSize: 68.5, diameterMM: 21.7, circumferenceMM: 68.2 },
  { usSize: 13, ukSize: "Z+1", euSize: 69.5, diameterMM: 22.1, circumferenceMM: 69.5 },
  { usSize: 13.5, ukSize: "Z+2", euSize: 70.5, diameterMM: 22.5, circumferenceMM: 70.8 },
  { usSize: 14, ukSize: "Z+3", euSize: 71.5, diameterMM: 22.9, circumferenceMM: 72.0 },
];

// Common household objects with known diameters for reference
export const REFERENCE_OBJECTS: ReferenceObject[] = [
  { name: "AA Battery", diameter: 14.5, image: "/images/size-references/aa-battery.jpg" },
  { name: "AAA Battery", diameter: 10.5, image: "/images/size-references/aaa-battery.jpg" },
  { name: "Quarter (US)", diameter: 24.26, image: "/images/size-references/quarter.jpg" },
  { name: "Nickel (US)", diameter: 21.21, image: "/images/size-references/nickel.jpg" },
  { name: "Penny (US)", diameter: 19.05, image: "/images/size-references/penny.jpg" },
  { name: "Dime (US)", diameter: 17.91, image: "/images/size-references/dime.jpg" },
  { name: "1 Euro coin", diameter: 23.25, image: "/images/size-references/euro.jpg" },
  { name: "1 Pound coin (UK)", diameter: 23.43, image: "/images/size-references/pound.jpg" },
  { name: "Standard Pencil", diameter: 7.5, image: "/images/size-references/pencil.jpg" },
  { name: "Wine Bottle Cork", diameter: 18.5, image: "/images/size-references/cork.jpg" },
  { name: "CD/DVD Center Hole", diameter: 15.0, image: "/images/size-references/cd-hole.jpg" },
  { name: "Standard Soda Bottle Cap", diameter: 28.0, image: "/images/size-references/bottle-cap.jpg" },
  { name: "Standard Drinking Straw", diameter: 6.0, image: "/images/size-references/straw.jpg" },
  { name: "USB-C Connector", diameter: 8.4, image: "/images/size-references/usb-c.jpg" },
  { name: "Lightning Connector", diameter: 6.7, image: "/images/size-references/lightning.jpg" },
];

// Ring width adjustments (wide bands need larger sizes)
export const RING_WIDTH_ADJUSTMENTS = [
  { width: "< 2mm", adjustment: 0 },
  { width: "2-4mm", adjustment: 0.25 },
  { width: "4-6mm", adjustment: 0.5 },
  { width: "6-8mm", adjustment: 0.75 },
  { width: "8mm+", adjustment: 1.0 },
];

// Temperature adjustments for finger size
export const TEMPERATURE_ADJUSTMENTS = [
  { condition: "Cold (below 60°F/15°C)", adjustment: -0.5 },
  { condition: "Cool (60-70°F/15-21°C)", adjustment: -0.25 },
  { condition: "Normal (70-80°F/21-27°C)", adjustment: 0 },
  { condition: "Warm (80-90°F/27-32°C)", adjustment: 0.25 },
  { condition: "Hot (above 90°F/32°C)", adjustment: 0.5 },
];

// Time of day adjustments for finger size
export const TIME_ADJUSTMENTS = [
  { time: "Morning (6am-10am)", adjustment: -0.25 },
  { time: "Midday (10am-2pm)", adjustment: 0 },
  { time: "Afternoon (2pm-6pm)", adjustment: 0.25 },
  { time: "Evening (6pm-10pm)", adjustment: 0.5 },
  { time: "Night (10pm-6am)", adjustment: 0 },
];

/**
 * Find the closest ring size based on a diameter measurement
 */
export function findRingSizeByDiameter(diameterMM: number): RingSizeChart {
  if (!diameterMM || diameterMM <= 0) {
    return RING_SIZE_CHART[0]; // Default to smallest size if invalid input
  }
  
  let closestSize = RING_SIZE_CHART[0];
  let smallestDifference = Math.abs(RING_SIZE_CHART[0].diameterMM - diameterMM);
  
  for (let i = 1; i < RING_SIZE_CHART.length; i++) {
    const difference = Math.abs(RING_SIZE_CHART[i].diameterMM - diameterMM);
    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestSize = RING_SIZE_CHART[i];
    }
  }
  
  return closestSize;
}

/**
 * Find the closest ring size based on a circumference measurement
 */
export function findRingSizeByCircumference(circumferenceMM: number): RingSizeChart {
  if (!circumferenceMM || circumferenceMM <= 0) {
    return RING_SIZE_CHART[0]; // Default to smallest size if invalid input
  }
  
  let closestSize = RING_SIZE_CHART[0];
  let smallestDifference = Math.abs(RING_SIZE_CHART[0].circumferenceMM - circumferenceMM);
  
  for (let i = 1; i < RING_SIZE_CHART.length; i++) {
    const difference = Math.abs(RING_SIZE_CHART[i].circumferenceMM - circumferenceMM);
    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestSize = RING_SIZE_CHART[i];
    }
  }
  
  return closestSize;
}

// Convert between diameter and circumference
export function diameterToCircumference(diameterMM: number): number {
  return diameterMM * Math.PI;
}

export function circumferenceToDiameter(circumferenceMM: number): number {
  return circumferenceMM / Math.PI;
}

// Get surrounding sizes for a given size
export function getSurroundingSizes(usSize: number, count: number = 2): RingSizeChart[] {
  const index = RING_SIZE_CHART.findIndex(size => size.usSize === usSize);
  if (index === -1) return [];
  
  const start = Math.max(0, index - count);
  const end = Math.min(RING_SIZE_CHART.length - 1, index + count);
  
  return RING_SIZE_CHART.slice(start, end + 1);
}

/**
 * Find the closest reference object to a given diameter
 */
export function findClosestReferenceObject(diameterMM: number): ReferenceObject {
  if (!diameterMM || diameterMM <= 0 || REFERENCE_OBJECTS.length === 0) {
    return REFERENCE_OBJECTS[0]; // Default to first object if invalid input
  }
  
  let closestObject = REFERENCE_OBJECTS[0];
  let smallestDifference = Math.abs(REFERENCE_OBJECTS[0].diameter - diameterMM);
  
  for (let i = 1; i < REFERENCE_OBJECTS.length; i++) {
    const difference = Math.abs(REFERENCE_OBJECTS[i].diameter - diameterMM);
    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestObject = REFERENCE_OBJECTS[i];
    }
  }
  
  return closestObject;
} 