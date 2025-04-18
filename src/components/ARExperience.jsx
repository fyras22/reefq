'use client';

import React, { useEffect, useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, PresentationControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Model component that loads and displays the 3D model
function Model({ url, position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();
  
  // Clone the scene to avoid modifying the cached original
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  useFrame((state) => {
    if (modelRef.current) {
      // Add subtle animation
      modelRef.current.rotation.y += 0.003;
    }
  });

  return (
    <primitive 
      ref={modelRef}
      object={clonedScene} 
      position={position} 
      scale={scale} 
      rotation={rotation} 
    />
  );
}

// Camera controller for proper positioning
function CameraController() {
  const { camera } = useThree();
  
  useEffect(() => {
    // Set initial camera position
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  return null;
}

// Fallback model URLs if product doesn't have one
const FALLBACK_MODELS = {
  'ring': '/models/fallback-ring.glb',
  'bracelet': '/models/fallback-bracelet.glb',
  'necklace': '/models/fallback-necklace.glb',
  'earring': '/models/fallback-earring.glb'
};

// Hand component for try-on visualization
function HandModel({ position = [0, -1, 0], scale = 1, rotation = [0.3, 0, 0] }) {
  const { scene } = useGLTF('/models/hand.glb');
  return (
    <primitive 
      object={scene} 
      position={position} 
      scale={scale} 
      rotation={rotation} 
    />
  );
}

// Main AR Experience component
export default function ARExperience({ product }) {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [showHand, setShowHand] = useState(true);
  const [viewMode, setViewMode] = useState('3d'); // '3d' or 'ar'
  
  // Determine model URL, falling back if necessary
  const modelUrl = product?.arModel || getDefaultModel(product?.id);
  
  function getDefaultModel(productId) {
    if (!productId) return FALLBACK_MODELS.ring;
    
    const type = productId.includes('ring') ? 'ring' : 
                productId.includes('bracelet') ? 'bracelet' :
                productId.includes('necklace') ? 'necklace' :
                productId.includes('earring') ? 'earring' : 'ring';
                
    return FALLBACK_MODELS[type];
  }
  
  // Handle model loading error
  useEffect(() => {
    if (modelLoaded) setError(null);
  }, [modelLoaded]);
  
  const handleLoadSuccess = () => {
    setModelLoaded(true);
  };
  
  const handleLoadError = (err) => {
    console.error('Error loading 3D model:', err);
    setError('Could not load the 3D model. Please try another item.');
  };
  
  const toggleHand = () => {
    setShowHand(!showHand);
  };
  
  const toggleViewMode = () => {
    setViewMode(viewMode === '3d' ? 'ar' : '3d');
  };
  
  // If in AR mode, use the experimental WebXR features
  if (viewMode === 'ar' && typeof window !== 'undefined' && 'xr' in navigator) {
    return (
      <div className="relative w-full h-[600px] bg-gray-100 rounded-lg">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900 mb-2">AR View</p>
            <p className="text-sm text-gray-600 mb-4">
              This feature uses your device's camera to show how the jewelry would look on you.
            </p>
            <button
              onClick={toggleViewMode}
              className="mt-2 px-4 py-2 bg-nile-teal text-white rounded-md"
            >
              Switch to 3D View
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
      {error && (
        <div className="absolute inset-0 bg-white bg-opacity-90 z-10 flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-red-600 mb-2">{error}</p>
            <p className="text-gray-600">We're having trouble displaying this item in 3D.</p>
          </div>
        </div>
      )}
      
      <div className="absolute top-4 right-4 z-10 space-x-2">
        <button
          onClick={toggleHand}
          className="px-3 py-1.5 bg-white rounded-md shadow-sm text-sm font-medium text-gray-700"
        >
          {showHand ? 'Hide Hand' : 'Show Hand'}
        </button>
        
        <button
          onClick={toggleViewMode}
          className="px-3 py-1.5 bg-nile-teal text-white rounded-md shadow-sm text-sm font-medium"
        >
          Try AR View
        </button>
      </div>
      
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
        <CameraController />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <PresentationControls
          global
          zoom={0.8}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
        >
          {/* Display product model */}
          <Suspense fallback={null}>
            <Model 
              url={modelUrl}
              scale={product?.id?.includes('ring') ? 0.01 : 0.03}
              position={[0, 0.5, 0]}
              onLoad={handleLoadSuccess}
              onError={handleLoadError}
            />
            
            {showHand && product?.id?.includes('ring') && (
              <HandModel />
            )}
            
            <ContactShadows 
              opacity={0.5}
              scale={10} 
              blur={1} 
              far={10} 
              resolution={256} 
              color="#000000" 
            />
            
            <Environment preset="city" />
          </Suspense>
        </PresentationControls>
      </Canvas>
      
      {!modelLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-t-2 border-nile-teal rounded-full animate-spin"></div>
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 right-4 text-center text-sm text-gray-600">
        Rotate: Click and drag | Zoom: Scroll or pinch
      </div>
    </div>
  );
} 