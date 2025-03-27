'use client';

import React, { useState, useEffect, useRef, Component, ErrorInfo } from 'react';
import { CameraIcon, DevicePhoneMobileIcon, HandRaisedIcon } from '@heroicons/react/24/outline';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture, Plane, Text } from '@react-three/drei';
import { XR, useXR, Interactive } from '@react-three/xr';
import * as THREE from 'three';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import * as tf from '@tensorflow/tfjs';

// Enhanced type definitions for hand tracking
interface HandLandmark {
  x: number;
  y: number;
  z: number;
  index: number;
}

interface HandPose {
  landmarks: HandLandmark[];
  handedness: 'Left' | 'Right';
  score: number;
}

// Extended position type with confidence score
interface HandPosition {
  x?: number;
  y?: number;
  z?: number;
  landmarks: {
    x: number;
    y: number;
    z: number;
  }[];
}

// Metal and gem type definitions
type MetalType = 'gold' | 'silver' | 'platinum';
type GemType = 'diamond' | 'ruby' | 'sapphire' | 'emerald';

// Types for different jewelry positions
interface FingerPosition {
  x: number;
  y: number;
  z: number;
  width: number;
  length: number;
  angle: number;
  finger: 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';
}

interface WristPosition {
  x: number;
  y: number;
  z: number;
  width: number;
  angle: number;
}

interface NeckPosition {
  x: number;
  y: number;
  z: number;
  width: number;
}

// Calibration data for proper sizing
interface CalibrationData {
  fingerWidths: Record<string, number>;
  wristWidth: number;
  neckCircumference: number;
  scale: number;
  isCalibrated: boolean;
}

// Props types
interface ARSceneProps {
  metalType: MetalType;
  gemType: GemType;
}

interface HandTrackingJewelryProps {
  metalType: MetalType;
  gemType: GemType;
  handPosition: HandPosition | null;
}

interface ARCompatibilityBadgeProps {
  isARSupported: boolean;
  onClick: () => void;
}

interface ARModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAR: () => void;
  isARSupported: boolean;
}

interface ARFallbackProps {
  metalType: MetalType;
  gemType: GemType;
}

interface HandTrackingSystemProps {
  onHandUpdate: (position: HandPosition) => void;
  onFingerUpdate?: (position: FingerPosition) => void;
  onWristUpdate?: (position: WristPosition) => void;
  onNeckUpdate?: (position: NeckPosition) => void;
  onCalibrationUpdate?: (data: CalibrationData) => void;
  jewelryType: 'ring' | 'bracelet' | 'necklace' | 'earring';
  fingerToTrack?: 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';
  enableStabilization?: boolean;
  calibrationMode?: boolean;
  onHandLandmarksUpdate?: (landmarks: HandLandmark[] | null) => void;
}

interface StabilizedPosition {
  current: HandPosition;
  history: HandPosition[];
  stabilized: HandPosition;
}

// Add ARTryOnProps at the top
interface ARTryOnProps {
  selectedMetal: MetalType;
  selectedGem: GemType;
}

// Error boundary to catch and display XR errors
class XRErrorBoundary extends Component<{children: React.ReactNode}, {hasError: boolean, errorMsg: string}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMsg: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('XR Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">WebXR Error: </strong>
          <span className="block sm:inline">{this.state.errorMsg || 'An error occurred loading AR'}</span>
        </div>
      );
    }

    return this.props.children;
  }
}

// Finger selection widget for ring placement
function FingerSelector({ activeFinger, onChange }: { 
  activeFinger: string, 
  onChange: (finger: 'thumb' | 'index' | 'middle' | 'ring' | 'pinky') => void 
}) {
  const fingers = [
    { id: 'thumb', name: 'Thumb' },
    { id: 'index', name: 'Index' },
    { id: 'middle', name: 'Middle' },
    { id: 'ring', name: 'Ring' },
    { id: 'pinky', name: 'Pinky' }
  ];
  
  return (
    <div className="absolute top-4 left-4 z-10">
      <div className="bg-black bg-opacity-50 p-2 rounded">
        <div className="text-white text-xs mb-1">Try on with:</div>
        <div className="grid grid-cols-5 gap-1">
          {fingers.map((finger) => (
            <button
              key={finger.id}
              className={`text-xs px-1 py-1 rounded ${
                activeFinger === finger.id 
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
              onClick={() => onChange(finger.id as any)}
            >
              {finger.name.charAt(0)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Wrapper for AR content with appropriate error handling
function ARViewer({ metalType, gemType }: { metalType: MetalType, gemType: GemType }) {
  const [fingerPosition, setFingerPosition] = useState<FingerPosition | null>(null);
  const [wristPosition, setWristPosition] = useState<WristPosition | null>(null);
  const [neckPosition, setNeckPosition] = useState<NeckPosition | null>(null);
  const [calibrationData, setCalibrationData] = useState<CalibrationData | null>(null);
  const [handLandmarks, setHandLandmarks] = useState<HandLandmark[] | null>(null);
  
  // Track which type of jewelry to display
  const [jewelryType, setJewelryType] = useState<'ring' | 'bracelet' | 'necklace' | 'earring'>('ring');
  const [activeFingerToTrack, setActiveFingerToTrack] = useState<'thumb' | 'index' | 'middle' | 'ring' | 'pinky'>('ring');
  
  // For debugging and development
  const [isCalibrationMode, setIsCalibrationMode] = useState(false);
  const [showHandPoints, setShowHandPoints] = useState(false);
  
  return (
    <XRErrorBoundary>
      <div className="relative w-full h-full">
        {/* Simple Canvas without explicit XR for now to avoid TypeScript issues */}
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          
          {/* Jewelry display group - positioned based on hand tracking */}
          <group position={[0, 0, -2]}>
            {/* Ring model */}
            {jewelryType === 'ring' && fingerPosition && (
              <group 
                position={[fingerPosition.x, fingerPosition.y, fingerPosition.z - 0.2]}
                rotation={[0, Math.PI / 2, 0]}
                scale={[0.02, 0.02, 0.02]}
              >
                <mesh>
                  <torusGeometry args={[fingerPosition.width * 0.8, 0.2, 32, 100]} />
                  <meshStandardMaterial 
                    color={metalType === 'gold' ? '#FFD700' : metalType === 'silver' ? '#E0E0E0' : '#E5E4E2'} 
                    metalness={0.9} 
                    roughness={0.2} 
                  />
                </mesh>
                <mesh position={[0, 0.3, 0]}>
                  <sphereGeometry args={[0.3, 32, 32]} />
                  <meshPhysicalMaterial 
                    color={
                      gemType === 'diamond' ? '#FFFFFF' :
                      gemType === 'ruby' ? '#E0115F' :
                      gemType === 'sapphire' ? '#0F52BA' : '#046307'
                    }
                    transmission={0.9} 
                    roughness={0.1}
                    ior={1.5}
                    thickness={1}
                  />
                </mesh>
              </group>
            )}
            
            {/* Bracelet model */}
            {jewelryType === 'bracelet' && wristPosition && (
              <group 
                position={[wristPosition.x, wristPosition.y, wristPosition.z - 0.1]}
                rotation={[0, 0, wristPosition.angle]}
                scale={[0.1, 0.1, 0.1]}
              >
                <mesh>
                  <torusGeometry args={[wristPosition.width * 0.6, 0.1, 32, 100]} />
                  <meshStandardMaterial 
                    color={metalType === 'gold' ? '#FFD700' : metalType === 'silver' ? '#E0E0E0' : '#E5E4E2'} 
                    metalness={0.9} 
                    roughness={0.2} 
                  />
                </mesh>
                {/* Add gems around the bracelet */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <mesh key={i} position={[
                    Math.cos(i * Math.PI / 4) * wristPosition.width * 0.6,
                    Math.sin(i * Math.PI / 4) * wristPosition.width * 0.6,
                    0
                  ]}>
                    <sphereGeometry args={[0.1, 16, 16]} />
                    <meshPhysicalMaterial 
                      color={
                        gemType === 'diamond' ? '#FFFFFF' :
                        gemType === 'ruby' ? '#E0115F' :
                        gemType === 'sapphire' ? '#0F52BA' : '#046307'
                      }
                      transmission={0.9} 
                      roughness={0.1}
                    />
                  </mesh>
                ))}
              </group>
            )}
            
            {/* Necklace model */}
            {jewelryType === 'necklace' && neckPosition && (
              <group 
                position={[neckPosition.x, neckPosition.y, neckPosition.z]}
                scale={[0.2, 0.2, 0.2]}
              >
                <mesh>
                  <torusGeometry args={[neckPosition.width * 0.7, 0.05, 32, 100]} />
                  <meshStandardMaterial 
                    color={metalType === 'gold' ? '#FFD700' : metalType === 'silver' ? '#E0E0E0' : '#E5E4E2'} 
                    metalness={0.9} 
                    roughness={0.2} 
                  />
                </mesh>
                {/* Add pendant */}
                <mesh position={[0, -neckPosition.width * 0.7, 0]}>
                  <sphereGeometry args={[0.3, 32, 32]} />
                  <meshPhysicalMaterial 
                    color={
                      gemType === 'diamond' ? '#FFFFFF' :
                      gemType === 'ruby' ? '#E0115F' :
                      gemType === 'sapphire' ? '#0F52BA' : '#046307'
                    }
                    transmission={0.8} 
                    roughness={0.1}
                  />
                </mesh>
              </group>
            )}
          </group>
        </Canvas>

        {/* Hand tracking system with landmark update */}
        <HandTrackingSystem 
          onHandUpdate={(position) => {
            // Generic hand position update
          }}
          onFingerUpdate={setFingerPosition}
          onWristUpdate={setWristPosition}
          onNeckUpdate={setNeckPosition}
          onCalibrationUpdate={setCalibrationData}
          onHandLandmarksUpdate={setHandLandmarks}
          jewelryType={jewelryType}
          fingerToTrack={jewelryType === 'ring' ? activeFingerToTrack : 'index'}
          enableStabilization={true}
          calibrationMode={isCalibrationMode}
        />

        {/* Show hand landmarks if debugging is enabled */}
        {showHandPoints && <HandLandmarksVisualizer handLandmarks={handLandmarks} />}

        {/* Finger selector for ring */}
        {jewelryType === 'ring' && (
          <FingerSelector 
            activeFinger={activeFingerToTrack} 
            onChange={setActiveFingerToTrack} 
          />
        )}

        {/* Jewelry type selector */}
        <div className="absolute bottom-20 left-0 right-0 text-center z-10">
          <div className="inline-flex bg-black bg-opacity-60 rounded-lg p-1">
            {['ring', 'bracelet', 'necklace'].map((type) => (
              <button
                key={type}
                className={`px-3 py-1 mx-1 rounded-md text-sm ${
                  jewelryType === type 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-gray-800 text-gray-300'
                }`}
                onClick={() => setJewelryType(type as any)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Calibration button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              isCalibrationMode 
                ? 'bg-amber-600 text-white' 
                : 'bg-black bg-opacity-60 text-gray-300'
            }`}
            onClick={() => setIsCalibrationMode(!isCalibrationMode)}
          >
            {isCalibrationMode ? 'Exit Calibration' : 'Calibrate'}
          </button>
        </div>

        {/* Info message */}
        <div className="absolute bottom-4 left-0 right-0 text-center z-10">
          <div className="inline-block bg-amber-600 text-white text-sm px-3 py-1 rounded">
            {isCalibrationMode 
              ? 'Hold your hand flat in view to calibrate'
              : jewelryType === 'ring' 
                ? `Point your ${activeFingerToTrack} finger at the camera` 
                : jewelryType === 'bracelet'
                  ? 'Show your wrist to the camera'
                  : 'Stand back to see necklace placement'}
          </div>
        </div>

        {/* Debug toggle button */}
        <div className="absolute top-4 right-16 z-10">
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              showHandPoints 
                ? 'bg-purple-600 text-white' 
                : 'bg-black bg-opacity-60 text-gray-300'
            }`}
            onClick={() => setShowHandPoints(!showHandPoints)}
          >
            {showHandPoints ? 'Hide Debug' : 'Show Debug'}
          </button>
        </div>
      </div>
    </XRErrorBoundary>
  );
}

// Component to show AR compatibility status
function ARCompatibilityBadge({ isARSupported, onClick }: ARCompatibilityBadgeProps) {
  return (
    <div className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold leading-6 text-amber-600 ring-1 ring-inset ring-amber-500/20 cursor-pointer" onClick={onClick}>
      {isARSupported ? 'AR Ready - Click to try on' : 'Check device compatibility'}
    </div>
  );
}

// Reticle component for surface placement guidance
function Reticle() {
  const { isPresenting } = useXR();
  const reticleRef = useRef<THREE.Mesh>(null!); // Non-null assertion
  const { camera } = useThree(); // Correctly access camera from the hook
  
  // Use a simpler approach with useFrame instead of hit testing for now
  useFrame(() => {
    if (reticleRef.current) {
      // Keep the reticle in front of the camera at a fixed distance
      const direction = new THREE.Vector3(0, 0, -1);
      direction.applyQuaternion(camera.quaternion);
      direction.multiplyScalar(2); // Place 2 meters in front
      
      // Set the reticle position
      reticleRef.current.position.copy(camera.position).add(direction);
      // Make the reticle face the camera
      reticleRef.current.quaternion.copy(camera.quaternion);
    }
  });
  
  // Only show reticle when in AR mode
  if (!isPresenting) return null;
  
  return (
    <mesh ref={reticleRef} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.1, 0.15, 32]} />
      <meshBasicMaterial color="#FFAC47" transparent opacity={0.8} />
    </mesh>
  );
}

// Jewelry model that follows hand position (placeholder)
function HandTrackingJewelry({ metalType, gemType, handPosition }: HandTrackingJewelryProps) {
  const [position, setPosition] = useState<[number, number, number]>([0, 0, -0.5]);
  
  // Update position if hand tracking is active
  useEffect(() => {
    if (handPosition) {
      setPosition([handPosition.x, handPosition.y, handPosition.z]);
    }
  }, [handPosition]);
  
  // Get color based on metal type
  const getMetalColor = () => {
    switch(metalType) {
      case 'gold': return '#FFD700';
      case 'silver': return '#E0E0E0';
      case 'platinum': return '#E5E4E2';
      default: return '#FFD700';
    }
  };
  
  // Get color based on gem type
  const getGemColor = () => {
    switch(gemType) {
      case 'diamond': return '#FFFFFF';
      case 'ruby': return '#E0115F';
      case 'sapphire': return '#0F52BA';
      case 'emerald': return '#046307';
      default: return '#FFFFFF';
    }
  };
  
  return (
    <group position={position} scale={[0.03, 0.03, 0.03]} rotation={[0, 0, 0]}>
      {/* Simple ring model using primitives */}
      <mesh>
        <torusGeometry args={[1, 0.3, 32, 100]} />
        <meshStandardMaterial color={getMetalColor()} metalness={0.9} roughness={0.2} />
      </mesh>
      
      <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.2, 32]} />
        <meshStandardMaterial color={getMetalColor()} metalness={0.9} roughness={0.3} />
      </mesh>
      
      <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <dodecahedronGeometry args={[0.4, 2]} />
        <meshPhysicalMaterial 
          color={getGemColor()}
          transmission={0.9} 
          roughness={0.1}
          ior={1.5}
          thickness={1}
          specularIntensity={1}
          clearcoat={1}
        />
      </mesh>
    </group>
  );
}

// Main AR Scene
function ARScene({ metalType = 'gold', gemType = 'diamond' }: ARSceneProps) {
  const [handPosition, setHandPosition] = useState<HandPosition | null>(null);
  const { isPresenting } = useXR();
  
  // Setup basic lighting
  const setupLighting = () => (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
    </>
  );
  
  return (
    <>
      {setupLighting()}
      
      {/* Reticle for surface detection */}
      <Reticle />
      
      {/* Jewelry that follows hand position */}
      <HandTrackingJewelry 
        metalType={metalType} 
        gemType={gemType} 
        handPosition={handPosition} 
      />
      
      {/* Placement instructions */}
      {isPresenting && (
        <Text
          position={[0, 0, -1]}
          fontSize={0.05}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.004}
          outlineColor="#000000"
        >
          Move your phone to detect surfaces
        </Text>
      )}
    </>
  );
}

// Debug visualization of hand landmarks
function HandLandmarksVisualizer({ handLandmarks }: { handLandmarks: HandLandmark[] | null }) {
  if (!handLandmarks) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 1 1" preserveAspectRatio="none">
        {/* Connections between landmarks */}
        {/* Thumb */}
        <line x1={handLandmarks[0]?.x || 0} y1={handLandmarks[0]?.y || 0} 
              x2={handLandmarks[1]?.x || 0} y2={handLandmarks[1]?.y || 0} 
              stroke="#FFC0CB" strokeWidth="0.005" />
        <line x1={handLandmarks[1]?.x || 0} y1={handLandmarks[1]?.y || 0} 
              x2={handLandmarks[2]?.x || 0} y2={handLandmarks[2]?.y || 0} 
              stroke="#FFC0CB" strokeWidth="0.005" />
        <line x1={handLandmarks[2]?.x || 0} y1={handLandmarks[2]?.y || 0} 
              x2={handLandmarks[3]?.x || 0} y2={handLandmarks[3]?.y || 0} 
              stroke="#FFC0CB" strokeWidth="0.005" />
        <line x1={handLandmarks[3]?.x || 0} y1={handLandmarks[3]?.y || 0} 
              x2={handLandmarks[4]?.x || 0} y2={handLandmarks[4]?.y || 0} 
              stroke="#FFC0CB" strokeWidth="0.005" />
              
        {/* Index finger */}
        <line x1={handLandmarks[0]?.x || 0} y1={handLandmarks[0]?.y || 0} 
              x2={handLandmarks[5]?.x || 0} y2={handLandmarks[5]?.y || 0} 
              stroke="#FFFF00" strokeWidth="0.005" />
        <line x1={handLandmarks[5]?.x || 0} y1={handLandmarks[5]?.y || 0} 
              x2={handLandmarks[6]?.x || 0} y2={handLandmarks[6]?.y || 0} 
              stroke="#FFFF00" strokeWidth="0.005" />
        <line x1={handLandmarks[6]?.x || 0} y1={handLandmarks[6]?.y || 0} 
              x2={handLandmarks[7]?.x || 0} y2={handLandmarks[7]?.y || 0} 
              stroke="#FFFF00" strokeWidth="0.005" />
        <line x1={handLandmarks[7]?.x || 0} y1={handLandmarks[7]?.y || 0} 
              x2={handLandmarks[8]?.x || 0} y2={handLandmarks[8]?.y || 0} 
              stroke="#FFFF00" strokeWidth="0.005" />
              
        {/* Middle finger */}
        <line x1={handLandmarks[0]?.x || 0} y1={handLandmarks[0]?.y || 0} 
              x2={handLandmarks[9]?.x || 0} y2={handLandmarks[9]?.y || 0} 
              stroke="#00FFFF" strokeWidth="0.005" />
        <line x1={handLandmarks[9]?.x || 0} y1={handLandmarks[9]?.y || 0} 
              x2={handLandmarks[10]?.x || 0} y2={handLandmarks[10]?.y || 0} 
              stroke="#00FFFF" strokeWidth="0.005" />
        <line x1={handLandmarks[10]?.x || 0} y1={handLandmarks[10]?.y || 0} 
              x2={handLandmarks[11]?.x || 0} y2={handLandmarks[11]?.y || 0} 
              stroke="#00FFFF" strokeWidth="0.005" />
        <line x1={handLandmarks[11]?.x || 0} y1={handLandmarks[11]?.y || 0} 
              x2={handLandmarks[12]?.x || 0} y2={handLandmarks[12]?.y || 0} 
              stroke="#00FFFF" strokeWidth="0.005" />
              
        {/* Ring finger */}
        <line x1={handLandmarks[0]?.x || 0} y1={handLandmarks[0]?.y || 0} 
              x2={handLandmarks[13]?.x || 0} y2={handLandmarks[13]?.y || 0} 
              stroke="#00FF00" strokeWidth="0.005" />
        <line x1={handLandmarks[13]?.x || 0} y1={handLandmarks[13]?.y || 0} 
              x2={handLandmarks[14]?.x || 0} y2={handLandmarks[14]?.y || 0} 
              stroke="#00FF00" strokeWidth="0.005" />
        <line x1={handLandmarks[14]?.x || 0} y1={handLandmarks[14]?.y || 0} 
              x2={handLandmarks[15]?.x || 0} y2={handLandmarks[15]?.y || 0} 
              stroke="#00FF00" strokeWidth="0.005" />
        <line x1={handLandmarks[15]?.x || 0} y1={handLandmarks[15]?.y || 0} 
              x2={handLandmarks[16]?.x || 0} y2={handLandmarks[16]?.y || 0} 
              stroke="#00FF00" strokeWidth="0.005" />
              
        {/* Pinky finger */}
        <line x1={handLandmarks[0]?.x || 0} y1={handLandmarks[0]?.y || 0} 
              x2={handLandmarks[17]?.x || 0} y2={handLandmarks[17]?.y || 0} 
              stroke="#FF00FF" strokeWidth="0.005" />
        <line x1={handLandmarks[17]?.x || 0} y1={handLandmarks[17]?.y || 0} 
              x2={handLandmarks[18]?.x || 0} y2={handLandmarks[18]?.y || 0} 
              stroke="#FF00FF" strokeWidth="0.005" />
        <line x1={handLandmarks[18]?.x || 0} y1={handLandmarks[18]?.y || 0} 
              x2={handLandmarks[19]?.x || 0} y2={handLandmarks[19]?.y || 0} 
              stroke="#FF00FF" strokeWidth="0.005" />
        <line x1={handLandmarks[19]?.x || 0} y1={handLandmarks[19]?.y || 0} 
              x2={handLandmarks[20]?.x || 0} y2={handLandmarks[20]?.y || 0} 
              stroke="#FF00FF" strokeWidth="0.005" />
              
        {/* Palm */}
        <line x1={handLandmarks[5]?.x || 0} y1={handLandmarks[5]?.y || 0} 
              x2={handLandmarks[9]?.x || 0} y2={handLandmarks[9]?.y || 0} 
              stroke="#FFFFFF" strokeWidth="0.005" />
        <line x1={handLandmarks[9]?.x || 0} y1={handLandmarks[9]?.y || 0} 
              x2={handLandmarks[13]?.x || 0} y2={handLandmarks[13]?.y || 0} 
              stroke="#FFFFFF" strokeWidth="0.005" />
        <line x1={handLandmarks[13]?.x || 0} y1={handLandmarks[13]?.y || 0} 
              x2={handLandmarks[17]?.x || 0} y2={handLandmarks[17]?.y || 0} 
              stroke="#FFFFFF" strokeWidth="0.005" />
              
        {/* Landmarks */}
        {handLandmarks.map((landmark, index) => (
          <circle
            key={index}
            cx={landmark.x}
            cy={landmark.y}
            r="0.01"
            fill={
              // Color based on finger
              index >= 1 && index <= 4 ? "#FFC0CB" : // Thumb - pink
              index >= 5 && index <= 8 ? "#FFFF00" : // Index - yellow
              index >= 9 && index <= 12 ? "#00FFFF" : // Middle - cyan
              index >= 13 && index <= 16 ? "#00FF00" : // Ring - green
              index >= 17 && index <= 20 ? "#FF00FF" : // Pinky - magenta
              "#FFFFFF" // Palm - white
            }
          />
        ))}
      </svg>
    </div>
  );
}

// Hand tracking component using TensorFlow.js
function HandTrackingSystem({
  onHandUpdate,
  onFingerUpdate,
  onWristUpdate,
  onNeckUpdate,
  onCalibrationUpdate,
  jewelryType = 'ring',
  fingerToTrack = 'ring',
  enableStabilization = true,
  calibrationMode = false,
  onHandLandmarksUpdate,
}: HandTrackingSystemProps & { 
  onHandLandmarksUpdate?: (landmarks: HandLandmark[] | null) => void
}) {
  const [model, setModel] = useState<handPoseDetection.HandDetector | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [calibrationData, setCalibrationData] = useState<CalibrationData>({
    fingerWidths: { thumb: 25, index: 20, middle: 20, ring: 20, pinky: 15 },
    wristWidth: 60,
    neckCircumference: 0,
    scale: 1,
    isCalibrated: false
  });
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [handLandmarks, setHandLandmarks] = useState<HandLandmark[] | null>(null);
  
  // Stabilization constants and position history
  const STABILIZATION_WEIGHT = 0.3; // Lower means more smoothing
  const HISTORY_LENGTH = 10;
  const fingerPositionHistory = useRef<FingerPosition[]>([]);
  const wristPositionHistory = useRef<WristPosition[]>([]);
  const neckPositionHistory = useRef<NeckPosition[]>([]);
  
  // Improved error handling for WebGL
  useEffect(() => {
    // Check for WebGL context
    const checkWebGL = () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setErrorMessage('WebGL not supported in your browser. Please use a WebGL-compatible browser.');
        return false;
      }
      return true;
    };
    
    if (!checkWebGL()) {
      setIsLoading(false);
      return;
    }
    
    // Rest of effect logic...
  }, []);
  
  // Load model and setup camera
  useEffect(() => {
    let isMounted = true;
    
    const loadModel = async () => {
      try {
        setIsLoading(true);
        
        // Load the TF.js model
        await tf.ready();
        
        // Load the hand pose detection model
        const detectorConfig = {
          runtime: 'mediapipe' as const,
          solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
          modelType: 'full' as const,
        };
        
        const model = await handPoseDetection.createDetector(
          handPoseDetection.SupportedModels.MediaPipeHands,
          detectorConfig
        );
        
        if (isMounted) {
          setModel(model);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to load TensorFlow model:', error);
        if (isMounted) {
          setErrorMessage('Failed to load hand tracking model. Please check your connection and try again.');
          setIsLoading(false);
        }
      }
    };
    
    loadModel();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Camera setup
  useEffect(() => {
    if (isLoading || errorMessage) return;
    
    async function setupCamera() {
      if (!videoRef.current) return;
      
      try {
        const constraints = {
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
        setCameraPermission('granted');
        
        // Wait for video to be loaded
        await new Promise((resolve) => {
          if (!videoRef.current) return;
          videoRef.current.onloadedmetadata = () => {
            resolve(true);
          };
        });
        
        // Start video
        if (videoRef.current) {
          videoRef.current.play();
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setCameraPermission('denied');
        setErrorMessage('Camera access is required for hand tracking. Please allow camera access and try again.');
      }
    }
    
    setupCamera();
    
    return () => {
      // Cleanup camera
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isLoading, errorMessage]);
  
  // Hand detection loop
  useEffect(() => {
    if (!model || !videoRef.current || cameraPermission !== 'granted') return;
    
    let animationFrameId: number;
    let lastDetectionTime = 0;
    const detectionInterval = 50; // ms between detections
    
    const detectHands = async () => {
      if (!videoRef.current || !model) return;
      
      const now = Date.now();
      if (now - lastDetectionTime > detectionInterval) {
        try {
          const hands = await model.estimateHands(videoRef.current);
          
          if (hands.length > 0) {
            // @ts-ignore - Using any to bypass TF.js typing issues
            const landmarks = hands[0].landmarks || hands[0].keypoints.map((kp: any) => [kp.x, kp.y, kp.z]);
            
            // Convert to our format and update landmarks for visualization
            const formattedLandmarks = landmarks.map((point, index) => ({
              x: point[0] / videoRef.current!.videoWidth,
              y: point[1] / videoRef.current!.videoHeight,
              z: point[2],
              index
            }));
            
            setHandLandmarks(formattedLandmarks);
            if (onHandLandmarksUpdate) {
              onHandLandmarksUpdate(formattedLandmarks);
            }
            
            // Process hand data based on jewelry type
            if (jewelryType === 'ring') {
              const fingerIndex = {
                thumb: 4,
                index: 8,
                middle: 12,
                ring: 16,
                pinky: 20
              }[fingerToTrack];
              
              // Extract finger position
              const fingerTip = landmarks[fingerIndex as number];
              const fingerBase = landmarks[fingerIndex as number - 3];
              const fingerMid = landmarks[fingerIndex as number - 2];
              
              if (fingerTip && fingerBase) {
                // Calculate finger width based on calibration or default
                const fingerWidth = calibrationData.fingerWidths[fingerToTrack] / 100;
                
                // Create position data
                const fingerPosition: FingerPosition = {
                  x: fingerTip[0] / videoRef.current.videoWidth * 2 - 1,
                  y: -(fingerTip[1] / videoRef.current.videoHeight * 2 - 1),
                  z: fingerTip[2] / 100,
                  width: fingerWidth,
                  length: Math.sqrt(
                    Math.pow(fingerTip[0] - fingerBase[0], 2) + 
                    Math.pow(fingerTip[1] - fingerBase[1], 2)
                  ) / videoRef.current.videoWidth,
                  angle: Math.atan2(
                    fingerTip[1] - fingerMid[1],
                    fingerTip[0] - fingerMid[0]
                  ),
                  finger: fingerToTrack
                };
                
                // Apply stabilization if enabled
                if (enableStabilization) {
                  const stabilizedPosition = stabilizePosition(fingerPosition, fingerPositionHistory);
                  if (onFingerUpdate) onFingerUpdate(stabilizedPosition);
                } else {
                  if (onFingerUpdate) onFingerUpdate(fingerPosition);
                }
              }
            } else if (jewelryType === 'bracelet') {
              // Process wrist position
              const wristLandmark = landmarks[0];
              const thumbBase = landmarks[1];
              const pinkyBase = landmarks[17];
              
              if (wristLandmark && thumbBase && pinkyBase) {
                // Calculate wrist width based on distance between thumb and pinky
                const wristWidth = calibrationData.wristWidth / 100;
                
                const wristPosition: WristPosition = {
                  x: wristLandmark[0] / videoRef.current.videoWidth * 2 - 1,
                  y: -(wristLandmark[1] / videoRef.current.videoHeight * 2 - 1),
                  z: wristLandmark[2] / 100,
                  width: wristWidth,
                  angle: Math.atan2(
                    pinkyBase[1] - thumbBase[1],
                    pinkyBase[0] - thumbBase[0]
                  )
                };
                
                // Apply stabilization if enabled
                if (enableStabilization) {
                  const stabilizedPosition = stabilizeWristPosition(wristPosition, wristPositionHistory);
                  if (onWristUpdate) onWristUpdate(stabilizedPosition);
                } else {
                  if (onWristUpdate) onWristUpdate(wristPosition);
                }
              }
            } else if (jewelryType === 'necklace') {
              // Estimate neck position based on face and shoulders
              // This is approximate since we don't have direct neck tracking
              const chin = landmarks[0]; // Use wrist landmark as chin approximation
              
              if (chin) {
                // Estimate neck width
                const neckWidth = calibrationData.wristWidth / 100;
                
                // Position neck below chin
                const neckPosition: NeckPosition = {
                  x: chin[0] / videoRef.current.videoWidth * 2 - 1,
                  y: -(chin[1] / videoRef.current.videoHeight * 2 - 1) - 0.2, // Move down from chin
                  z: chin[2] / 100,
                  width: neckWidth
                };
                
                // Apply stabilization if enabled
                if (enableStabilization) {
                  const stabilizedPosition = stabilizeNeckPosition(neckPosition, neckPositionHistory);
                  if (onNeckUpdate) onNeckUpdate(stabilizedPosition);
                } else {
                  if (onNeckUpdate) onNeckUpdate(neckPosition);
                }
              }
            }
            
            // Process calibration if in calibration mode
            if (calibrationMode) {
              performCalibration(landmarks);
            }
            
            // Hand update callback
            if (onHandUpdate) {
              const handPosition: HandPosition = {
                landmarks: landmarks.map(point => ({
                  x: point[0] / videoRef.current!.videoWidth,
                  y: point[1] / videoRef.current!.videoHeight,
                  z: point[2] / 100
                }))
              };
              onHandUpdate(handPosition);
            }
            
            setDebugInfo(`Hand detected: ${landmarks.length} landmarks`);
          } else {
            setHandLandmarks(null);
            if (onHandLandmarksUpdate) {
              onHandLandmarksUpdate(null);
            }
            setDebugInfo('No hands detected');
          }
          
          lastDetectionTime = now;
        } catch (error) {
          console.error('Error during hand detection:', error);
          setDebugInfo(`Detection error: ${error}`);
        }
      }
      
      animationFrameId = requestAnimationFrame(detectHands);
    };
    
    detectHands();
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [model, cameraPermission, onHandUpdate, onFingerUpdate, onWristUpdate, onNeckUpdate, jewelryType, fingerToTrack, enableStabilization, calibrationMode, calibrationData.fingerWidths, calibrationData.wristWidth, onHandLandmarksUpdate]);
  
  // Stabilization functions
  const stabilizePosition = (current: FingerPosition, history: React.MutableRefObject<FingerPosition[]>) => {
    // Add current position to history
    history.current.push(current);
    
    // Keep history at fixed length
    if (history.current.length > HISTORY_LENGTH) {
      history.current.shift();
    }
    
    // If not enough history data, return current
    if (history.current.length < 3) return current;
    
    // Calculate weighted average
    let xSum = 0, ySum = 0, zSum = 0;
    let totalWeight = 0;
    
    history.current.forEach((pos, index) => {
      // More recent positions have higher weight
      const weight = STABILIZATION_WEIGHT * (index + 1);
      xSum += pos.x * weight;
      ySum += pos.y * weight;
      zSum += pos.z * weight;
      totalWeight += weight;
    });
    
    return {
      ...current,
      x: xSum / totalWeight,
      y: ySum / totalWeight,
      z: zSum / totalWeight
    };
  };
  
  const stabilizeWristPosition = (current: WristPosition, history: React.MutableRefObject<WristPosition[]>) => {
    // Same logic as finger stabilization
    history.current.push(current);
    if (history.current.length > HISTORY_LENGTH) {
      history.current.shift();
    }
    if (history.current.length < 3) return current;
    
    let xSum = 0, ySum = 0, zSum = 0, angleSum = 0;
    let totalWeight = 0;
    
    history.current.forEach((pos, index) => {
      const weight = STABILIZATION_WEIGHT * (index + 1);
      xSum += pos.x * weight;
      ySum += pos.y * weight;
      zSum += pos.z * weight;
      angleSum += pos.angle * weight;
      totalWeight += weight;
    });
    
    return {
      ...current,
      x: xSum / totalWeight,
      y: ySum / totalWeight,
      z: zSum / totalWeight,
      angle: angleSum / totalWeight
    };
  };
  
  const stabilizeNeckPosition = (current: NeckPosition, history: React.MutableRefObject<NeckPosition[]>) => {
    // Same logic as other stabilization functions
    history.current.push(current);
    if (history.current.length > HISTORY_LENGTH) {
      history.current.shift();
    }
    if (history.current.length < 3) return current;
    
    let xSum = 0, ySum = 0, zSum = 0;
    let totalWeight = 0;
    
    history.current.forEach((pos, index) => {
      const weight = STABILIZATION_WEIGHT * (index + 1);
      xSum += pos.x * weight;
      ySum += pos.y * weight;
      zSum += pos.z * weight;
      totalWeight += weight;
    });
    
    return {
      ...current,
      x: xSum / totalWeight,
      y: ySum / totalWeight,
      z: zSum / totalWeight
    };
  };
  
  // Calibration function
  const performCalibration = (landmarks: number[][]) => {
    // Extract relevant measurements for calibration
    // This could be enhanced with more sophisticated logic
    if (landmarks.length === 21) {
      // Measure finger widths
      const fingerWidths = {
        thumb: calculateFingerWidth(landmarks, 1, 4),
        index: calculateFingerWidth(landmarks, 5, 8),
        middle: calculateFingerWidth(landmarks, 9, 12),
        ring: calculateFingerWidth(landmarks, 13, 16),
        pinky: calculateFingerWidth(landmarks, 17, 20)
      };
      
      // Measure wrist width
      const wristWidth = Math.sqrt(
        Math.pow(landmarks[17][0] - landmarks[1][0], 2) + 
        Math.pow(landmarks[17][1] - landmarks[1][1], 2)
      );
      
      // Estimate neck width (in a real app, this would need better heuristics)
      const neckWidth = wristWidth * 3;
      
      // Update calibration data
      setCalibrationData({
        fingerWidths,
        wristWidth: wristWidth,
        neckCircumference: 0,
        scale: 1,
        isCalibrated: true
      });
      
      // Callback
      if (onCalibrationUpdate) {
        onCalibrationUpdate({
          fingerWidths,
          wristWidth: wristWidth,
          neckCircumference: 0,
          scale: 1,
          isCalibrated: true
        });
      }
    }
  };
  
  // Helper function to calculate finger width
  const calculateFingerWidth = (landmarks: number[][], baseIndex: number, tipIndex: number) => {
    // A simple approximation using the distance between landmark points
    return Math.sqrt(
      Math.pow(landmarks[baseIndex][0] - landmarks[tipIndex][0], 2) + 
      Math.pow(landmarks[baseIndex][1] - landmarks[tipIndex][1], 2)
    ) / 4; // Divide by 4 as finger width is roughly 1/4 of length
  };
  
  // Return loading UI if still loading
  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="text-center p-4 bg-white rounded-lg shadow-lg">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-800 font-medium">Loading hand tracking...</p>
          <p className="text-gray-600 text-sm mt-2">This may take a moment on first load</p>
        </div>
      </div>
    );
  }
  
  // Return error UI if there was an error
  if (errorMessage) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="text-center p-4 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-600 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-800 font-medium">Hand Tracking Error</p>
          <p className="text-gray-600 text-sm mt-2">{errorMessage}</p>
          <button 
            className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  // Determine if we should show development/debug UI
  const isDevelopment = process.env.NODE_ENV === 'development' || calibrationMode;
  
  // Main component UI
  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          position: 'absolute',
          width: isDevelopment ? '240px' : '1px',
          height: isDevelopment ? '180px' : '1px',
          bottom: isDevelopment ? '10px' : '0',
          right: isDevelopment ? '10px' : '0',
          zIndex: 10,
          opacity: isDevelopment ? 0.5 : 0,
          borderRadius: '8px',
          display: cameraPermission === 'granted' ? 'block' : 'none'
        }}
      />
      
      {cameraPermission === 'denied' && (
        <div className="fixed bottom-4 left-4 right-4 bg-red-500 text-white p-2 rounded text-sm z-50">
          Camera access denied. Hand tracking requires camera permissions.
        </div>
      )}
      
      {/* Debug info display */}
      {isDevelopment && (
        <div className="fixed bottom-4 left-4 max-w-[300px] bg-black bg-opacity-50 text-white p-2 rounded text-xs z-50">
          {debugInfo}
          {calibrationMode && (
            <div className="mt-1">
              <button 
                className="px-2 py-1 bg-amber-600 text-white text-xs rounded"
                onClick={() => {
                  const newData = {...calibrationData, isCalibrated: true};
                  setCalibrationData(newData);
                  if (onCalibrationUpdate) onCalibrationUpdate(newData);
                }}
              >
                Reset Calibration
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// Intro and informational screen
function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center p-6 max-w-md">
        <div className="mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5 1.5-1.5-5-5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.5 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">AR Jewelry Try-On</h2>
        
        <p className="text-gray-300 mb-6">
          Experience our jewelry collection in augmented reality. Use your camera to see how our pieces look on you.
        </p>
        
        <div className="bg-black bg-opacity-40 p-4 rounded-lg mb-6">
          <h3 className="text-amber-400 font-medium mb-2">Tips for best results:</h3>
          <ul className="text-gray-300 text-sm text-left space-y-2">
            <li className="flex items-start">
              <span className="text-amber-400 mr-2">•</span>
              Make sure you're in a well-lit environment
            </li>
            <li className="flex items-start">
              <span className="text-amber-400 mr-2">•</span>
              Position your camera to clearly see your hand
            </li>
            <li className="flex items-start">
              <span className="text-amber-400 mr-2">•</span>
              Move slowly for better tracking
            </li>
            <li className="flex items-start">
              <span className="text-amber-400 mr-2">•</span>
              Use the calibration feature for more accurate sizing
            </li>
          </ul>
        </div>
        
        <p className="text-xs text-gray-400 mb-6">
          This feature uses your camera for AR visualization only. No images are stored or transmitted.
        </p>
        
        <button
          onClick={onStart}
          className="w-full px-6 py-3 bg-amber-600 text-white rounded-lg font-medium shadow-lg hover:bg-amber-700 transition-colors"
        >
          Start AR Experience
        </button>
      </div>
    </div>
  );
}

// Main ARTryOn component
export default function ARTryOn({ selectedMetal, selectedGem }: ARTryOnProps) {
  const [isARSupported, setIsARSupported] = useState(false);
  const [showARModal, setShowARModal] = useState(false);
  const [activeFinger, setActiveFinger] = useState<'thumb' | 'index' | 'middle' | 'ring' | 'pinky'>('ring');
  const [isHandTrackingActive, setIsHandTrackingActive] = useState(false);
  
  useEffect(() => {
    // Check if WebXR is supported
    if ('xr' in navigator) {
      (navigator as any).xr.isSessionSupported('immersive-ar')
        .then((supported: boolean) => {
          setIsARSupported(supported);
        })
        .catch(() => {
          setIsARSupported(false);
        });
    } else {
      setIsARSupported(false);
    }
  }, []);

  return (
    <div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
      <ARViewer metalType={selectedMetal} gemType={selectedGem} />
      <FingerSelector activeFinger={activeFinger} onChange={setActiveFinger} />
      
      {/* AR Compatibility Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-black bg-opacity-50 p-2 rounded flex items-center space-x-2">
          <DevicePhoneMobileIcon className="w-5 h-5 text-white" />
          <span className="text-white text-sm">
            {isARSupported ? 'AR Ready' : 'AR Not Supported'}
          </span>
        </div>
      </div>
      
      {/* Hand Tracking Status */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-black bg-opacity-50 p-2 rounded flex items-center space-x-2">
          <HandRaisedIcon className="w-5 h-5 text-white" />
          <span className="text-white text-sm">
            {isHandTrackingActive ? 'Hand Tracking Active' : 'Hand Tracking Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
} 