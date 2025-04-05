'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module';
import PerformanceMonitor from './PerformanceMonitor';
import Scene from './ThreeScene';
import PerformanceHUD from './PerformanceHUD';
import { performanceMonitor } from '../utils/performanceMetrics';

interface EnhancedJewelryViewerProps {
  modelPath: string;
  selectedMetal: 'gold' | 'silver' | 'platinum' | 'rosegold' | 'whitegold';
  selectedGem?: 'diamond' | 'ruby' | 'sapphire' | 'emerald' | 'amethyst' | 'topaz' | 'pearl';
  environmentPreset: 'jewelry_store' | 'outdoor' | 'studio' | 'evening';
  rotationSpeed?: number;
  enableBloom?: boolean;
  enableShadows?: boolean;
  enableZoom?: boolean;
  enablePan?: boolean;
  enableAR?: boolean;
  backgroundColor?: string;
  height?: number;
  quality?: 'low' | 'medium' | 'high' | 'ultra' | 'auto';
  onLoad?: () => void;
  onError?: (error: Error) => void;
  showPerformanceStats?: boolean;
  showControls?: boolean;
  showPerformanceMetrics?: boolean;
}

// Material color and property mapping
const METAL_COLORS = {
  gold: 0xFFD700,
  silver: 0xC0C0C0,
  platinum: 0xE5E4E2,
  rosegold: 0xB76E79,
  whitegold: 0xF5F5F5
};

const METAL_PROPERTIES = {
  gold: { metalness: 0.9, roughness: 0.1, reflectivity: 0.8 },
  silver: { metalness: 1.0, roughness: 0.15, reflectivity: 0.9 },
  platinum: { metalness: 0.85, roughness: 0.1, reflectivity: 0.7 },
  rosegold: { metalness: 0.8, roughness: 0.15, reflectivity: 0.7 },
  whitegold: { metalness: 0.85, roughness: 0.12, reflectivity: 0.8 }
};

const GEM_COLORS = {
  diamond: 0xEEFFFF,
  ruby: 0xE0115F,
  sapphire: 0x0F52BA,
  emerald: 0x50C878,
  amethyst: 0x9966CC,
  topaz: 0xFFC87C,
  pearl: 0xFDEEF4
};

const GEM_PROPERTIES = {
  diamond: { 
    metalness: 0.1, 
    roughness: 0.05, 
    transmission: 0.95, 
    ior: 2.4, 
    dispersion: 0.044,
    transparent: true,
    opacity: 0.9,
    clearcoat: 0.9,
    clearcoatRoughness: 0.1
  },
  ruby: { 
    metalness: 0.2, 
    roughness: 0.1, 
    transmission: 0.5, 
    ior: 1.77, 
    dispersion: 0.018,
    transparent: true,
    opacity: 0.8,
    clearcoat: 0.7,
    clearcoatRoughness: 0.2
  },
  sapphire: { 
    metalness: 0.2, 
    roughness: 0.1, 
    transmission: 0.6, 
    ior: 1.77, 
    dispersion: 0.018,
    transparent: true,
    opacity: 0.8,
    clearcoat: 0.7,
    clearcoatRoughness: 0.2
  },
  emerald: { 
    metalness: 0.2, 
    roughness: 0.2, 
    transmission: 0.5, 
    ior: 1.57, 
    dispersion: 0.014,
    transparent: true,
    opacity: 0.8,
    clearcoat: 0.5,
    clearcoatRoughness: 0.3
  },
  amethyst: { 
    metalness: 0.1, 
    roughness: 0.15, 
    transmission: 0.7, 
    ior: 1.54, 
    dispersion: 0.013,
    transparent: true,
    opacity: 0.8,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2
  },
  topaz: { 
    metalness: 0.1, 
    roughness: 0.1, 
    transmission: 0.7, 
    ior: 1.61, 
    dispersion: 0.014,
    transparent: true,
    opacity: 0.85,
    clearcoat: 0.6,
    clearcoatRoughness: 0.2
  },
  pearl: { 
    metalness: 0.2, 
    roughness: 0.8, 
    transmission: 0.0, 
    ior: 1.53, 
    dispersion: 0.0,
    transparent: false,
    opacity: 1.0,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1
  }
};

// Environment mapping for different lighting scenarios
const ENVIRONMENT_PRESETS = {
  jewelry_store: {
    ambientLight: { color: 0xffffff, intensity: 0.5 },
    directionalLight: { color: 0xffffff, intensity: 1.0, position: [5, 5, 5] },
    pointLights: [
      { color: 0xFFFFFF, intensity: 0.8, distance: 100, decay: 2, position: [5, 5, 5] },
      { color: 0xFFEEDD, intensity: 0.5, distance: 50, decay: 2, position: [-5, 3, 2] },
      { color: 0xDDEEFF, intensity: 0.3, distance: 50, decay: 2, position: [0, -5, -5] }
    ],
    backgroundIntensity: 0.7,
    backgroundBlur: 0.5,
    hdrPath: '/environments/jewelry_store.hdr'
  },
  outdoor: {
    ambientLight: { color: 0xffffff, intensity: 0.8 },
    directionalLight: { color: 0xffffff, intensity: 1.2, position: [10, 10, -5] },
    pointLights: [
      { color: 0xFFFFFF, intensity: 1.0, distance: 100, decay: 2, position: [10, 10, 10] },
      { color: 0xFFDDCC, intensity: 0.3, distance: 50, decay: 2, position: [-5, 5, -5] }
    ],
    backgroundIntensity: 1.0,
    backgroundBlur: 0.3,
    hdrPath: '/environments/outdoor.hdr'
  },
  studio: {
    ambientLight: { color: 0xffffff, intensity: 0.4 },
    directionalLight: { color: 0xffffff, intensity: 0.8, position: [0, 5, 5] },
    pointLights: [
      { color: 0xFFFFFF, intensity: 0.6, distance: 50, decay: 2, position: [5, 5, 5] },
      { color: 0xFFFFFF, intensity: 0.4, distance: 50, decay: 2, position: [-5, 3, 0] },
      { color: 0xFFFFFF, intensity: 0.4, distance: 50, decay: 2, position: [0, -5, 5] }
    ],
    backgroundIntensity: 0.5,
    backgroundBlur: 0.8,
    hdrPath: '/environments/studio.hdr'
  },
  evening: {
    ambientLight: { color: 0xfff0e8, intensity: 0.3 },
    directionalLight: { color: 0xffa577, intensity: 0.5, position: [3, 3, 3] },
    pointLights: [
      { color: 0xFFAA77, intensity: 0.5, distance: 50, decay: 2, position: [3, 3, 3] },
      { color: 0x7788FF, intensity: 0.3, distance: 50, decay: 2, position: [-3, 2, -1] }
    ],
    backgroundIntensity: 0.4,
    backgroundBlur: 0.7,
    hdrPath: '/environments/evening.hdr'
  }
};

export default function EnhancedJewelryViewer({
  modelPath,
  selectedMetal,
  selectedGem,
  environmentPreset,
  rotationSpeed = 0.5,
  enableBloom = true,
  enableShadows = true,
  enableZoom = true,
  enablePan = false,
  enableAR = false,
  backgroundColor = '#f8f8f8',
  height = 400,
  quality = 'auto',
  onLoad,
  onError,
  showPerformanceStats = false,
  showControls = true,
  showPerformanceMetrics = false
}: EnhancedJewelryViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameRef = useRef<number>(0);
  const modelRef = useRef<THREE.Group | null>(null);
  const effectComposerRef = useRef<EffectComposer | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [viewMode, setViewMode] = useState<'3d' | 'ar'>('3d');
  const [currentQuality, setCurrentQuality] = useState(quality);
  
  // Generate a unique identifier for this viewer instance
  const viewerId = useRef(`viewer-${Math.random().toString(36).substring(2, 9)}`);
  
  // Quality-based settings
  const qualitySettings = useMemo(() => {
    const settings = {
      pixelRatio: 1,
      meshDetail: 1,
      textureSize: 1024,
      shadowMapSize: 1024,
      anisotropy: 1,
      antialias: true,
      bloomResolution: 256,
      reflectionProbeRes: 256,
      envMapRes: 512,
      maxLights: 4
    };
    
    switch (quality) {
      case 'low':
        return {
          ...settings,
          pixelRatio: Math.min(1.0, window.devicePixelRatio),
          meshDetail: 0.5,
          textureSize: 512,
          shadowMapSize: 512,
          anisotropy: 1,
          antialias: false,
          bloomResolution: 128,
          reflectionProbeRes: 128,
          envMapRes: 256,
          maxLights: 2
        };
      case 'medium':
        return {
          ...settings,
          pixelRatio: Math.min(1.5, window.devicePixelRatio),
          meshDetail: 1.0,
          textureSize: 1024,
          shadowMapSize: 1024,
          anisotropy: 2,
          antialias: true,
          bloomResolution: 256,
          reflectionProbeRes: 256,
          envMapRes: 512,
          maxLights: 4
        };
      case 'high':
        return {
          ...settings,
          pixelRatio: Math.min(2.0, window.devicePixelRatio),
          meshDetail: 1.5,
          textureSize: 2048,
          shadowMapSize: 2048,
          anisotropy: 4,
          antialias: true,
          bloomResolution: 512,
          reflectionProbeRes: 512,
          envMapRes: 1024,
          maxLights: 8
        };
      case 'ultra':
        return {
          ...settings,
          pixelRatio: window.devicePixelRatio,
          meshDetail: 2.0,
          textureSize: 4096,
          shadowMapSize: 4096,
          anisotropy: 16,
          antialias: true,
          bloomResolution: 1024,
          reflectionProbeRes: 1024,
          envMapRes: 2048,
          maxLights: 16
        };
      default:
        return settings;
    }
  }, [quality]);
  
  useEffect(() => {
    // Progressive texture loading based on quality
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setPath('/textures/');
    
    // Skip the rest of the initialization to avoid complex errors
    if (!containerRef.current) return;
    
    // Initialize the renderer with quality settings
    const renderer = new THREE.WebGLRenderer({
      antialias: qualitySettings.antialias,
      alpha: true,
      powerPreference: quality === 'ultra' ? 'high-performance' : quality === 'low' ? 'low-power' : 'default'
    });
    
    renderer.setPixelRatio(qualitySettings.pixelRatio);
    renderer.setSize(containerRef.current.clientWidth, height);
    renderer.setClearColor(backgroundColor, 1);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    if (enableShadows) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      45, 
      containerRef.current.clientWidth / height, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Load Environment Map with quality settings
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    
    // Configure environment based on preset
    const preset = ENVIRONMENT_PRESETS[environmentPreset];
    
    // Set up ambient lighting
    const ambientLight = new THREE.AmbientLight(preset.ambientLight.color, preset.ambientLight.intensity);
    scene.add(ambientLight);
    
    // Add main directional light (simulates sun or main light source)
    const mainLight = new THREE.DirectionalLight(preset.directionalLight.color, preset.directionalLight.intensity);
    mainLight.position.set(
      preset.directionalLight.position[0], 
      preset.directionalLight.position[1], 
      preset.directionalLight.position[2]
    );
    
    if (enableShadows) {
      mainLight.castShadow = true;
      mainLight.shadow.mapSize.width = qualitySettings.shadowMapSize;
      mainLight.shadow.mapSize.height = qualitySettings.shadowMapSize;
      mainLight.shadow.camera.near = 0.5;
      mainLight.shadow.camera.far = 50;
      mainLight.shadow.bias = -0.0001;
    }
    
    scene.add(mainLight);
    
    // Add point lights based on quality settings
    const pointLightCount = Math.min(preset.pointLights.length, qualitySettings.maxLights);
    for (let i = 0; i < pointLightCount; i++) {
      const pointLightConfig = preset.pointLights[i];
      const pointLight = new THREE.PointLight(
        pointLightConfig.color,
        pointLightConfig.intensity,
        pointLightConfig.distance,
        pointLightConfig.decay
      );
      pointLight.position.set(
        pointLightConfig.position[0],
        pointLightConfig.position[1],
        pointLightConfig.position[2]
      );
      
      if (enableShadows && i < 2) { // Only enable shadows for the main lights
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = qualitySettings.shadowMapSize / 2; // Smaller shadow maps for point lights
        pointLight.shadow.mapSize.height = qualitySettings.shadowMapSize / 2;
        pointLight.shadow.bias = -0.0001;
      }
      
      scene.add(pointLight);
    }
    
    // Rest of the setup code...
    // This is a simplified version - the full implementation would include:
    // 1. Loading the model with GLTFLoader using qualitySettings.meshDetail
    // 2. Setting up the EffectComposer with bloom based on qualitySettings.bloomResolution
    // 3. Adding environment maps with qualitySettings.envMapRes
    // 4. Setting up OrbitControls with enableZoom and enablePan
    
    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enableZoom = enableZoom;
    controls.enablePan = enablePan;
    controls.autoRotate = rotationSpeed > 0;
    controls.autoRotateSpeed = rotationSpeed * 3;
    controlsRef.current = controls;
    
    // Set up model loading with progress tracking
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = Math.floor((itemsLoaded / itemsTotal) * 100);
      setLoadingProgress(progress);
    };
    
    loadingManager.onLoad = () => {
      setIsLoading(false);
      if (onLoad) onLoad();
    };
    
    loadingManager.onError = (url) => {
      console.error('Error loading model:', url);
      setIsLoading(false);
      setError(new Error(`Failed to load model: ${url}`));
      if (onError) {
        onError(new Error(`Failed to load model: ${url}`));
      }
    };
    
    // Load the model
    const loader = new GLTFLoader(loadingManager);
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        
        // Apply materials based on selection
        model.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            // Apply shadow properties
            if (enableShadows) {
              node.castShadow = true;
              node.receiveShadow = true;
            }
            
            // Apply metal material to metal parts
            if (node.name.includes('metal') || node.name.includes('band')) {
              const metalProps = METAL_PROPERTIES[selectedMetal];
              node.material = new THREE.MeshStandardMaterial({
                color: METAL_COLORS[selectedMetal],
                metalness: metalProps.metalness,
                roughness: metalProps.roughness,
                envMapIntensity: metalProps.reflectivity
              });
            }
            
            // Apply gem material to gem parts if a gem is selected
            if (selectedGem && (node.name.includes('gem') || node.name.includes('stone'))) {
              const gemProps = GEM_PROPERTIES[selectedGem];
              
              // Different materials based on quality settings
              if (quality === 'low' || quality === 'medium') {
                // Simpler material for low/medium quality
                node.material = new THREE.MeshStandardMaterial({
                  color: GEM_COLORS[selectedGem],
                  metalness: gemProps.metalness,
                  roughness: gemProps.roughness,
                  transparent: gemProps.transparent,
                  opacity: gemProps.opacity
                });
              } else {
                // More complex physically-based material for high/ultra quality
                node.material = new THREE.MeshPhysicalMaterial({
                  color: GEM_COLORS[selectedGem],
                  metalness: gemProps.metalness,
                  roughness: gemProps.roughness,
                  transparent: gemProps.transparent,
                  opacity: gemProps.opacity,
                  clearcoat: gemProps.clearcoat || 0,
                  clearcoatRoughness: gemProps.clearcoatRoughness || 0,
                  ior: gemProps.ior || 1.5,
                  transmission: gemProps.transmission || 0
                });
              }
            }
          }
        });
        
        // Position the model and add to scene
        model.position.set(0, 0, 0);
        scene.add(model);
        modelRef.current = model;
        
        // Center camera on model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Position camera based on object size
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.5;
        
        // Set camera position
        camera.position.set(center.x, center.y, center.z + cameraZ);
        camera.lookAt(center);
        camera.updateProjectionMatrix();
        
        // Update orbit controls target
        controls.target.copy(center);
        controls.update();
      },
      (xhr) => {
        // Loading progress
        if (xhr.lengthComputable) {
          const percentComplete = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadingProgress(percentComplete);
        }
      },
      (error) => {
        console.error('Error loading model:', error);
        setIsLoading(false);
        setError(new Error('Failed to load model'));
        if (onError) {
          onError(error instanceof Error ? error : new Error('Failed to load model'));
        }
      }
    );
    
    // Set up post-processing if needed (based on quality and enableBloom)
    if (enableBloom && quality !== 'low') {
      const composer = new EffectComposer(renderer);
      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);
      
      // Add bloom effect based on quality
      if (enableBloom) {
        const bloomPass = new UnrealBloomPass(
          new THREE.Vector2(
            containerRef.current.clientWidth * qualitySettings.pixelRatio,
            height * qualitySettings.pixelRatio
          ),
          0.5,  // strength
          0.5,  // radius
          0.85  // threshold
        );
        composer.addPass(bloomPass);
      }
      
      effectComposerRef.current = composer;
    }
    
    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;
      
      animationFrameRef.current = requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      // Update renderer statistics every 10 frames to avoid performance impact
      if (Math.random() < 0.1) {
        updateRendererStats();
      }
      
      // Use effect composer or regular renderer
      if (effectComposerRef.current && enableBloom && quality !== 'low') {
        effectComposerRef.current.render();
      } else {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
      
      if (effectComposerRef.current) {
        effectComposerRef.current.setSize(width, height);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
      
      // Dispose resources
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (effectComposerRef.current && effectComposerRef.current.passes) {
        try {
          effectComposerRef.current.passes.forEach(pass => {
            // Dispose of materials and geometries in passes
            if (pass && 'dispose' in pass) {
              (pass as any).dispose();
            }
          });
        } catch (e) {
          console.warn('Error disposing effect composer passes:', e);
        }
      }
      
      // Dispose scene resources
      if (sceneRef.current) {
        try {
          if (typeof sceneRef.current.traverse === 'function') {
            sceneRef.current.traverse((object) => {
              if (object instanceof THREE.Mesh) {
                if (object.geometry) object.geometry.dispose();
                
                if (object.material) {
                  if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                  } else {
                    object.material.dispose();
                  }
                }
              }
            });
          }
        } catch (e) {
          console.warn('Error disposing scene objects:', e);
        }
      }
    };
  }, [
    modelPath, 
    selectedMetal, 
    selectedGem, 
    environmentPreset, 
    rotationSpeed, 
    enableBloom, 
    enableShadows, 
    enableZoom, 
    enablePan, 
    backgroundColor, 
    height,
    quality,
    qualitySettings
  ]);
  
  // Add a function to update renderer statistics
  const updateRendererStats = useCallback(() => {
    if (!rendererRef.current) return;
    
    const renderer = rendererRef.current;
    const info = renderer.info;
    
    // Update global object that can be accessed by PerformanceMonitor
    window.reefqRendererInfo = {
      triangles: info.render.triangles,
      drawCalls: info.render.calls,
      textures: info.memory.textures,
      geometries: info.memory.geometries,
      materials: info.programs ? info.programs.length : 0
    };
  }, []);
  
  // Register for quality change notifications
  useEffect(() => {
    // When quality prop is 'auto', let the performance monitor handle it
    if (quality === 'auto') {
      performanceMonitor.setAdaptiveMode(true);
      
      // Set up a callback to update our local state when quality changes
      const unregister = performanceMonitor.onQualityChange((newQuality) => {
        if (newQuality !== 'auto') {
          setCurrentQuality(newQuality);
        }
      });
      
      return unregister;
    } else {
      // When quality is manually specified, disable adaptive mode and set quality
      performanceMonitor.setAdaptiveMode(false);
      performanceMonitor.setQuality(quality);
      setCurrentQuality(quality);
      return () => {};
    }
  }, [quality]);
  
  // Handle rotation controls
  const startRotation = () => {
    setIsRotating(true);
  };
  
  const stopRotation = () => {
    setIsRotating(false);
  };
  
  const resetRotation = () => {
    setCurrentAngle(0);
  };
  
  // Switch between 3D and AR modes
  const toggleViewMode = () => {
    setViewMode(prev => prev === '3d' ? 'ar' : '3d');
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div ref={containerRef} className="jewelry-viewer" style={{ height: `${height}px`, position: 'relative' }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-nile-teal border-t-transparent rounded-full animate-spin"></div>
          <div className="mt-4 text-sm text-gray-600">Loading model... {loadingProgress}%</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div ref={containerRef} className="jewelry-viewer" style={{ height: `${height}px`, position: 'relative' }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="mt-4 text-sm text-gray-600">Failed to load model</div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[500px] rounded-lg overflow-hidden"
    >
      {/* 3D Scene */}
      {viewMode === '3d' && (
        <Scene
          modelPath={modelPath}
          metalType={selectedMetal}
          gemType={selectedGem}
          showControls={showControls}
          quality={currentQuality}
          enableRayTracing={false}
          enableBloom={enableBloom}
          hdri={environmentPreset}
        />
      )}
      
      {/* AR Mode (placeholder for actual AR implementation) */}
      {viewMode === 'ar' && (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="text-white text-center">
            <p className="mb-4">AR Mode - Point your camera at a flat surface</p>
            <button 
              className="px-4 py-2 bg-indigo-600 rounded-md"
              onClick={toggleViewMode}
            >
              Exit AR Mode
            </button>
          </div>
        </div>
      )}
      
      {/* Control overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {viewMode === '3d' && (
          <>
            <button
              className="p-2 bg-white bg-opacity-20 backdrop-blur-md rounded-full hover:bg-opacity-30 transition"
              onClick={startRotation}
              disabled={isRotating}
              title="Start rotation"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
            </button>
            
            <button
              className="p-2 bg-white bg-opacity-20 backdrop-blur-md rounded-full hover:bg-opacity-30 transition"
              onClick={stopRotation}
              disabled={!isRotating}
              title="Stop rotation"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            
            <button
              className="p-2 bg-white bg-opacity-20 backdrop-blur-md rounded-full hover:bg-opacity-30 transition"
              onClick={resetRotation}
              title="Reset view"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </>
        )}
        
        {/* AR Toggle Button - only show if AR is enabled */}
        {enableAR && (
          <button
            className="p-2 bg-white bg-opacity-20 backdrop-blur-md rounded-full hover:bg-opacity-30 transition"
            onClick={toggleViewMode}
            title={viewMode === '3d' ? 'Switch to AR Mode' : 'Switch to 3D Mode'}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white">Loading 3D Model...</div>
        </div>
      )}
      
      {/* Performance metrics overlay */}
      <PerformanceHUD 
        visible={showPerformanceMetrics} 
        position="bottom-right"
        showControls={true}
      />
    </div>
  );
} 