'use client';

import React, { useEffect, useRef, useState } from 'react';
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

interface EnhancedJewelryViewerProps {
  modelPath: string;
  selectedMetal: 'gold' | 'silver' | 'platinum' | 'rosegold' | 'whitegold';
  selectedGem?: 'diamond' | 'ruby' | 'sapphire' | 'emerald' | 'amethyst' | 'topaz' | 'pearl';
  environmentPreset?: 'jewelry_store' | 'outdoor' | 'studio' | 'evening';
  enableBloom?: boolean;
  enableShadows?: boolean;
  rotationSpeed?: number;
  onLoadComplete?: () => void;
  enableZoom?: boolean;
  enableAR?: boolean;
  showMaterialEditor?: boolean;
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
    dispersion: 0.044 
  },
  ruby: { 
    metalness: 0.2, 
    roughness: 0.1, 
    transmission: 0.5, 
    ior: 1.77, 
    dispersion: 0.018 
  },
  sapphire: { 
    metalness: 0.2, 
    roughness: 0.1, 
    transmission: 0.6, 
    ior: 1.77, 
    dispersion: 0.018 
  },
  emerald: { 
    metalness: 0.2, 
    roughness: 0.2, 
    transmission: 0.5, 
    ior: 1.57, 
    dispersion: 0.014 
  },
  amethyst: { 
    metalness: 0.1, 
    roughness: 0.15, 
    transmission: 0.7, 
    ior: 1.54, 
    dispersion: 0.013 
  },
  topaz: { 
    metalness: 0.1, 
    roughness: 0.1, 
    transmission: 0.7, 
    ior: 1.61, 
    dispersion: 0.014 
  },
  pearl: { 
    metalness: 0.2, 
    roughness: 0.8, 
    transmission: 0.0, 
    ior: 1.53, 
    dispersion: 0.0 
  }
};

// Environment mapping for different lighting scenarios
const ENVIRONMENT_PRESETS = {
  jewelry_store: {
    ambientIntensity: 0.5,
    directionalIntensity: 1.0,
    pointLightPositions: [
      [5, 5, 5, 0.8, 0xFFFFFF],
      [-5, 3, 2, 0.5, 0xFFEEDD],
      [0, -5, -5, 0.3, 0xDDEEFF]
    ],
    backgroundIntensity: 0.7,
    backgroundBlur: 0.5,
    hdrPath: '/environments/jewelry_store.hdr'
  },
  outdoor: {
    ambientIntensity: 0.8,
    directionalIntensity: 1.2,
    pointLightPositions: [
      [10, 10, 10, 1.0, 0xFFFFFF],
      [-5, 5, -5, 0.3, 0xFFDDCC]
    ],
    backgroundIntensity: 1.0,
    backgroundBlur: 0.3,
    hdrPath: '/environments/outdoor.hdr'
  },
  studio: {
    ambientIntensity: 0.4,
    directionalIntensity: 0.8,
    pointLightPositions: [
      [5, 5, 5, 0.6, 0xFFFFFF],
      [-5, 3, 0, 0.4, 0xFFFFFF],
      [0, -5, 5, 0.4, 0xFFFFFF]
    ],
    backgroundIntensity: 0.5,
    backgroundBlur: 0.8,
    hdrPath: '/environments/studio.hdr'
  },
  evening: {
    ambientIntensity: 0.3,
    directionalIntensity: 0.5,
    pointLightPositions: [
      [3, 3, 3, 0.5, 0xFFAA77],
      [-3, 2, -1, 0.3, 0x7788FF]
    ],
    backgroundIntensity: 0.4,
    backgroundBlur: 0.7,
    hdrPath: '/environments/evening.hdr'
  }
};

export default function EnhancedJewelryViewer({
  modelPath,
  selectedMetal = 'gold',
  selectedGem = 'diamond',
  environmentPreset = 'studio',
  enableBloom = true,
  enableShadows = true,
  rotationSpeed = 0.5,
  onLoadComplete,
  enableZoom = true,
  enableAR = false,
  showMaterialEditor = false,
}: EnhancedJewelryViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const bloomPassRef = useRef<UnrealBloomPass | null>(null);
  const envMapRef = useRef<THREE.Texture | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [isARSupported, setIsARSupported] = useState(false);
  const [isARMode, setIsARMode] = useState(false);
  const [materialEditorValues, setMaterialEditorValues] = useState({
    metalRoughness: METAL_PROPERTIES[selectedMetal].roughness,
    metalness: METAL_PROPERTIES[selectedMetal].metalness,
    gemRoughness: selectedGem ? GEM_PROPERTIES[selectedGem].roughness : 0.01,
    gemIOR: selectedGem ? GEM_PROPERTIES[selectedGem].ior : 2.42,
  });
  
  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      40, // Lower FOV for more realistic perspective
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Create renderer with high quality settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true, // Transparent background
      powerPreference: 'high-performance',
      precision: 'highp'
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = enableShadows;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.useLegacyLights = false;
    
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add OrbitControls with enhanced settings
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.15;
    controls.enableZoom = enableZoom;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controlsRef.current = controls;
    
    // Set up lighting based on environment preset
    const preset = ENVIRONMENT_PRESETS[environmentPreset];
    
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, preset.ambientIntensity);
    scene.add(ambientLight);
    
    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, preset.directionalIntensity);
    directionalLight.position.set(5, 5, 5);
    if (enableShadows) {
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 50;
      directionalLight.shadow.normalBias = 0.05;
    }
    scene.add(directionalLight);
    
    // Add point lights based on preset
    preset.pointLightPositions.forEach(([x, y, z, intensity, color]) => {
      const pointLight = new THREE.PointLight(color as number, intensity as number);
      pointLight.position.set(x as number, y as number, z as number);
      if (enableShadows) {
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = 512;
        pointLight.shadow.mapSize.height = 512;
      }
      scene.add(pointLight);
    });
    
    // Setup post-processing effects
    const composer = new EffectComposer(renderer);
    composerRef.current = composer;
    
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    // Add bloom effect for highlights on gems and metals
    if (enableBloom) {
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(
          containerRef.current.clientWidth, 
          containerRef.current.clientHeight
        ),
        0.3, // Bloom strength
        0.5, // Bloom radius
        0.7  // Bloom threshold
      );
      bloomPassRef.current = bloomPass;
      composer.addPass(bloomPass);
    }
    
    // Add FXAA anti-aliasing
    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.material.uniforms['resolution'].value.set(
      1 / containerRef.current.clientWidth, 
      1 / containerRef.current.clientHeight
    );
    composer.addPass(fxaaPass);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (composerRef.current && sceneRef.current && cameraRef.current) {
        composerRef.current.render();
      }
    };
    
    animate();
    
    // Load 3D model on initialization
    loadModel();
    
    // Clean up
    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (composerRef.current) {
        composerRef.current.dispose();
      }
      
      if (envMapRef.current) {
        envMapRef.current.dispose();
      }
      
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [modelPath, environmentPreset, enableBloom, enableShadows, enableZoom, isRotating, rotationSpeed]);
  
  // Handle model loading
  const loadModel = async () => {
    if (!sceneRef.current) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Remove previous model if it exists
      if (modelRef.current) {
        sceneRef.current.remove(modelRef.current);
        modelRef.current = null;
      }
      
      // Load GLTF model
      const loader = new GLTFLoader();
      
      // We're using a dummy model path for now, since the actual models don't exist yet
      const path = modelPath || '/models/diamond_solitaire_ring.glb';
      
      loader.load(
        path,
        (gltf) => {
          const model = gltf.scene;
          
          // Process the model and enhance materials
          model.traverse((node) => {
            if (node instanceof THREE.Mesh) {
              // Get metal and gem properties
              const metalProps = METAL_PROPERTIES[selectedMetal];
              const gemProps = selectedGem ? GEM_PROPERTIES[selectedGem] : null;
              
              // Set materials based on node name or original material properties
              if (node.name.includes('metal') || 
                  node.name.includes('band') || 
                  node.name.includes('setting')) {
                // Create enhanced metal material
                const metalMaterial = new THREE.MeshPhysicalMaterial({
                  color: METAL_COLORS[selectedMetal],
                  metalness: metalProps.metalness,
                  roughness: metalProps.roughness,
                  reflectivity: metalProps.reflectivity,
                  envMapIntensity: 1.0,
                  clearcoat: 0.1,
                  clearcoatRoughness: 0.2
                });
                
                node.material = metalMaterial;
              } else if (
                selectedGem && 
                (node.name.includes('gem') || 
                 node.name.includes('diamond') || 
                 node.name.includes('stone') ||
                 node.name.includes(selectedGem))
              ) {
                // Create enhanced gemstone material
                const gemMaterial = new THREE.MeshPhysicalMaterial({
                  color: GEM_COLORS[selectedGem],
                  metalness: gemProps?.metalness || 0.1,
                  roughness: gemProps?.roughness || 0.1,
                  transmission: gemProps?.transmission || 0.9,
                  transparent: true,
                  ior: gemProps?.ior || 2.4,
                  reflectivity: 0.8,
                  envMapIntensity: 1.5,
                  clearcoat: 1.0,
                  clearcoatRoughness: 0.1
                });
                
                // Special case for pearl, which should have subsurface scattering
                if (selectedGem === 'pearl') {
                  gemMaterial.transmission = 0;
                  gemMaterial.metalness = 0.2;
                  gemMaterial.roughness = 0.8;
                  gemMaterial.clearcoat = 0.5;
                }
                
                node.material = gemMaterial;
              }
              
              // Enable shadows
              if (enableShadows) {
                node.castShadow = true;
                node.receiveShadow = true;
              }
            }
          });
          
          // Center and scale the model appropriately
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          // Calculate scale to fit model in view
          const maxDimension = Math.max(size.x, size.y, size.z);
          const scale = 2.5 / maxDimension;
          
          model.position.sub(center); // Center the model
          model.scale.multiplyScalar(scale); // Scale to fit view
          model.rotation.set(-Math.PI / 6, Math.PI / 6, 0); // Slight tilt for better view
          
          // Add to scene
          sceneRef.current?.add(model);
          modelRef.current = model;
          
          setIsLoading(false);
          if (onLoadComplete) onLoadComplete();
        },
        (progress) => {
          // Handle loading progress
          if (progress.total > 0) {
            setLoadingProgress(Math.floor((progress.loaded / progress.total) * 100));
          }
        },
        (error) => {
          console.error('Error loading model:', error);
          setError('Failed to load 3D model. Please try again later.');
          setIsLoading(false);
          
          // Load a fallback model for testing when model fails
          createFallbackModel();
        }
      );
    } catch (err) {
      console.error('Error in model loading process:', err);
      setError('An unexpected error occurred. Please try again later.');
      setIsLoading(false);
      
      // Load a fallback model for testing
      createFallbackModel();
    }
  };
  
  // Create a fallback model for testing when 3D models aren't available
  const createFallbackModel = () => {
    if (!sceneRef.current) return;
    
    // Get metal and gem properties
    const metalProps = METAL_PROPERTIES[selectedMetal];
    const gemProps = selectedGem ? GEM_PROPERTIES[selectedGem] : null;
    
    // Create a simple ring-like geometry
    const ringGroup = new THREE.Group();
    
    // Base band
    const bandGeometry = new THREE.TorusGeometry(1, 0.25, 32, 64);
    const bandMaterial = new THREE.MeshPhysicalMaterial({
      color: METAL_COLORS[selectedMetal],
      metalness: metalProps.metalness,
      roughness: metalProps.roughness,
      reflectivity: metalProps.reflectivity,
      envMapIntensity: 1.0,
      clearcoat: 0.1,
      clearcoatRoughness: 0.2
    });
    
    const band = new THREE.Mesh(bandGeometry, bandMaterial);
    band.rotation.x = Math.PI / 2;
    band.castShadow = enableShadows;
    band.receiveShadow = enableShadows;
    ringGroup.add(band);
    
    // Add gemstone
    if (selectedGem) {
      let gemGeometry;
      
      // Different gem shapes based on type
      switch (selectedGem) {
        case 'diamond':
          gemGeometry = new THREE.OctahedronGeometry(0.5, 2);
          break;
        case 'emerald':
          gemGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.4);
          break;
        case 'ruby':
        case 'sapphire':
          gemGeometry = new THREE.SphereGeometry(0.4, 32, 32);
          break;
        case 'pearl':
          gemGeometry = new THREE.SphereGeometry(0.45, 32, 32);
          break;
        default:
          gemGeometry = new THREE.DodecahedronGeometry(0.4, 2);
      }
      
      const gemMaterial = new THREE.MeshPhysicalMaterial({
        color: GEM_COLORS[selectedGem],
        metalness: gemProps?.metalness || 0.1,
        roughness: gemProps?.roughness || 0.1,
        transmission: gemProps?.transmission || 0.9,
        transparent: true,
        ior: gemProps?.ior || 2.4,
        reflectivity: 0.8,
        envMapIntensity: 1.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
      });
      
      // Special case for pearl, which should have subsurface scattering
      if (selectedGem === 'pearl') {
        gemMaterial.transmission = 0;
        gemMaterial.metalness = 0.2;
        gemMaterial.roughness = 0.8;
        gemMaterial.clearcoat = 0.5;
      }
      
      const gem = new THREE.Mesh(gemGeometry, gemMaterial);
      gem.position.y = 0.5;
      gem.castShadow = enableShadows;
      gem.receiveShadow = enableShadows;
      ringGroup.add(gem);
      
      // Add prongs for gem setting (except for pearl)
      if (selectedGem !== 'pearl') {
        const prongGeometry = new THREE.CylinderGeometry(0.05, 0.03, 0.3, 8);
        const prongMaterial = new THREE.MeshPhysicalMaterial({
          color: METAL_COLORS[selectedMetal],
          metalness: metalProps.metalness,
          roughness: metalProps.roughness,
          reflectivity: metalProps.reflectivity
        });
        
        const prongPositions = [
          [0.2, 0.35, 0.2],
          [-0.2, 0.35, 0.2],
          [0.2, 0.35, -0.2],
          [-0.2, 0.35, -0.2]
        ];
        
        prongPositions.forEach(([x, y, z]) => {
          const prong = new THREE.Mesh(prongGeometry, prongMaterial);
          prong.position.set(x as number, y as number, z as number);
          prong.castShadow = enableShadows;
          prong.receiveShadow = enableShadows;
          ringGroup.add(prong);
        });
      }
    }
    
    // Add the ring to the scene
    sceneRef.current.add(ringGroup);
    modelRef.current = ringGroup;
    
    // Notify loading complete
    setIsLoading(false);
    if (onLoadComplete) onLoadComplete();
  };
  
  // Update materials when metal or gem selection changes
  useEffect(() => {
    if (!modelRef.current) return;
    
    // Get metal and gem properties
    const metalProps = METAL_PROPERTIES[selectedMetal];
    const gemProps = selectedGem ? GEM_PROPERTIES[selectedGem] : null;
    
    modelRef.current.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        if (node.name.includes('metal') || 
            node.name.includes('band') || 
            node.name.includes('setting') ||
            (node.material as THREE.MeshPhysicalMaterial).metalness > 0.5) {
          // Update metal material
          node.material = new THREE.MeshPhysicalMaterial({
            color: METAL_COLORS[selectedMetal],
            metalness: metalProps.metalness,
            roughness: metalProps.roughness,
            reflectivity: metalProps.reflectivity,
            envMapIntensity: 1.0,
            clearcoat: 0.1,
            clearcoatRoughness: 0.2
          });
        } else if (
          selectedGem && 
          (node.name.includes('gem') || 
           node.name.includes('diamond') || 
           node.name.includes('stone') ||
           node.name.includes(selectedGem) ||
           (node.material as THREE.MeshPhysicalMaterial).transmission > 0.3)
        ) {
          // Update gem material
          const gemMaterial = new THREE.MeshPhysicalMaterial({
            color: GEM_COLORS[selectedGem],
            metalness: gemProps?.metalness || 0.1,
            roughness: gemProps?.roughness || 0.1,
            transmission: gemProps?.transmission || 0.9,
            transparent: true,
            ior: gemProps?.ior || 2.4,
            reflectivity: 0.8,
            envMapIntensity: 1.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
          });
          
          // Special case for pearl, which should have subsurface scattering
          if (selectedGem === 'pearl') {
            gemMaterial.transmission = 0;
            gemMaterial.metalness = 0.2;
            gemMaterial.roughness = 0.8;
            gemMaterial.clearcoat = 0.5;
          }
          
          node.material = gemMaterial;
        }
      }
    });
  }, [selectedMetal, selectedGem]);
  
  // Toggle rotation when isRotating changes
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isRotating;
    }
  }, [isRotating]);
  
  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      // Update camera
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      // Update renderer
      rendererRef.current.setSize(width, height);
      
      // Update composer
      if (composerRef.current) {
        composerRef.current.setSize(width, height);
      }
      
      // Update FXAA pass if it exists
      if (composerRef.current?.passes[composerRef.current.passes.length - 1] instanceof ShaderPass) {
        const fxaaPass = composerRef.current.passes[composerRef.current.passes.length - 1] as ShaderPass;
        if (fxaaPass.material.uniforms['resolution']) {
          fxaaPass.material.uniforms['resolution'].value.set(1 / width, 1 / height);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Check if AR is supported
  useEffect(() => {
    const checkARSupport = () => {
      if ('xr' in navigator) {
        // @ts-ignore - TypeScript doesn't know about navigator.xr
        navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
          setIsARSupported(supported);
        });
      }
    };
    
    checkARSupport();
  }, []);
  
  // Handle AR mode toggling
  const handleARMode = async () => {
    if (!isARSupported) return;
    
    try {
      // @ts-ignore - TypeScript doesn't know about AR specific methods
      if (rendererRef.current?.xr) {
        setIsARMode(!isARMode);
        // @ts-ignore
        if (!isARMode && rendererRef.current.xr) {
          // @ts-ignore
          const session = await navigator.xr.requestSession('immersive-ar', {
            requiredFeatures: ['hit-test'],
            optionalFeatures: ['dom-overlay'],
          });
          // @ts-ignore
          rendererRef.current.xr.setSession(session);
        }
      }
    } catch (error) {
      console.error('Error starting AR session:', error);
    }
  };
  
  // Take screenshot function
  const takeScreenshot = () => {
    if (!rendererRef.current) return;
    
    // Temporarily disable auto-rotation
    const wasRotating = isRotating;
    setIsRotating(false);
    
    // Render one frame without rotation
    if (composerRef.current) {
      composerRef.current.render();
    } else {
      rendererRef.current.render(sceneRef.current!, cameraRef.current!);
    }
    
    // Get the canvas data
    const dataURL = rendererRef.current.domElement.toDataURL('image/png');
    
    // Create download link
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'custom-jewelry.png';
    link.click();
    
    // Restore rotation state
    setIsRotating(wasRotating);
  };
  
  // Toggle rotation
  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };
  
  return (
    <div className="relative h-full w-full">
      {/* 3D Viewer Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg overflow-hidden"
      ></div>
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="p-6 rounded-lg bg-white shadow-xl flex flex-col items-center">
            <div className="w-16 h-16 relative mb-4">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-nile-teal border-opacity-25 rounded-full"></div>
              <div 
                className="absolute top-0 left-0 w-full h-full border-4 border-nile-teal rounded-full" 
                style={{ 
                  clipPath: `polygon(0 0, 100% 0, 100% 100%, 0% 100%)`,
                  transform: `rotate(${loadingProgress * 3.6}deg)` 
                }}
              ></div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <span className="text-nile-teal text-lg font-semibold">{loadingProgress}%</span>
              </div>
            </div>
            <p className="text-gray-800 font-medium">Loading 3D model...</p>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="p-6 rounded-lg bg-white shadow-xl max-w-md">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Error Loading Model</h3>
            </div>
            <p className="text-gray-800 mb-4">{error}</p>
            <div className="flex justify-end">
              <button 
                onClick={() => loadModel()}
                className="px-4 py-2 bg-nile-teal text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <button
          onClick={toggleRotation}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          title={isRotating ? "Pause Rotation" : "Resume Rotation"}
        >
          {isRotating ? (
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>
        <button
          onClick={() => {
            if (controlsRef.current) {
              controlsRef.current.reset();
            }
          }}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          title="Reset View"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        {enableBloom && bloomPassRef.current && (
          <button
            onClick={() => {
              if (bloomPassRef.current) {
                bloomPassRef.current.strength = bloomPassRef.current.strength > 0 ? 0 : 0.3;
              }
            }}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            title="Toggle Sparkle Effect"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </button>
        )}
        {enableAR && isARSupported && (
          <button
            onClick={handleARMode}
            className={`${
              isARMode 
                ? 'bg-nile-teal text-white' 
                : 'bg-white bg-opacity-75 hover:bg-opacity-100'
            } p-2 rounded-full shadow-md transition-colors`}
            title="View in AR"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      {showMaterialEditor && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Material Editor</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1">Metal Roughness: {materialEditorValues.metalRoughness.toFixed(2)}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={materialEditorValues.metalRoughness}
                onChange={(e) => setMaterialEditorValues({
                  ...materialEditorValues,
                  metalRoughness: parseFloat(e.target.value)
                })}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-xs mb-1">Metal Shininess: {materialEditorValues.metalness.toFixed(2)}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={materialEditorValues.metalness}
                onChange={(e) => setMaterialEditorValues({
                  ...materialEditorValues,
                  metalness: parseFloat(e.target.value)
                })}
                className="w-full"
              />
            </div>
            
            {selectedGem && (
              <>
                <div>
                  <label className="block text-xs mb-1">Gem Roughness: {materialEditorValues.gemRoughness.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0"
                    max="0.2"
                    step="0.01"
                    value={materialEditorValues.gemRoughness}
                    onChange={(e) => setMaterialEditorValues({
                      ...materialEditorValues,
                      gemRoughness: parseFloat(e.target.value)
                    })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-xs mb-1">Gem Refraction: {materialEditorValues.gemIOR.toFixed(2)}</label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.01"
                    value={materialEditorValues.gemIOR}
                    onChange={(e) => setMaterialEditorValues({
                      ...materialEditorValues,
                      gemIOR: parseFloat(e.target.value)
                    })}
                    className="w-full"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 