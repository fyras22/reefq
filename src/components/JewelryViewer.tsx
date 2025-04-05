'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface JewelryViewerProps {
  modelPath: string;
  selectedMetal: 'gold' | 'silver' | 'platinum' | 'rosegold' | 'whitegold';
  selectedGem?: 'diamond' | 'ruby' | 'sapphire' | 'emerald';
}

// Material color mapping
const METAL_COLORS = {
  gold: 0xFFD700,
  silver: 0xC0C0C0,
  platinum: 0xE5E4E2,
  rosegold: 0xB76E79,
  whitegold: 0xF5F5F5
};

const GEM_COLORS = {
  diamond: 0xCCFFFF,
  ruby: 0xE0115F,
  sapphire: 0x0F52BA,
  emerald: 0x50C878
};

export function JewelryViewer({
  modelPath,
  selectedMetal = 'gold',
  selectedGem = 'diamond'
}: JewelryViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true // Transparent background
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    controlsRef.current = controls;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
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
      
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [modelPath]);
  
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
      
      const loader = new GLTFLoader();
      
      // We're using a dummy model path for now, since the actual models don't exist yet
      const path = modelPath || '/models/diamond_engagement_ring.glb';
      
      loader.load(
        path,
        (gltf) => {
          const model = gltf.scene;
          
          // Process the model
          model.traverse((node) => {
            if (node instanceof THREE.Mesh) {
              // Set materials based on selections
              if (node.name.includes('metal') || node.name.includes('band')) {
                node.material = new THREE.MeshStandardMaterial({
                  color: METAL_COLORS[selectedMetal],
                  metalness: 0.9,
                  roughness: 0.1,
                });
              } else if (
                selectedGem && 
                (node.name.includes('gem') || 
                 node.name.includes('diamond') || 
                 node.name.includes('stone'))
              ) {
                node.material = new THREE.MeshPhysicalMaterial({
                  color: GEM_COLORS[selectedGem],
                  metalness: 0.2,
                  roughness: 0.1,
                  clearcoat: 1.0,
                  clearcoatRoughness: 0.1,
                  transmission: 0.9,
                  ior: 2.4,
                  reflectivity: 0.5,
                });
              }
              
              // Enable shadows
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });
          
          // Position and scale the model
          model.position.set(0, 0, 0);
          model.scale.set(1, 1, 1);
          
          // Add to scene
          sceneRef.current?.add(model);
          modelRef.current = model;
          
          setIsLoading(false);
        },
        (progress) => {
          // Handle loading progress if needed
        },
        (error) => {
          console.error('Error loading model:', error);
          setError('Failed to load 3D model. Please try again later.');
          setIsLoading(false);
          
          // Load a fallback cube for testing when model fails
          createFallbackModel();
        }
      );
    } catch (err) {
      console.error('Error in model loading process:', err);
      setError('An unexpected error occurred. Please try again later.');
      setIsLoading(false);
      
      // Load a fallback cube for testing
      createFallbackModel();
    }
  };
  
  // Create a fallback model for testing when 3D models aren't available
  const createFallbackModel = () => {
    if (!sceneRef.current) return;
    
    // Create a simple ring-like geometry
    const outerRadius = 1;
    const innerRadius = 0.8;
    const height = 0.3;
    const segments = 32;
    
    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, segments);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: METAL_COLORS[selectedMetal],
      metalness: 0.9,
      roughness: 0.1,
      side: THREE.DoubleSide
    });
    
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    
    // Add a gemstone
    const gemGeometry = new THREE.DodecahedronGeometry(0.3, 2);
    const gemMaterial = new THREE.MeshPhysicalMaterial({
      color: GEM_COLORS[selectedGem || 'diamond'],
      metalness: 0.2,
      roughness: 0.1,
      clearcoat: 1.0,
      transmission: 0.8,
      ior: 2.4,
    });
    
    const gem = new THREE.Mesh(gemGeometry, gemMaterial);
    gem.position.y = 0.2;
    
    // Create a group
    const model = new THREE.Group();
    model.add(ring);
    model.add(gem);
    model.rotation.x = Math.PI / 2;
    
    // Add to scene
    sceneRef.current.add(model);
    modelRef.current = model;
  };
  
  // Update materials when metal or gem selection changes
  useEffect(() => {
    if (!modelRef.current) return;
    
    modelRef.current.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        if (node.name.includes('metal') || node.name.includes('band')) {
          // Update metal material
          node.material = new THREE.MeshStandardMaterial({
            color: METAL_COLORS[selectedMetal],
            metalness: 0.9,
            roughness: 0.1,
          });
        } else if (
          selectedGem && 
          (node.name.includes('gem') || node.name.includes('diamond') || node.name.includes('stone'))
        ) {
          // Update gem material
          node.material = new THREE.MeshPhysicalMaterial({
            color: GEM_COLORS[selectedGem],
            metalness: 0.2,
            roughness: 0.1,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            transmission: 0.9,
            ior: 2.4,
            reflectivity: 0.5,
          });
        }
      }
    });
  }, [selectedMetal, selectedGem]);
  
  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      rendererRef.current.setSize(width, height);
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="relative h-full w-full">
      {/* 3D Viewer Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full bg-gray-50 rounded-lg overflow-hidden"
      ></div>
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="p-4 rounded-lg bg-white shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-nile-teal mb-2"></div>
            <p className="text-gray-800">Loading 3D model...</p>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="p-4 rounded-lg bg-white shadow-lg max-w-md">
            <p className="text-red-600 font-medium mb-2">Error</p>
            <p className="text-gray-800 mb-3">{error}</p>
            <button 
              onClick={() => loadModel()}
              className="px-4 py-2 bg-nile-teal text-white rounded-md hover:bg-opacity-90"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {/* Controls */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={() => {
            if (controlsRef.current) {
              controlsRef.current.reset();
            }
          }}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
          title="Reset View"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            className="w-6 h-6 text-gray-700"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
} 