import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as THREE from 'three';

// Define a type for landmarks that matches what we're using in the code
type HandLandmark = {
  x: number;
  y: number;
  z?: number;
};

// Define finger landmarks indices for easy reference
const FINGER_INDICES = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
  palmBase: [0]
};

// Define hand gestures
export enum HandGesture {
  OPEN_PALM = 'open_palm',
  CLOSED_FIST = 'closed_fist',
  POINTING = 'pointing',
  PINCH = 'pinch',
  RING_FINGER_EXTENDED = 'ring_finger_extended',
  UNKNOWN = 'unknown'
}

// Define finger positions for specific jewelry types
export enum JewelryPlacement {
  RING_FINGER = 'ring_finger',
  WRIST = 'wrist',
  NECK = 'neck',
  EAR = 'ear',
  HAND = 'hand'
}

interface HandData {
  landmarks: handPoseDetection.Keypoint[];
  gesture: HandGesture;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
}

interface FingerData {
  landmarks: handPoseDetection.Keypoint[];
  direction: THREE.Vector3;
  length: number;
  isExtended: boolean;
  angleToHorizontal: number;
}

export class HandPoseDetector {
  private detector: handPoseDetection.HandDetector | null = null;
  private isRunning = false;
  private animationFrameId: number | null = null;
  private lastDetected: HandData[] = [];
  private gestureHistory: HandGesture[] = [];
  private stabilizationThreshold = 3; // Frames needed to confirm a gesture change
  private modelReady = false;
  private loadingPromise: Promise<void> | null = null;

  /**
   * Initialize the hand pose detector
   */
  async initialize(): Promise<void> {
    if (this.loadingPromise) return this.loadingPromise;
    
    this.loadingPromise = new Promise(async (resolve, reject) => {
      try {
        console.log('Initializing TensorFlow.js backend');
        await tf.setBackend('webgl');
        console.log('TensorFlow.js backend initialized');
        
        // Create hand pose detector model with improved parameters
        const model = handPoseDetection.SupportedModels.MediaPipeHands;
        const detectorConfig = {
          runtime: 'tfjs',
          modelType: 'full', // Use full model for better accuracy
          maxHands: 2,
          solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
          shouldLoadIrisModel: false, // We don't need iris tracking for jewelry
        } as handPoseDetection.MediaPipeHandsTfjsModelConfig;
        
        console.log('Creating hand pose detector');
        this.detector = await handPoseDetection.createDetector(model, detectorConfig);
        console.log('Hand pose detector created');
        
        this.modelReady = true;
        resolve();
      } catch (error) {
        console.error('Error initializing hand pose detector:', error);
        reject(error);
      }
    });
    
    return this.loadingPromise;
  }

  /**
   * Check if detector is initialized
   */
  isInitialized(): boolean {
    return this.modelReady && this.detector !== null;
  }

  /**
   * Start tracking hands in the video stream
   * @param videoElement - The video element containing the camera stream
   * @param callback - Function to call with the detected hand landmarks
   */
  startTracking(
    videoElement: HTMLVideoElement,
    callback: (
      hands: HandData[],
      placements: Map<JewelryPlacement, THREE.Vector3>
    ) => void
  ): void {
    if (!this.detector) {
      console.error('Hand pose detector not initialized');
      return;
    }

    this.isRunning = true;
    this.lastDetected = [];
    this.gestureHistory = [];
    
    const detectHands = async () => {
      if (!this.isRunning || !this.detector || !videoElement) {
        return;
      }
      
      try {
        // Detect hands in the current video frame
        const hands = await this.detector.estimateHands(videoElement);
        
        if (hands && hands.length > 0) {
          // Process detected hands
          const processedHands: HandData[] = hands.map(hand => {
            const landmarks = hand.keypoints;
            const boundingBox = this.calculateBoundingBox(landmarks);
            const gesture = this.recognizeGesture(landmarks);
            
            return {
              landmarks,
              gesture,
              boundingBox,
              confidence: hand.score || 0
            };
          });
          
          // Apply temporal stabilization
          this.stabilizeDetection(processedHands);
          
          // Calculate jewelry placement points
          const jewelryPlacements = this.calculateJewelryPlacements(processedHands);
          
          // Send processed hand data to callback
          callback(this.lastDetected, jewelryPlacements);
        } else if (this.lastDetected.length > 0) {
          // No hands detected in this frame, but we had hands before
          // Clear after a few frames to avoid flickering
          this.gestureHistory.push(HandGesture.UNKNOWN);
          if (this.gestureHistory.length > this.stabilizationThreshold * 2) {
            this.lastDetected = [];
            callback([], new Map());
          }
        }
      } catch (error) {
        console.error('Error detecting hands:', error);
      }
      
      // Continue detection loop
      this.animationFrameId = requestAnimationFrame(detectHands);
    };
    
    detectHands();
  }

  /**
   * Stop hand tracking
   */
  stopTracking(): void {
    this.isRunning = false;
    
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    this.lastDetected = [];
    this.gestureHistory = [];
  }

  /**
   * Calculate bounding box for hand landmarks
   */
  private calculateBoundingBox(landmarks: handPoseDetection.Keypoint[]): { x: number; y: number; width: number; height: number } {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    
    landmarks.forEach(point => {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    });
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  /**
   * Recognize hand gesture from landmarks
   */
  private recognizeGesture(landmarks: handPoseDetection.Keypoint[]): HandGesture {
    // Extract finger data
    const fingers = this.extractFingerData(landmarks);
    
    // Check for open palm
    if (fingers.filter(f => f.isExtended).length >= 4) {
      return HandGesture.OPEN_PALM;
    }
    
    // Check for closed fist
    if (fingers.filter(f => f.isExtended).length <= 1) {
      return HandGesture.CLOSED_FIST;
    }
    
    // Check for pointing (only index finger extended)
    if (!fingers[0].isExtended && fingers[1].isExtended && 
        !fingers[2].isExtended && !fingers[3].isExtended && !fingers[4].isExtended) {
      return HandGesture.POINTING;
    }
    
    // Check for pinch (thumb and index finger tips are close)
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const distance = Math.sqrt(
      Math.pow(thumbTip.x - indexTip.x, 2) + 
      Math.pow(thumbTip.y - indexTip.y, 2)
    );
    
    if (distance < 0.1) {
      return HandGesture.PINCH;
    }
    
    // Check for ring finger extended (useful for ring placement)
    if (!fingers[0].isExtended && !fingers[1].isExtended && 
        !fingers[2].isExtended && fingers[3].isExtended && !fingers[4].isExtended) {
      return HandGesture.RING_FINGER_EXTENDED;
    }
    
    return HandGesture.UNKNOWN;
  }

  /**
   * Extract finger data from landmarks
   */
  private extractFingerData(landmarks: handPoseDetection.Keypoint[]): FingerData[] {
    const wrist = landmarks[0];
    const fingers: FingerData[] = [];
    
    // Process each finger
    [
      FINGER_INDICES.thumb,
      FINGER_INDICES.indexFinger,
      FINGER_INDICES.middleFinger,
      FINGER_INDICES.ringFinger,
      FINGER_INDICES.pinky
    ].forEach(indices => {
      const fingerLandmarks = indices.map(i => landmarks[i]);
      
      // Calculate finger direction (from base to tip)
      const base = fingerLandmarks[1] || wrist;
      const tip = fingerLandmarks[fingerLandmarks.length - 1];
      
      const direction = new THREE.Vector3(
        tip.x - base.x,
        tip.y - base.y,
        (tip.z || 0) - (base.z || 0)
      ).normalize();
      
      // Calculate finger length (approximate)
      let length = 0;
      for (let i = 1; i < fingerLandmarks.length; i++) {
        const p1 = fingerLandmarks[i - 1];
        const p2 = fingerLandmarks[i];
        length += Math.sqrt(
          Math.pow(p2.x - p1.x, 2) + 
          Math.pow(p2.y - p1.y, 2) + 
          Math.pow((p2.z || 0) - (p1.z || 0), 2)
        );
      }
      
      // Determine if finger is extended
      const isExtended = this.isFingerExtended(fingerLandmarks);
      
      // Calculate angle to horizontal
      const horizontalVector = new THREE.Vector3(1, 0, 0);
      const angleToHorizontal = Math.acos(direction.dot(horizontalVector)) * (180 / Math.PI);
      
      fingers.push({
        landmarks: fingerLandmarks,
        direction,
        length,
        isExtended,
        angleToHorizontal
      });
    });
    
    return fingers;
  }

  /**
   * Determine if a finger is extended
   */
  private isFingerExtended(fingerLandmarks: handPoseDetection.Keypoint[]): boolean {
    if (fingerLandmarks.length < 3) return false;
    
    // For thumb (special case)
    if (fingerLandmarks.length === 5 && fingerLandmarks[1] === fingerLandmarks[1]) {
      const mcp = fingerLandmarks[1];
      const tip = fingerLandmarks[4];
      const wrist = fingerLandmarks[0];
      
      // Calculate angles and distances for thumb
      const wristToMcp = Math.sqrt(
        Math.pow(mcp.x - wrist.x, 2) + 
        Math.pow(mcp.y - wrist.y, 2)
      );
      
      const mcpToTip = Math.sqrt(
        Math.pow(tip.x - mcp.x, 2) + 
        Math.pow(tip.y - mcp.y, 2)
      );
      
      return mcpToTip > wristToMcp * 0.4;
    }
    
    // For other fingers
    const mcp = fingerLandmarks[1]; // Metacarpophalangeal joint (base of finger)
    const pip = fingerLandmarks[2]; // Proximal interphalangeal joint
    const dip = fingerLandmarks[3]; // Distal interphalangeal joint
    const tip = fingerLandmarks[4]; // Fingertip
    
    // Calculate vertical displacement
    const vertical = tip.y - mcp.y;
    
    // Calculate horizontal displacement
    const horizontal = Math.sqrt(
      Math.pow(tip.x - mcp.x, 2) + 
      Math.pow((tip.z || 0) - (mcp.z || 0), 2)
    );
    
    // If tip is significantly higher than base, finger is extended
    return vertical < -0.1 || (Math.abs(vertical) < 0.1 && horizontal > 0.1);
  }

  /**
   * Apply temporal stabilization to detected hands
   */
  private stabilizeDetection(detectedHands: HandData[]): void {
    if (detectedHands.length === 0) {
      return;
    }
    
    // If this is the first detection, simply use it
    if (this.lastDetected.length === 0) {
      this.lastDetected = detectedHands;
      this.gestureHistory = detectedHands.map(hand => hand.gesture);
      return;
    }
    
    // For each detected hand, find the best match in previous frame
    detectedHands.forEach(currentHand => {
      // Find the closest hand in the previous frame
      let bestMatchIndex = -1;
      let bestMatchDistance = Infinity;
      
      this.lastDetected.forEach((previousHand, index) => {
        const distance = this.calculateHandDistance(currentHand, previousHand);
        if (distance < bestMatchDistance) {
          bestMatchDistance = distance;
          bestMatchIndex = index;
        }
      });
      
      // If we found a reasonable match, apply stabilization
      if (bestMatchIndex !== -1 && bestMatchDistance < 0.3) {
        const previousHand = this.lastDetected[bestMatchIndex];
        
        // Stabilize landmark positions with exponential smoothing
        currentHand.landmarks.forEach((landmark, i) => {
          if (i < previousHand.landmarks.length) {
            landmark.x = landmark.x * 0.7 + previousHand.landmarks[i].x * 0.3;
            landmark.y = landmark.y * 0.7 + previousHand.landmarks[i].y * 0.3;
            if (landmark.z !== undefined && previousHand.landmarks[i].z !== undefined) {
              landmark.z = landmark.z * 0.7 + previousHand.landmarks[i].z * 0.3;
            }
          }
        });
        
        // Stabilize gesture recognition
        if (this.gestureHistory.length >= this.stabilizationThreshold) {
          this.gestureHistory.shift();
        }
        this.gestureHistory.push(currentHand.gesture);
        
        // Only change gesture if we've seen the same gesture for several frames
        const gestureFrequency: Map<HandGesture, number> = new Map();
        this.gestureHistory.forEach(gesture => {
          gestureFrequency.set(gesture, (gestureFrequency.get(gesture) || 0) + 1);
        });
        
        let mostFrequentGesture = HandGesture.UNKNOWN;
        let maxFrequency = 0;
        
        gestureFrequency.forEach((frequency, gesture) => {
          if (frequency > maxFrequency) {
            maxFrequency = frequency;
            mostFrequentGesture = gesture;
          }
        });
        
        if (maxFrequency >= this.stabilizationThreshold) {
          currentHand.gesture = mostFrequentGesture;
        } else {
          currentHand.gesture = previousHand.gesture;
        }
        
        // Update this hand in the last detected array
        this.lastDetected[bestMatchIndex] = currentHand;
      } else {
        // This is a new hand, add it to the last detected array
        this.lastDetected.push(currentHand);
        this.gestureHistory.push(currentHand.gesture);
      }
    });
    
    // Prune hands that are no longer detected
    if (this.lastDetected.length > detectedHands.length) {
      // Keep only hands that have a match in the current frame
      this.lastDetected = this.lastDetected.filter((previousHand, index) => {
        const hasMatch = detectedHands.some(currentHand => 
          this.calculateHandDistance(currentHand, previousHand) < 0.3
        );
        return hasMatch;
      });
    }
  }

  /**
   * Calculate distance between two detected hands
   */
  private calculateHandDistance(hand1: HandData, hand2: HandData): number {
    // Use wrist position as reference
    const wrist1 = hand1.landmarks[0];
    const wrist2 = hand2.landmarks[0];
    
    return Math.sqrt(
      Math.pow(wrist1.x - wrist2.x, 2) + 
      Math.pow(wrist1.y - wrist2.y, 2) + 
      Math.pow((wrist1.z || 0) - (wrist2.z || 0), 2)
    );
  }

  /**
   * Calculate jewelry placement points based on hand landmarks
   */
  private calculateJewelryPlacements(hands: HandData[]): Map<JewelryPlacement, THREE.Vector3> {
    const placements = new Map<JewelryPlacement, THREE.Vector3>();
    
    hands.forEach(hand => {
      const landmarks = hand.landmarks;
      
      // Calculate ring placement (base of ring finger)
      const ringFingerBase = landmarks[13]; // Ring finger MCP joint
      const ringFingerMiddle = landmarks[14]; // Ring finger PIP joint
      
      // Position the ring between the base and middle joint of the ring finger
      const ringPosition = new THREE.Vector3(
        ringFingerBase.x * 0.7 + ringFingerMiddle.x * 0.3,
        ringFingerBase.y * 0.7 + ringFingerMiddle.y * 0.3,
        (ringFingerBase.z || 0) * 0.7 + (ringFingerMiddle.z || 0) * 0.3
      );
      placements.set(JewelryPlacement.RING_FINGER, ringPosition);
      
      // Calculate bracelet placement (wrist)
      const wrist = landmarks[0];
      placements.set(JewelryPlacement.WRIST, new THREE.Vector3(
        wrist.x, 
        wrist.y, 
        wrist.z || 0
      ));
      
      // Calculate hand center (for general hand jewelry)
      const palmBase = landmarks[0];
      const middleFingerBase = landmarks[9];
      const handCenter = new THREE.Vector3(
        (palmBase.x + middleFingerBase.x) / 2,
        (palmBase.y + middleFingerBase.y) / 2,
        ((palmBase.z || 0) + (middleFingerBase.z || 0)) / 2
      );
      placements.set(JewelryPlacement.HAND, handCenter);
      
      // Note: Neck and ear placements would typically require face landmarks
      // which are not provided by the hand pose detector
    });
    
    return placements;
  }
}

// Ensure TensorFlow.js is available
declare global {
  const tf: {
    setBackend(backend: string): Promise<void>;
  };
} 