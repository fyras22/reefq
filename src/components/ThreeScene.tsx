import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  ContactShadows, 
  useProgress,
  Html
} from '@react-three/drei';

// Error boundary for graceful fallbacks
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Error in 3D component:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Loader component
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-24 h-24 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 mt-2">{progress.toFixed(0)}% loaded</p>
      </div>
    </Html>
  );
}

// Jewelry Ring component with realistic materials
function JewelryRing({
  modelPath = '/models/ring.glb',
  metalType = 'gold',
  gemType = 'diamond',
  size = 1.0,
}: {
  modelPath?: string;
  metalType?: 'gold' | 'silver' | 'platinum';
  gemType?: 'diamond' | 'ruby' | 'emerald' | 'sapphire';
  size?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const [model, setModel] = useState<any>(null);
  
  // Load the model
  useEffect(() => {
    try {
      const gltf = useGLTF(modelPath);
      setModel(gltf);
    } catch (error) {
      console.error("Error loading model:", error);
    }
  }, [modelPath]);
  
  // Scale based on size
  useEffect(() => {
    if (group.current && group.current.scale) {
      group.current.scale.set(size, size, size);
    }
  }, [size]);
  
  // Material colors based on props
  const metalColors = {
    gold: '#FFD700',
    silver: '#C0C0C0',
    platinum: '#E5E4E2',
  };
  
  const gemColors = {
    diamond: '#FFFFFF',
    ruby: '#E0115F',
    emerald: '#50C878',
    sapphire: '#0F52BA',
  };

  // Rotate the model slowly for showcase
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      {model && <primitive object={model.scene.clone()} />}
    </group>
  );
}

type SceneProps = {
  modelPath?: string;
  metalType?: 'gold' | 'silver' | 'platinum';
  gemType?: 'diamond' | 'ruby' | 'emerald' | 'sapphire';
  size?: number;
  showControls?: boolean;
  backgroundColor?: string;
};

export default function Scene({
  modelPath = '/models/ring.glb',
  metalType = 'gold',
  gemType = 'diamond',
  size = 1.0,
  showControls = true,
  backgroundColor = 'transparent',
}: SceneProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <ErrorBoundary fallback={<div className="text-center p-4">Failed to load 3D model</div>}>
      <div className="w-full h-full min-h-[500px]" style={{ background: backgroundColor }}>
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 2]} // Optimize for performance and quality
          legacy={false} // Use new WebGL features when available
          onCreated={() => {
            console.log('Canvas created');
            setIsLoaded(true);
          }}
          data-testid="canvas-mock"
        >
          {/* Lighting setup */}
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1.5} 
            castShadow 
            shadow-mapSize-width={1024} 
            shadow-mapSize-height={1024}
          />
          <directionalLight 
            position={[-10, -10, -5]} 
            intensity={0.5} 
          />
          <directionalLight 
            position={[0, 10, 0]} 
            intensity={1.5} 
          />
          
          {/* Main content with Suspense for loading */}
          <Suspense fallback={<Loader />}>
            <JewelryRing 
              modelPath={modelPath}
              metalType={metalType}
              gemType={gemType}
              size={size}
            />
            <Environment preset="apartment" />
            <ContactShadows 
              position={[0, -1, 0]} 
              opacity={0.75} 
              scale={10} 
              blur={2.5} 
              far={4} 
              resolution={256} 
              color="#000000" 
            />
          </Suspense>
          
          {/* Controls */}
          {showControls && <OrbitControls 
            enablePan={false}
            minDistance={3}
            maxDistance={8}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
          />}
        </Canvas>
      </div>
    </ErrorBoundary>
  );
} 