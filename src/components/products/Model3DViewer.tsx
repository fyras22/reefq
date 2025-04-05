'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  PresentationControls,
  Html,
  useProgress 
} from '@react-three/drei';
import { Suspense } from 'react';

interface Model3DProps {
  modelPath: string;
  alt: string;
}

/**
 * Loading indicator for 3D models
 */
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="mb-2 w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-gray-600 text-sm">{Math.round(progress)}% loaded</p>
      </div>
    </Html>
  );
}

/**
 * Model component that handles loading the 3D model
 */
function Model({ modelPath }: { modelPath: string }) {
  const gltf = useGLTF(modelPath, true);
  const { scene } = gltf;
  const { camera } = useThree();
  
  // Center the camera on the model
  useEffect(() => {
    // Reset camera position
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
    
    // Auto-rotate slowly
    const timer = setInterval(() => {
      if (scene.rotation) {
        scene.rotation.y += 0.01;
      }
    }, 50);
    
    return () => clearInterval(timer);
  }, [camera, scene]);
  
  // Add a slight continuous rotation
  useFrame(() => {
    if (scene.rotation) {
      scene.rotation.y += 0.002;
    }
  });

  return <primitive object={scene} />;
}

/**
 * Main 3D Viewer component
 */
export default function Model3DViewer({ modelPath, alt }: Model3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state for demo purposes
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative bg-gradient-to-b from-white to-gray-100"
      aria-label={`3D model of ${alt}`}
    >
      {/* Top gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={<Loader />}>
          <PresentationControls
            global
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
            config={{ mass: 1, tension: 170, friction: 26 }}
            snap={{ mass: 4, tension: 400, friction: 40 }}
          >
            <Model modelPath={modelPath} />
          </PresentationControls>
          
          {/* Environment lighting */}
          <Environment preset="studio" />
        </Suspense>
        
        {/* Orbit controls for mouse interaction */}
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
          makeDefault
        />
      </Canvas>
      
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-20">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-sm text-gray-600">Loading 3D Model...</p>
          </div>
        </div>
      )}
      
      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
    </div>
  );
}

// Preload common models to improve performance
useGLTF.preload('/assets/models/glb/rings/diamond-solitaire/default.glb');
useGLTF.preload('/assets/models/glb/necklaces/sapphire-pendant/default.glb'); 