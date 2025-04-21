'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { CustomEnvironment } from './CustomEnvironment';

interface JewelryViewerProps {
  metalType?: 'gold' | 'silver' | 'platinum' | 'rose-gold' | 'white-gold';
  gemType?: 'diamond' | 'ruby' | 'sapphire' | 'emerald' | 'amethyst';
  size?: number;
  setting?: string;
  engraving?: string;
}

function JewelryModel({ 
  metalType = 'gold', 
  gemType = 'emerald', 
  size = 1,
  setting = 'prong',
  engraving = ''
}: JewelryViewerProps) {
  const { scene } = useGLTF('/models/diamond_engagement_ring.glb');
  const groupRef = useRef<THREE.Group>(null);
  
  // Get color based on metal type
  function getMetalColor(type: string = 'gold') {
    switch(type) {
      case 'gold': return '#C4A265'; // Pharaonic Gold
      case 'silver': return '#E0E0E0';
      case 'platinum': return '#E5E4E2';
      case 'rose-gold': return '#B76E79';
      case 'white-gold': return '#F5F5F5';
      default: return '#C4A265';
    }
  }

  // Get metalness and roughness values based on metal type
  function getMetalProps(type: string = 'gold') {
    switch(type) {
      case 'gold': return { metalness: 0.9, roughness: 0.1 };
      case 'silver': return { metalness: 0.95, roughness: 0.05 };
      case 'platinum': return { metalness: 0.85, roughness: 0.15 };
      case 'rose-gold': return { metalness: 0.9, roughness: 0.1 };
      case 'white-gold': return { metalness: 0.92, roughness: 0.08 };
      default: return { metalness: 0.9, roughness: 0.1 };
    }
  }

  // Get color based on gem type
  function getGemColor(type: string = 'emerald') {
    switch(type) {
      case 'diamond': return '#FFFFFF';
      case 'ruby': return '#E0115F';
      case 'sapphire': return '#0F52BA';
      case 'emerald': return '#2A5B5E'; // Nile Teal
      case 'amethyst': return '#9966CC';
      default: return '#2A5B5E';
    }
  }

  // Get gem properties based on gem type
  function getGemProps(type: string = 'emerald') {
    switch(type) {
      case 'diamond': 
        return { 
          metalness: 0.2, 
          roughness: 0.0, 
          opacity: 0.95, 
          envMapIntensity: 4.0,
          clearcoat: 1.0, 
          clearcoatRoughness: 0.0,
          transmission: 0.95,
          ior: 2.42
        };
      case 'ruby': 
        return { 
          metalness: 0.2, 
          roughness: 0.1, 
          opacity: 0.95, 
          envMapIntensity: 2.5,
          clearcoat: 0.8, 
          clearcoatRoughness: 0.1
        };
      case 'sapphire': 
        return { 
          metalness: 0.3, 
          roughness: 0.1, 
          opacity: 0.95, 
          envMapIntensity: 2.5,
          clearcoat: 0.8, 
          clearcoatRoughness: 0.1
        };
      case 'emerald': 
        return { 
          metalness: 0.2, 
          roughness: 0.2, 
          opacity: 0.9, 
          envMapIntensity: 2.0,
          clearcoat: 0.7, 
          clearcoatRoughness: 0.2
        };
      case 'amethyst': 
        return { 
          metalness: 0.2, 
          roughness: 0.1, 
          opacity: 0.92, 
          envMapIntensity: 2.2,
          clearcoat: 0.8, 
          clearcoatRoughness: 0.15
        };
      default: 
        return { 
          metalness: 0.2, 
          roughness: 0.1, 
          opacity: 0.9, 
          envMapIntensity: 2.0,
          clearcoat: 0.8, 
          clearcoatRoughness: 0.1
        };
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
          const metalProps = getMetalProps(metalType);
          child.material = new THREE.MeshStandardMaterial({
            ...child.material,
            color: getMetalColor(metalType),
            metalness: metalProps.metalness,
            roughness: metalProps.roughness,
            envMapIntensity: 1.5,
            needsUpdate: true
          });
          
          // Remove shadow properties for better performance
          child.castShadow = false;
          child.receiveShadow = false;
        } else if (child.material.name === 'Crystal') {
          // Enhanced gemstone material
          const gemProps = getGemProps(gemType);
          
          child.material = new THREE.MeshPhysicalMaterial({
            ...child.material,
            color: getGemColor(gemType),
            metalness: gemProps.metalness,
            roughness: gemProps.roughness,
            transparent: true,
            opacity: gemProps.opacity,
            envMapIntensity: gemProps.envMapIntensity,
            clearcoat: gemProps.clearcoat,
            clearcoatRoughness: gemProps.clearcoatRoughness,
            transmission: gemProps.transmission || 0,
            ior: gemProps.ior || 1.5,
            needsUpdate: true
          });
          
          // Remove shadow properties for better performance
          child.castShadow = false;
          child.receiveShadow = false;
        }
      }
    });
  }, [metalType, gemType, scene, setting]);

  // Add subtle animation to make the jewelry sparkle
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      // Very subtle floating motion
      groupRef.current.position.y = 1.5 + Math.sin(t * 0.5) * 0.03;
      
      // Very subtle rotation
      groupRef.current.rotation.y = Math.PI / 6 + Math.sin(t * 0.25) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      {engraving && (
        <Html
          position={[0, -0.5, 0]}
          center
          className="pointer-events-none select-none"
        >
          <div className="bg-transparent text-gray-600 text-sm px-2 py-1 rounded">
            <span className="italic">{engraving}</span>
          </div>
        </Html>
      )}
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
          outputColorSpace: THREE.SRGBColorSpace,
          preserveDrawingBuffer: true
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
        <pointLight position={[-3, 2, -3]} intensity={0.6} color="#ffe1c8" />
        
        <Suspense fallback={null}>
          <JewelryModel {...props} />
        </Suspense>
        
        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          dampingFactor={0.05}
          enableDamping={true}
          autoRotate={false}
          autoRotateSpeed={0.5}
          target={[0, 1.5, 0]} // Target focused on the elevated ring position
        />
        
        <CustomEnvironment preset="studio" />
      </Canvas>
      
      {/* Controls help text */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white/50 rounded px-2 py-1">
        Drag to rotate • Scroll to zoom
      </div>
      
      {/* Screenshot button */}
      <button
        onClick={() => {
          const canvas = document.querySelector('canvas');
          if (canvas) {
            const link = document.createElement('a');
            link.download = 'custom-jewelry.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
          }
        }}
        className="absolute bottom-2 right-2 bg-white/80 hover:bg-white text-gray-700 text-xs rounded-md px-2 py-1 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Save Image
      </button>
    </div>
  );
} 