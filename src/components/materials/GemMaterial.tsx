import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ShaderMaterial, Vector3, Color, CubeCamera, WebGLCubeRenderTarget, RGBAFormat, LinearMipmapLinearFilter, sRGBEncoding } from 'three';
import { useThree } from '@react-three/fiber';

interface GemMaterialProps {
  type: 'diamond' | 'ruby' | 'sapphire' | 'emerald';
  color?: string;
  dispersion?: number;
  refractionIndex?: number;
}

const gemProperties = {
  diamond: {
    color: '#FFFFFF',
    dispersion: 0.044,
    refractionIndex: 2.42,
    envMapIntensity: 2.0,
    chromaAbIntensity: 1.0
  },
  ruby: {
    color: '#E0115F',
    dispersion: 0.027,
    refractionIndex: 1.77,
    envMapIntensity: 1.3,
    chromaAbIntensity: 0.5
  },
  sapphire: {
    color: '#0F52BA',
    dispersion: 0.018,
    refractionIndex: 1.77,
    envMapIntensity: 1.2,
    chromaAbIntensity: 0.4
  },
  emerald: {
    color: '#046307',
    dispersion: 0.014,
    refractionIndex: 1.57,
    envMapIntensity: 1.0,
    chromaAbIntensity: 0.3
  },
};

// Enhanced vertex shader with additional data for refraction
const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Enhanced fragment shader with improved dispersion and refraction
const fragmentShader = `
  uniform vec3 color;
  uniform float dispersion;
  uniform float refractionIndex;
  uniform samplerCube envMap;
  uniform float envMapIntensity;
  uniform float chromaAbIntensity;
  uniform float time;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  
  // Fresnel approximation
  float fresnelApprox(vec3 normal, vec3 viewDir, float refractionIndex) {
    float r0 = (1.0 - refractionIndex) / (1.0 + refractionIndex);
    r0 *= r0;
    float cosX = abs(dot(normal, viewDir));
    float x = 1.0 - cosX;
    float xx = x * x;
    return r0 + (1.0 - r0) * xx * xx * x;
  }
  
  // Chromatic aberration function to simulate dispersion of light
  vec3 chromaticAberration(samplerCube envMap, vec3 direction, float aberration, float refractIndex) {
    vec3 refractVecR = refract(direction, vNormal, refractIndex - aberration * 0.01);
    vec3 refractVecG = refract(direction, vNormal, refractIndex);
    vec3 refractVecB = refract(direction, vNormal, refractIndex + aberration * 0.01);
    
    // Use a fallback color if environment map is not available
    if (envMap == samplerCube(0)) {
      return color * (0.8 + 0.2 * sin(time + vPosition.x * 10.0));
    }
    
    float r = textureCube(envMap, refractVecR).r;
    float g = textureCube(envMap, refractVecG).g;
    float b = textureCube(envMap, refractVecB).b;
    
    return vec3(r, g, b);
  }
  
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    vec3 worldViewDir = normalize(cameraPosition - vWorldPosition);
    
    // Enhanced Fresnel effect
    float fresnel = fresnelApprox(normal, worldViewDir, 1.0 / refractionIndex);
    
    // Reflection and refraction with fallbacks
    vec3 reflected = reflect(-worldViewDir, normal);
    vec4 reflectedColor;
    vec3 refracted;
    
    // Check if environment map is available
    if (envMap == samplerCube(0)) {
      // Fallback for reflection
      reflectedColor = vec4(color * (0.5 + 0.5 * fresnel), 1.0);
      
      // Fallback for refraction - use base color with some variation
      refracted = color * (0.8 + 0.2 * sin(time + length(vPosition) * 5.0));
    } else {
      // Normal reflection with environment
      reflectedColor = textureCube(envMap, reflected) * envMapIntensity;
      
      // Refraction with chromatic aberration for dispersion
      if (chromaAbIntensity > 0.0) {
        refracted = chromaticAberration(envMap, -worldViewDir, dispersion * chromaAbIntensity * 2.0, 1.0 / refractionIndex);
      } else {
        vec3 refractVec = refract(-worldViewDir, normal, 1.0 / refractionIndex);
        refracted = textureCube(envMap, refractVec).rgb;
      }
    }
    
    // Add subtle sparkle effect that changes over time
    float sparkleIntensity = 0.0;
    if (dispersion > 0.02) { // More sparkles for diamonds
      float noise = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) * time * 0.1) * 43758.5453);
      float sparkleThreshold = 0.97; // Higher threshold = fewer sparkles
      if (noise > sparkleThreshold) {
        sparkleIntensity = (noise - sparkleThreshold) * (1.0 / (1.0 - sparkleThreshold)) * 2.0;
      }
    }
    
    // Mix gem base color with environment reflections and refractions
    vec3 gemColor = mix(color, refracted, 0.8);
    vec3 finalColor = mix(gemColor, reflectedColor.rgb, fresnel) + sparkleIntensity;
    
    // Apply color tint more strongly for colored gems, less for diamond
    if (dispersion < 0.04) { // Not diamond
      finalColor = mix(finalColor, color * finalColor, 0.4);
    }
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export function GemMaterial({ type, color, dispersion, refractionIndex }: GemMaterialProps) {
  const materialRef = useRef<ShaderMaterial>(null);
  const { scene } = useThree();
  const timeRef = useRef(0);
  
  // Update material on each frame
  useFrame((state, delta) => {
    if (materialRef.current && scene.environment) {
      // Update environment map
      materialRef.current.uniforms.envMap.value = scene.environment;
      
      // Update time for animated effects
      timeRef.current += delta;
      materialRef.current.uniforms.time.value = timeRef.current;
    }
  });

  const gemColor = new Color(color || gemProperties[type].color);

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={{
        color: { value: new Vector3(gemColor.r, gemColor.g, gemColor.b) },
        dispersion: { value: dispersion || gemProperties[type].dispersion },
        refractionIndex: { value: refractionIndex || gemProperties[type].refractionIndex },
        envMap: { value: scene.environment || null },
        envMapIntensity: { value: gemProperties[type].envMapIntensity },
        chromaAbIntensity: { value: gemProperties[type].chromaAbIntensity },
        time: { value: 0 }
      }}
      transparent
    />
  );
} 