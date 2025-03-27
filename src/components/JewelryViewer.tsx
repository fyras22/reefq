'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { CustomEnvironment } from './CustomEnvironment';

interface JewelryViewerProps {
  metalType?: 'gold' | 'silver' | 'platinum';
  gemType?: 'diamond' | 'ruby' | 'sapphire' | 'emerald';
  size?: number;
}

function JewelryModel({ metalType = 'gold', gemType = 'emerald', size = 1 }: JewelryViewerProps) {
  const { scene } = useGLTF('/models/diamond_engagement_ring.glb');
  const groupRef = useRef<THREE.Group>(null);
  
  // Get color based on metal type
  function getMetalColor(type: string = 'gold') {
    switch(type) {
      case 'gold': return '#C4A265'; // Pharaonic Gold
      case 'silver': return '#E0E0E0';
      case 'platinum': return '#E5E4E2';
      default: return '#C4A265';
    }
  }

  // Get color based on gem type
  function getGemColor(type: string = 'emerald') {
    switch(type) {
      case 'diamond': return '#FFFFFF';
      case 'ruby': return '#E0115F';
      case 'sapphire': return '#0F52BA';
      case 'emerald': return '#2A5B5E'; // Nile Teal
      default: return '#2A5B5E';
    }
  }

  useEffect(() => {
    if (groupRef.current) {
      // Scale the model proportionally
      groupRef.current.scale.set(size, size, size);
      
      // Position it higher in the viewport (increased y position)
      groupRef.current.position.set(0, 1.5, 0);
      
      // Slightly rotate for better initial view
      groupRef.current.rotation.set(-Math.PI / 12, Math.PI / 6, 0);
    }
  }, [size]);

  useEffect(() => {
    // Update materials with the appropriate colors
    scene.traverse((child: any) => {
      if (child.isMesh) {
        if (child.material.name === 'Metal') {
          child.material = new THREE.MeshStandardMaterial({
            ...child.material,
            color: getMetalColor(metalType),
            metalness: 0.9,
            roughness: 0.1,
            envMapIntensity: 1.5,
          });
          
          // Remove shadow properties for better performance
          child.castShadow = false;
          child.receiveShadow = false;
        } else if (child.material.name === 'Crystal') {
          // Enhanced gemstone material
          child.material = new THREE.MeshStandardMaterial({
            ...child.material,
            color: getGemColor(gemType),
            metalness: 0.2,
            roughness: 0.0,
            transparent: true,
            opacity: 0.95,
            envMapIntensity: 3.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
          });
          
          // Remove shadow properties for better performance
          child.castShadow = false;
          child.receiveShadow = false;
        }
      }
    });
  }, [metalType, gemType, scene]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

export function JewelryViewer(props: JewelryViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controlsRef = useRef<any>(null);
  
  useEffect(() => {
    // Simulate loading completion
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Error handler for Three.js errors
  const handleError = (e: ErrorEvent) => {
    console.error('Three.js error:', e);
    setError('An error occurred while rendering the 3D model');
  };

  useEffect(() => {
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Set controls position after component mounts
  useEffect(() => {
    if (controlsRef.current) {
      // Update orbit controls to focus on the elevated ring position
      controlsRef.current.target.set(0, 1.5, 0);
      controlsRef.current.update();
    }
  }, []);

  return (
    <div className="w-full h-[400px] sm:h-[500px] bg-bg-light rounded-lg overflow-hidden relative shadow-lg">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-light z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pharaonic-gold"></div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-light z-10">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      )}
      <Canvas
        shadows={false}
        camera={{ position: [0, 1.5, 7], fov: 35 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#F5F3F0']} />
        
        {/* Enhanced lighting setup for jewelry */}
        <ambientLight intensity={0.75} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.5}
        />
        <directionalLight
          position={[-5, 5, 10]}
          intensity={0.7}
          color="#C4A265"
        />
        <directionalLight
          position={[-10, 0, -10]}
          intensity={0.3}
          color="#2A5B5E"
        />
        <spotLight 
          position={[5, 5, 5]} 
          angle={0.3} 
          penumbra={0.8} 
          intensity={2} 
        />
        
        {/* Jewelry-specific lighting to enhance sparkles */}
        <pointLight position={[0, 3, 0]} intensity={1.2} color="#ffffff" />
        <pointLight position={[3, 0, 3]} intensity={0.8} color="#dcebff" />
        
        <Suspense fallback={null}>
          <JewelryModel {...props} />
        </Suspense>
        
        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          dampingFactor={0.05}
          enableDamping={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          target={[0, 1.5, 0]} // Target focused on the elevated ring position
        />
        
        <CustomEnvironment preset="studio" />
      </Canvas>
      
      {/* Small help text */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white/50 rounded px-2 py-1">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
} 