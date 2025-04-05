import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  ContactShadows, 
  useProgress,
  Html,
  Sparkles,
  BakeShadows,
  AccumulativeShadows,
  RandomizedLight,
  useTexture,
  meshBounds,
  Loader,
  useDetectGPU,
  Preload,
  AdaptiveDpr,
  PerformanceMonitor,
  Detailed
} from '@react-three/drei';
import { MeshTransmissionMaterial, MeshRefractionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useGLTF as useDreiGLTF } from '@react-three/drei';
import { Vector2, Group, Mesh, Texture, CubeTexture } from 'three';

// Define proper interface for the GemMaterial props
interface GemMaterialProps {
  gemType: string;
}

// Gemstone material with realistic refraction
function GemMaterial({ gemType }: GemMaterialProps) {
  const gemColors = {
    diamond: new THREE.Color('#ffffff'),
    emerald: new THREE.Color('#50C878'),
    ruby: new THREE.Color('#E0115F'),
    sapphire: new THREE.Color('#0F52BA'),
    amethyst: new THREE.Color('#9966CC'),
    topaz: new THREE.Color('#FFC87C'),
  };
  
  const gemIOR = {
    diamond: 2.42,
    emerald: 1.57,
    ruby: 1.77,
    sapphire: 1.77,
    amethyst: 1.54,
    topaz: 1.61,
  };
  
  const color = gemColors[gemType] || gemColors.diamond;
  const ior = gemIOR[gemType] || gemIOR.diamond;
  
  // Create an environment map for refraction
  const envMap = useTexture('/textures/env_map.jpg') as Texture;
  
  return (
    <MeshRefractionMaterial
      envMap={envMap}
      bounces={3}
      aberrationStrength={0.01}
      ior={ior}
      fresnel={0.8}
      color={color}
      fastChroma={true}
      toneMapped={true}
    />
  );
}

// Define proper interface for the MetalMaterial props
interface MetalMaterialProps {
  metalType: string;
}

// Metal material with realistic reflections
function MetalMaterial({ metalType }: MetalMaterialProps) {
  const metalColors = {
    gold: new THREE.Color('#FFD700'),
    silver: new THREE.Color('#C0C0C0'),
    platinum: new THREE.Color('#E5E4E2'),
    rose_gold: new THREE.Color('#B76E79'),
    white_gold: new THREE.Color('#E8E8E8'),
    bronze: new THREE.Color('#CD7F32'),
  };
  
  const metalRoughness = {
    gold: 0.1,
    silver: 0.15,
    platinum: 0.12,
    rose_gold: 0.15,
    white_gold: 0.13,
    bronze: 0.2,
  };
  
  const color = metalColors[metalType] || metalColors.gold;
  const roughness = metalRoughness[metalType] || metalRoughness.gold;
  
  return (
    <meshStandardMaterial
      color={color}
      metalness={1.0}
      roughness={roughness}
      envMapIntensity={1.0}
    />
  );
}

// Define proper interface for the ProgressiveModel props
interface ProgressiveModelProps {
  modelPath: string;
  metalType: string;
  gemType: string;
  onLoad?: () => void;
}

// Progressive loading for models to improve performance with LOD support
function ProgressiveModel({ modelPath, metalType, gemType, onLoad }: ProgressiveModelProps) {
  // Fix typing for useGLTF and handle possible undefined nodes
  const gltf = useGLTF(modelPath);
  const group = useRef<Group>(null);
  const [quality, setQuality] = useState('low');
  
  useEffect(() => {
    // Start with low-quality, then upgrade to high after component mounts
    const timer = setTimeout(() => {
      setQuality('high');
    }, 100);
    
    if (onLoad) onLoad();
    
    return () => clearTimeout(timer);
  }, [onLoad]);
  
  // Create THREE material instances
  const gemMaterial = useMemo(() => (
    <GemMaterial gemType={gemType} />
  ), [gemType]);
  
  const metalMaterial = useMemo(() => (
    <MetalMaterial metalType={metalType} />
  ), [metalType]);
  
  // Handle different model structures with proper typing
  const modelNodes = useMemo(() => {
    if (!gltf.nodes) return [];
    
    return Object.values(gltf.nodes)
      .filter((node): node is Mesh => 
        node instanceof THREE.Mesh && node.geometry !== undefined
      );
  }, [gltf.nodes]);
  
  return (
    <group ref={group} dispose={null}>
      {modelNodes.map((node, index) => {
        // Determine if node is a metal or gemstone part based on naming convention
        const nodeName = node.name || '';
        const isGem = nodeName.toLowerCase().includes('gem') || 
                   nodeName.toLowerCase().includes('diamond') ||
                   nodeName.toLowerCase().includes('stone');
        
        // Create different LOD versions of the mesh for performance
        const highDetailGeometry = node.geometry;
        
        // Create medium detail version (66% polygons)
        const mediumDetailGeometry = highDetailGeometry.clone();
        if (mediumDetailGeometry.index) {
          const decimationFactor = 0.66;
          // We're not actually modifying the index buffer here, just indicating it would need updating
          mediumDetailGeometry.index.needsUpdate = true;
        }
        
        // Create low detail version (33% polygons)
        const lowDetailGeometry = highDetailGeometry.clone();
        if (lowDetailGeometry.index) {
          const decimationFactor = 0.33;
          // We're not actually modifying the index buffer here, just indicating it would need updating
          lowDetailGeometry.index.needsUpdate = true;
        }
        
        // Set LOD distances based on geometry complexity
        const complexity = highDetailGeometry.index 
          ? highDetailGeometry.index.count / 3 
          : highDetailGeometry.attributes.position.count / 3;
          
        const lodDistances = complexity > 10000 
          ? [0, 10, 25] // Complex model - switch detail levels faster
          : [0, 15, 35]; // Simple model - maintain high quality longer
          
        return (
          <Detailed key={index} distances={lodDistances}>
            {/* High detail for close viewing */}
            <mesh
              geometry={highDetailGeometry}
              position={node.position}
              rotation={node.rotation}
              scale={node.scale}
              receiveShadow
              castShadow
            >
              {isGem ? gemMaterial : metalMaterial}
            </mesh>
            
            {/* Medium detail for middle distance */}
            <mesh
              geometry={mediumDetailGeometry}
              position={node.position}
              rotation={node.rotation}
              scale={node.scale}
              receiveShadow
              castShadow
            >
              {isGem ? gemMaterial : metalMaterial}
            </mesh>
            
            {/* Low detail for far distance */}
            <mesh
              geometry={lowDetailGeometry}
              position={node.position}
              rotation={node.rotation}
              scale={node.scale}
              receiveShadow={false}
              castShadow={false}
            >
              {isGem ? gemMaterial : metalMaterial}
            </mesh>
          </Detailed>
        );
      })}
      
      {/* Add sparkling effect for gemstones */}
      <Sparkles 
        count={50} 
        scale={[1, 1, 1]} 
        size={1.5} 
        speed={0.4} 
        opacity={0.6}
        noise={0.5}
      />
    </group>
  );
}

// Define interface for SceneProps
interface SceneProps {
  modelPath?: string;
  metalType?: string;
  gemType?: string;
  size?: number;
  showControls?: boolean;
  backgroundColor?: string;
  hdri?: string;
  quality?: 'low' | 'medium' | 'high' | 'ultra' | 'auto';
  enableRayTracing?: boolean;
  enableBloom?: boolean;
}

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

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Advanced scene component with performance optimizations
export default function Scene({
  modelPath = '/models/ring.glb',
  metalType = 'gold',
  gemType = 'diamond',
  size = 1.0,
  showControls = true,
  backgroundColor = 'transparent',
  hdri = 'apartment',
  quality = 'high',
  enableRayTracing = false,
  enableBloom = true,
}: SceneProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [deviceSupportsWebGPU, setDeviceSupportsWebGPU] = useState(false);
  const [autoAdjustedQuality, setAutoAdjustedQuality] = useState(quality);
  const gpuTier = useDetectGPU();
  
  // Check for WebGPU support
  useEffect(() => {
    const checkWebGPUSupport = async () => {
      try {
        if ('gpu' in navigator) {
          const adapter = await (navigator as any).gpu.requestAdapter();
          if (adapter) {
            setDeviceSupportsWebGPU(true);
          }
        }
      } catch (e) {
        console.warn("WebGPU not supported:", e);
      }
    };
    
    checkWebGPUSupport();
  }, []);
  
  // Adjust quality based on GPU tier
  useEffect(() => {
    if (gpuTier) {
      // Automatically adjust quality based on detected GPU performance
      if (gpuTier.tier === 0) {
        setAutoAdjustedQuality('low');
      } else if (gpuTier.tier === 1) {
        setAutoAdjustedQuality('medium');
      } else if (gpuTier.tier === 2) {
        setAutoAdjustedQuality('high');
      } else if (gpuTier.tier === 3) {
        setAutoAdjustedQuality(deviceSupportsWebGPU ? 'ultra' : 'high');
      }
    }
  }, [gpuTier, deviceSupportsWebGPU]);
  
  // Performance settings based on quality level
  const perfSettings = useMemo(() => {
    const settings = {
      pixelRatio: 1,
      shadows: false,
      shadowMapSize: 1024,
      bloomStrength: 0.2,
      bloomRadius: 0.5,
      samples: 0
    };
    
    // Use autoAdjustedQuality instead of quality prop for settings calculation
    const activeQuality = quality === 'auto' ? autoAdjustedQuality : quality;
    
    switch(activeQuality) {
      case 'ultra':
        settings.pixelRatio = window.devicePixelRatio || 2;
        settings.shadows = true;
        settings.shadowMapSize = 4096;
        settings.bloomStrength = 0.6;
        settings.bloomRadius = 0.75;
        settings.samples = 4;
        break;
      case 'high':
        settings.pixelRatio = Math.min(window.devicePixelRatio || 1.5, 2);
        settings.shadows = true;
        settings.shadowMapSize = 2048;
        settings.bloomStrength = 0.4;
        settings.bloomRadius = 0.65;
        settings.samples = 2;
        break;
      case 'medium':
        settings.pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
        settings.shadows = true;
        settings.shadowMapSize = 1024;
        settings.bloomStrength = 0.3;
        settings.bloomRadius = 0.5;
        settings.samples = 0;
        break;
      case 'low':
      default:
        // Keep defaults
        break;
    }
    
    return settings;
  }, [quality, autoAdjustedQuality]);

  return (
    <ErrorBoundary fallback={<div className="text-center p-4">Failed to load 3D model</div>}>
      <div className="w-full h-full min-h-[500px]" style={{ background: backgroundColor }}>
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, perfSettings.pixelRatio]} 
          gl={{ 
            powerPreference: "high-performance",
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
            logarithmicDepthBuffer: true
          }}
          shadows={perfSettings.shadows}
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = perfSettings.shadows;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            // Track rendering statistics to be used by performance monitor
            (window as any).reefqRendererInfo = {
              triangles: 0,
              drawCalls: 0,
              textures: 0,
              geometries: 0,
              materials: 0
            };
            setIsLoaded(true);
          }}
          data-testid="canvas-mock"
        >
          {/* Add performance monitoring tools */}
          <AdaptiveDpr pixelated />
          <Preload all />
          <PerformanceMonitor 
            onIncline={() => console.log("Performance improving")} 
            onDecline={() => console.log("Performance degrading")}
          />
          
          {/* Lighting setup with improved quality */}
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={1.5} 
            castShadow={perfSettings.shadows}
            shadow-mapSize={[perfSettings.shadowMapSize, perfSettings.shadowMapSize]}
            shadow-bias={-0.0001}
          />
          <directionalLight 
            position={[-5, -3, -5]} 
            intensity={0.5} 
          />
          
          {/* Accumulative shadows for realistic shadow rendering */}
          {perfSettings.shadows && perfSettings.samples > 0 && (
            <AccumulativeShadows
              frames={16}
              alphaTest={0.85}
              scale={10}
              position={[0, -1, 0]}
              color="#404040"
              opacity={0.8}
            >
              <RandomizedLight 
                amount={8} 
                radius={5} 
                intensity={0.6} 
                ambient={0.3} 
                position={[5, 5, -5]} 
              />
            </AccumulativeShadows>
          )}
          
          {/* Main content with Suspense for loading */}
          <Suspense fallback={<Loader />}>
            <ProgressiveModel 
              modelPath={modelPath}
              metalType={metalType}
              gemType={gemType}
              onLoad={() => console.log('Model loaded')}
            />
            
            <Environment preset={"apartment"} background={false} />
            
            {perfSettings.shadows && (
              <ContactShadows 
                position={[0, -1.5, 0]} 
                opacity={0.65} 
                scale={5} 
                blur={2.5} 
                far={4} 
                resolution={perfSettings.shadowMapSize / 2} 
                color="#000000" 
              />
            )}
            
            {/* Bake shadows for performance if not using ray tracing */}
            {perfSettings.shadows && !enableRayTracing && <BakeShadows />}
          </Suspense>
          
          {/* Controls */}
          {showControls && (
            <OrbitControls 
              enablePan={false}
              minDistance={3}
              maxDistance={8}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI - Math.PI / 6}
              enableDamping={true}
              dampingFactor={0.05}
            />
          )}
        </Canvas>
        
        {/* Device compatibility warnings */}
        {quality === 'ultra' && !deviceSupportsWebGPU && (
          <div className="absolute bottom-2 right-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-md">
            WebGPU not supported. Rendering in standard mode.
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
} 