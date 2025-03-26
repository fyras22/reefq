import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshPhysicalMaterial, Vector2, Color, FrontSide, RepeatWrapping } from 'three';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface MetalMaterialProps {
  type: 'gold' | 'silver' | 'platinum';
  roughness?: number;
  metalness?: number;
  envMapIntensity?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  anisotropy?: number;
}

// Advanced PBR properties for metals based on real-world values
const metalProperties = {
  gold: {
    color: '#FFD700',
    emissive: '#000000',
    metalness: 1.0,
    roughness: 0.15,
    reflectivity: 1.0,
    clearcoat: 0.2,
    clearcoatRoughness: 0.3,
    anisotropy: 0.5,
    envMapIntensity: 1.5,
    attenuationColor: '#FFD700',
    attenuationDistance: 1.0,
    normalScale: 0.1
  },
  silver: {
    color: '#E0E0E0',
    emissive: '#000000',
    metalness: 1.0,
    roughness: 0.1,
    reflectivity: 1.0,
    clearcoat: 0.1,
    clearcoatRoughness: 0.2,
    anisotropy: 0.3,
    envMapIntensity: 1.2,
    attenuationColor: '#E0E0E0',
    attenuationDistance: 1.0,
    normalScale: 0.1
  },
  platinum: {
    color: '#E5E4E2',
    emissive: '#000000',
    metalness: 1.0,
    roughness: 0.2,
    reflectivity: 0.95,
    clearcoat: 0.3,
    clearcoatRoughness: 0.4,
    anisotropy: 0.2,
    envMapIntensity: 1.0,
    attenuationColor: '#E5E4E2',
    attenuationDistance: 1.0,
    normalScale: 0.1
  },
};

export function MetalMaterial({ 
  type, 
  roughness, 
  metalness, 
  envMapIntensity,
  clearcoat,
  clearcoatRoughness,
  anisotropy
}: MetalMaterialProps) {
  const materialRef = useRef<MeshPhysicalMaterial>(null);
  
  // Load normal map for fine surface details
  const normalMap = useTexture('/textures/metal_normal.jpg', (texture) => {
    texture.repeat.set(1, 1);
    texture.wrapS = texture.wrapT = RepeatWrapping;
  });

  useFrame((state) => {
    if (materialRef.current && state.scene.environment) {
      // Update environment map and intensity
      materialRef.current.envMap = state.scene.environment;
      materialRef.current.envMapIntensity = envMapIntensity || metalProperties[type].envMapIntensity;
      
      // Subtle rotation of anisotropy angle for dynamic lighting effects
      if (materialRef.current.anisotropyRotation !== undefined) {
        materialRef.current.anisotropyRotation += 0.001;
      }
    }
  });

  return (
    <meshPhysicalMaterial
      ref={materialRef}
      color={metalProperties[type].color}
      emissive={metalProperties[type].emissive}
      metalness={metalness || metalProperties[type].metalness}
      roughness={roughness || metalProperties[type].roughness}
      reflectivity={metalProperties[type].reflectivity}
      clearcoat={clearcoat || metalProperties[type].clearcoat}
      clearcoatRoughness={clearcoatRoughness || metalProperties[type].clearcoatRoughness}
      clearcoatNormalMap={normalMap}
      clearcoatNormalScale={new Vector2(metalProperties[type].normalScale, metalProperties[type].normalScale)}
      anisotropy={anisotropy || metalProperties[type].anisotropy}
      anisotropyRotation={0}
      envMapIntensity={envMapIntensity || metalProperties[type].envMapIntensity}
      attenuationColor={new Color(metalProperties[type].attenuationColor)}
      attenuationDistance={metalProperties[type].attenuationDistance}
      side={FrontSide}
    />
  );
} 