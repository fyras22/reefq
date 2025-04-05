'use client';

import * as tf from '@tensorflow/tfjs';
// Remove the HandLandmark import since we define it below
import { Vector3 } from 'three';

// Measurement constants for typical proportions 
const TYPICAL_FINGER_WIDTHS = {
  thumb: 20.0, // mm
  index: 16.5,  // mm
  middle: 16.7, // mm
  ring: 15.8,   // mm
  pinky: 14.2   // mm
};

// Average knuckle widths by finger
const TYPICAL_KNUCKLE_WIDTHS = {
  thumb: 25.0,  // mm
  index: 19.5,  // mm
  middle: 19.7, // mm
  ring: 18.2,   // mm
  pinky: 16.0   // mm
};

// Constants for various finger sizes
export const FINGER_SIZE_LANDMARKS = {
  RING_BASE: 13, // Base of ring finger
  RING_PIP: 14,  // PIP joint of ring finger (middle knuckle)
  RING_DIP: 15,  // DIP joint of ring finger (end knuckle)
  RING_TIP: 16,  // Tip of ring finger
  
  // Reference landmarks from other fingers to improve measurement
  MIDDLE_BASE: 9,
  MIDDLE_PIP: 10,
  PINKY_BASE: 17,
  
  // Wrist landmarks for scale reference
  WRIST_CENTER: 0,
  WRIST_THUMB_SIDE: 1,
  WRIST_PINKY_SIDE: 17
};

// Calibration methods
export enum CalibrationMethod {
  USING_CREDIT_CARD = 'credit_card',
  USING_COIN = 'coin',
  USING_KNOWN_RING = 'known_ring',
  CAMERA_DISTANCE = 'camera_distance'
}

// Interface for calibration data
export interface CalibrationData {
  method: CalibrationMethod;
  referenceObjectWidth?: number; // mm
  referenceObjectWidthInPixels?: number;
  knownRingSize?: number; // US size
  cameraDistance?: number; // mm
  pixelsPerMillimeter?: number;
}

// Define our own HandLandmark interface to match what we need
export interface HandLandmark {
  x: number;
  y: number;
  z?: number;
  score?: number;
}

/**
 * Calculate distance between two landmarks in pixels
 */
export function landmarkDistance(a: HandLandmark, b: HandLandmark): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = (a.z || 0) - (b.z || 0);
  
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Calculate distance between multiple landmarks to get a more accurate average
 */
export function averageLandmarkDistance(
  landmarks: HandLandmark[], 
  pairs: Array<[number, number]>
): number {
  if (!landmarks || landmarks.length === 0 || pairs.length === 0) {
    return 0;
  }
  
  let totalDistance = 0;
  for (const [index1, index2] of pairs) {
    if (landmarks[index1] && landmarks[index2]) {
      totalDistance += landmarkDistance(landmarks[index1], landmarks[index2]);
    }
  }
  
  return totalDistance / pairs.length;
}

/**
 * Create a calibration object
 */
export function createCalibration(
  method: CalibrationMethod, 
  options: {
    referenceObjectWidth?: number,
    referenceObjectWidthInPixels?: number,
    knownRingSize?: number,
    cameraDistance?: number
  }
): CalibrationData {
  const calibration: CalibrationData = { 
    method,
    ...options
  };
  
  // Calculate pixelsPerMillimeter based on the provided information
  if (method === CalibrationMethod.USING_CREDIT_CARD || 
      method === CalibrationMethod.USING_COIN) {
    if (options.referenceObjectWidth && options.referenceObjectWidthInPixels) {
      calibration.pixelsPerMillimeter = options.referenceObjectWidthInPixels / options.referenceObjectWidth;
    }
  }
  
  return calibration;
}

/**
 * Get the ring finger width at a specific position
 * @param landmarks Hand landmarks from the hand pose detector
 * @param position Which part of the finger to measure ('base', 'middle', or 'tip')
 * @param calibration Calibration data for pixel-to-mm conversion
 * @returns Width in millimeters or 0 if unable to calculate
 */
export function getRingFingerWidth(
  landmarks: HandLandmark[],
  position: 'base' | 'middle' | 'tip',
  calibration: CalibrationData
): number {
  if (!landmarks || landmarks.length < 21 || !calibration.pixelsPerMillimeter) {
    return 0;
  }
  
  // Define measurement points based on position
  let measurementPoints: [number, number][] = [];
  
  switch (position) {
    case 'base':
      measurementPoints = [
        [FINGER_SIZE_LANDMARKS.RING_BASE, FINGER_SIZE_LANDMARKS.MIDDLE_BASE],
        [FINGER_SIZE_LANDMARKS.RING_BASE, FINGER_SIZE_LANDMARKS.PINKY_BASE]
      ];
      break;
    case 'middle': 
      // For the middle of the finger, we need to calculate the width directly
      // since we don't have a direct landmark for the sides of the finger
      return estimateFingerWidthAtPosition(landmarks, FINGER_SIZE_LANDMARKS.RING_PIP, calibration);
    case 'tip':
      // For the tip, we also need to estimate
      return estimateFingerWidthAtPosition(landmarks, FINGER_SIZE_LANDMARKS.RING_DIP, calibration);
    default:
      return 0;
  }
  
  // Average the measured distances and convert to mm
  const avgPixelDistance = averageLandmarkDistance(landmarks, measurementPoints);
  return avgPixelDistance / calibration.pixelsPerMillimeter;
}

/**
 * Estimate finger width at a specific landmark position
 * Uses the depth information to approximate the finger width
 */
function estimateFingerWidthAtPosition(
  landmarks: HandLandmark[],
  landmarkIndex: number,
  calibration: CalibrationData
): number {
  if (!landmarks || landmarks.length < 21 || !calibration.pixelsPerMillimeter) {
    return 0;
  }
  
  // We'll use the fact that fingers are roughly cylindrical
  // and estimate width based on the visual width and depth information
  
  // First, find landmarks just before and after the target
  const prevLandmarkIndex = landmarkIndex - 1;
  const nextLandmarkIndex = landmarkIndex + 1;
  
  if (!landmarks[prevLandmarkIndex] || !landmarks[nextLandmarkIndex]) {
    return 0;
  }
  
  // Get the finger's direction vector
  const dirX = landmarks[nextLandmarkIndex].x - landmarks[prevLandmarkIndex].x;
  const dirY = landmarks[nextLandmarkIndex].y - landmarks[prevLandmarkIndex].y;
  const dirZ = (landmarks[nextLandmarkIndex].z || 0) - (landmarks[prevLandmarkIndex].z || 0);
  
  // Normalize the direction vector
  const length = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
  const normX = dirX / length;
  const normY = dirY / length;
  const normZ = dirZ / length;
  
  // Generate a perpendicular vector in the plane of the screen
  const perpX = -normY;
  const perpY = normX;
  
  // Estimate the width by measuring perpendicular to the finger direction
  // We create two points slightly offset from the landmark in perpendicular directions
  const offset = 0.02; // Small offset to sample nearby points
  
  const point1: HandLandmark = {
    x: landmarks[landmarkIndex].x + perpX * offset,
    y: landmarks[landmarkIndex].y + perpY * offset,
    z: landmarks[landmarkIndex].z,
    score: landmarks[landmarkIndex].score
  };
  
  const point2: HandLandmark = {
    x: landmarks[landmarkIndex].x - perpX * offset,
    y: landmarks[landmarkIndex].y - perpY * offset,
    z: landmarks[landmarkIndex].z,
    score: landmarks[landmarkIndex].score
  };
  
  // Calculate pixel distance between the points
  const pixelDistance = landmarkDistance(point1, point2);
  
  // Apply a correction factor based on the finger's angle to the camera
  // (the more the finger points toward/away from camera, the more we correct)
  const angleCorrection = 1.0 / Math.abs(normZ);
  const correctedDistance = pixelDistance * (angleCorrection > 2.0 ? 2.0 : angleCorrection);
  
  // Convert to millimeters
  let widthMm = correctedDistance / calibration.pixelsPerMillimeter;
  
  // Apply a scaling based on which finger this is
  // For ring finger, we can use typical proportions
  widthMm = widthMm * (TYPICAL_FINGER_WIDTHS.ring / 15.0);
  
  return widthMm;
}

/**
 * Get the recommended ring size based on the measured finger width
 * @param fingerWidthMm Finger width in millimeters
 * @param position Which part of the finger was measured
 * @returns US ring size
 */
export function calculateRingSizeFromFingerWidth(
  fingerWidthMm: number,
  position: 'base' | 'middle' | 'tip' = 'base'
): number {
  if (fingerWidthMm <= 0) {
    return 0;
  }
  
  // Calculate inner diameter (approximation)
  // Finger diameter ≈ finger width * 1.13 (accounting for oval shape)
  const fingerDiameterMm = fingerWidthMm * 1.13;
  
  // For ring sizing, we need some additional adjustments based on where the measurement was taken
  let adjustedDiameterMm = fingerDiameterMm;
  
  switch (position) {
    case 'base':
      // Base measurements are usually good as-is
      break;
    case 'middle':
      // Middle of finger is typically narrower than the base
      adjustedDiameterMm = fingerDiameterMm * 1.08;
      break;
    case 'tip':
      // Tip is much narrower, so we need a larger adjustment
      adjustedDiameterMm = fingerDiameterMm * 1.15;
      break;
  }
  
  // Calculate ring size based on the diameter
  // The formula is an approximation: US Ring Size ≈ (Diameter in mm - 11.53) * 0.8 + 1
  let usRingSize = (adjustedDiameterMm - 11.53) * 0.8 + 1;
  
  // Round to nearest half size
  usRingSize = Math.round(usRingSize * 2) / 2;
  
  // Enforce valid range
  return Math.max(3, Math.min(15, usRingSize));
}

/**
 * Create a Three.js Vector3 from a hand landmark
 */
export function landmarkToVector3(landmark: HandLandmark): Vector3 {
  return new Vector3(
    landmark.x,
    landmark.y,
    landmark.z || 0 // Ensure z is always a number by defaulting to 0
  );
}

/**
 * Find the optimal position to place a ring on the finger
 * @returns Position vector in 3D space and normal vector for orientation
 */
export function getRingPlacementPosition(
  landmarks: HandLandmark[]
): { position: Vector3, normal: Vector3, width: number } {
  if (!landmarks || landmarks.length < 21) {
    return { 
      position: new Vector3(), 
      normal: new Vector3(0, 0, 1),
      width: 0
    };
  }
  
  // Get ring finger landmarks
  const base = landmarkToVector3(landmarks[FINGER_SIZE_LANDMARKS.RING_BASE]);
  const pip = landmarkToVector3(landmarks[FINGER_SIZE_LANDMARKS.RING_PIP]);
  const dip = landmarkToVector3(landmarks[FINGER_SIZE_LANDMARKS.RING_DIP]);
  const tip = landmarkToVector3(landmarks[FINGER_SIZE_LANDMARKS.RING_TIP]);
  
  // Find the position between base and pip (best position for a ring)
  // We place it at 1/3 distance from base to pip
  const t = 0.33; // Placement position (0.0 = base, 1.0 = pip)
  const position = new Vector3().lerpVectors(base, pip, t);
  
  // Calculate finger direction for ring orientation
  const direction = new Vector3().subVectors(pip, base).normalize();
  
  // Calculate a normal vector perpendicular to the finger direction
  // This is used to orient the ring on the finger
  const up = new Vector3(0, 1, 0);
  const normal = new Vector3().crossVectors(direction, up).normalize();
  if (normal.length() < 0.1) {
    // If finger is pointing up, choose a different reference vector
    const alt = new Vector3(1, 0, 0);
    normal.crossVectors(direction, alt).normalize();
  }
  
  // Estimate finger width at the chosen position
  // This is a rough approximation based on the distance between
  // landmarks and known finger proportions
  const baseWidth = base.distanceTo(landmarks[FINGER_SIZE_LANDMARKS.MIDDLE_BASE]);
  const width = baseWidth * 0.85; // Ring finger is typically narrower than the gap between fingers
  
  return { position, normal, width };
}

/**
 * Detect if a calibration card/reference object is in the frame
 * @param imageData ImageData from a canvas or video frame
 * @returns Position and dimensions of detected card, or null if not found
 */
export async function detectCalibrationCard(
  imageData: ImageData
): Promise<{ x: number, y: number, width: number, height: number } | null> {
  // This would use TensorFlow.js to detect a credit card or other reference object
  // For the demo, we'll just return a placeholder implementation
  
  // In a real implementation, this would use a model to detect credit cards
  // or use computer vision techniques to find rectangular objects
  
  return null; // Placeholder
}

/**
 * Utility function to extract hand position and angle for AR placement
 */
export function calculateHandOrientation(
  landmarks: HandLandmark[]
): { 
  palmCenter: Vector3, 
  palmNormal: Vector3, 
  palmDirection: Vector3, 
  fingerDirections: Vector3[] 
} {
  if (!landmarks || landmarks.length < 21) {
    return {
      palmCenter: new Vector3(),
      palmNormal: new Vector3(0, 0, 1),
      palmDirection: new Vector3(0, 1, 0),
      fingerDirections: [
        new Vector3(), new Vector3(), 
        new Vector3(), new Vector3(), new Vector3()
      ]
    };
  }
  
  // Palm center is average of palm landmarks
  const wrist = landmarkToVector3(landmarks[0]);
  const indexBase = landmarkToVector3(landmarks[5]);
  const middleBase = landmarkToVector3(landmarks[9]);
  const ringBase = landmarkToVector3(landmarks[13]);
  const pinkyBase = landmarkToVector3(landmarks[17]);
  
  const palmCenter = new Vector3()
    .add(wrist).add(indexBase).add(middleBase)
    .add(ringBase).add(pinkyBase)
    .divideScalar(5);
  
  // Calculate palm normal (vector perpendicular to palm)
  const v1 = new Vector3().subVectors(indexBase, wrist);
  const v2 = new Vector3().subVectors(pinkyBase, wrist);
  const palmNormal = new Vector3().crossVectors(v1, v2).normalize();
  
  // Palm direction (pointing from wrist to middle finger)
  const palmDirection = new Vector3().subVectors(middleBase, wrist).normalize();
  
  // Calculate finger directions
  const fingerBases = [
    landmarkToVector3(landmarks[1]), // thumb
    indexBase,
    middleBase,
    ringBase,
    pinkyBase
  ];
  
  const fingerTips = [
    landmarkToVector3(landmarks[4]), // thumb
    landmarkToVector3(landmarks[8]), // index
    landmarkToVector3(landmarks[12]), // middle
    landmarkToVector3(landmarks[16]), // ring
    landmarkToVector3(landmarks[20])  // pinky
  ];
  
  const fingerDirections = fingerTips.map((tip, i) => 
    new Vector3().subVectors(tip, fingerBases[i]).normalize()
  );
  
  return { palmCenter, palmNormal, palmDirection, fingerDirections };
} 