'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stage, useGLTF } from '@react-three/drei';
import { ErrorBoundary } from 'react-error-boundary';
import { Loader2 } from 'lucide-react';
import { Group, MeshStandardMaterial } from 'three';

interface RingViewerProps {
  metalColor?: string;
  gemColor?: string;
  size?: number;
  initialRotation?: [number, number, number];
  useSketchfab?: boolean;
  sketchfabId?: string;
  autoRotate?: boolean;
}

// Error Fallback Component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg">
      <p className="text-red-700 mb-4">Something went wrong loading the 3D model:</p>
      <pre className="text-sm text-red-600 mb-4">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

// Loading Component
function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
      <Loader2 className="w-8 h-8 animate-spin text-brand-teal" />
    </div>
  );
}

// Sketchfab Viewer Component
function SketchfabViewer({ modelId }: { modelId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = Math.min(width * 0.75, window.innerHeight * 0.7);
        containerRef.current.style.height = `${height}px`;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full bg-gray-100 rounded-lg overflow-hidden"
      role="region"
      aria-label="3D Ring Viewer"
    >
      <iframe
        title="3D Ring Model"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; fullscreen; xr-spatial-tracking"
        xr-spatial-tracking
        execution-while-out-of-viewport
        execution-while-not-rendered
        web-share
        src={`https://sketchfab.com/models/${modelId}/embed`}
        className="w-full h-full"
      />
    </div>
  );
}

// Ring Model Component
function RingModel({ metalColor = '#C0C0C0', gemColor = '#F0FFFF', size = 1 }: RingViewerProps) {
  const { scene } = useGLTF('/models/diamond_engagement_ring.glb');
  const groupRef = useRef<Group>(null);

  useEffect(() => {
    if (groupRef.current) {
      // Scale the model proportionally
      groupRef.current.scale.set(size, size, size);
      
      // Center the model and raise it higher in the viewport
      groupRef.current.position.set(0, 1.5, 0);
      
      // Slightly rotate to show at a better angle initially
      groupRef.current.rotation.set(-Math.PI / 12, Math.PI / 6, 0);
    }
  }, [size]);

  useEffect(() => {
    // Update materials when colors change
    scene.traverse((child: any) => {
      if (child.isMesh) {
        if (child.material.name === 'Metal') {
          child.material = new MeshStandardMaterial({
            ...child.material,
            color: metalColor,
            metalness: 0.9,
            roughness: 0.1,
            envMapIntensity: 1.5,
          });
          
          // Remove shadow properties
          child.castShadow = false;
          child.receiveShadow = false;
        } else if (child.material.name === 'Crystal') {
          // Enhanced diamond material with more realistic properties
          child.material = new MeshStandardMaterial({
            ...child.material,
            color: gemColor,
            metalness: 0.2,
            roughness: 0.0,
            transparent: true,
            opacity: 0.95,
            envMapIntensity: 3.0, // Enhanced environment reflections
            clearcoat: 1.0, // Add clearcoat layer for more realism
            clearcoatRoughness: 0.1,
          });
          
          // Remove shadow properties
          child.castShadow = false;
          child.receiveShadow = false;
        }
      }
    });
  }, [metalColor, gemColor, scene]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

// Main Ring Viewer Component
export default function RingViewer({
  metalColor = '#C0C0C0',
  gemColor = '#F0FFFF',
  size = 1,
  initialRotation = [0, 0, 0],
  useSketchfab = false,
  sketchfabId = '551b52524d4b4e7c889657cb741abe1e',
  autoRotate = false,
}: RingViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = Math.min(width * 0.75, window.innerHeight * 0.7);
        containerRef.current.style.height = `${height}px`;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (controlsRef.current) {
      // Set orbit control target to match the new elevated position
      controlsRef.current.target.set(0, 1.5, 0);
      controlsRef.current.update();
    }
  }, [initialRotation]);

  if (useSketchfab) {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <SketchfabViewer modelId={sketchfabId} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div
        ref={containerRef}
        className="w-full bg-gray-100 rounded-lg overflow-hidden relative"
        role="region"
        aria-label="3D Ring Viewer"
      >
        {isLoading && <LoadingFallback />}
        <Canvas
          camera={{ 
            position: [0, 1.5, 8], // Adjusted camera height to match new ring position
            fov: 35, // Narrower field of view for better details
            near: 0.1, 
            far: 1000
          }}
          shadows={false}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
        >
          <Suspense fallback={null}>
            {/* Custom lighting setup without shadows */}
            <group>
              {/* Main lighting setup */}
              <ambientLight intensity={0.75} />
              <directionalLight 
                position={[10, 10, 5]} 
                intensity={1.5} 
              />
              <directionalLight 
                position={[-10, -10, -5]} 
                intensity={0.8} 
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
              
              {/* Environment for reflections */}
              <Environment preset="studio" background={false} />
              
              <RingModel
                metalColor={metalColor}
                gemColor={gemColor}
                size={size}
              />
            </group>
            <OrbitControls
              ref={controlsRef}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={2}
              maxDistance={20}
              // Remove polar angle restrictions to allow full rotation
              minPolarAngle={0}
              maxPolarAngle={Math.PI}
              // Enable damping for smoother controls
              dampingFactor={0.05}
              enableDamping={true}
              // Allow rotation in all directions
              minAzimuthAngle={-Infinity}
              maxAzimuthAngle={Infinity}
              // Zoom speed control
              zoomSpeed={0.7}
              rotateSpeed={0.7}
              autoRotate={autoRotate}
              autoRotateSpeed={0.3}
              target={[0, 1.5, 0]} // Adjusted target to match new ring position
              onChange={() => setIsLoading(false)}
            />
          </Suspense>
        </Canvas>
      </div>
    </ErrorBoundary>
  );
} 