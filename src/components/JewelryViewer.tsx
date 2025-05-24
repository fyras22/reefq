"use client";

import {
  Html,
  OrbitControls,
  PerspectiveCamera,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CustomEnvironment } from "./CustomEnvironment";
import { FallbackImage } from "./ui";

interface JewelryViewerProps {
  metalType?: "gold" | "silver" | "platinum" | "rose-gold" | "white-gold";
  gemType?: "diamond" | "ruby" | "sapphire" | "emerald" | "amethyst" | "custom";
  size?: number;
  setting?: string;
  engraving?: string;
  gemArrangement?: string;
  finish?: string;
  customGemColor?: string;
}

function JewelryModel({
  metalType = "gold",
  gemType = "emerald",
  size = 1,
  setting = "prong",
  engraving = "",
  gemArrangement = "solitaire",
  finish = "polished",
  customGemColor = "#2A5B5E",
}: JewelryViewerProps) {
  const { scene } = useGLTF("/models/diamond_engagement_ring.glb");
  const groupRef = useRef<THREE.Group>(null);

  // Get color based on metal type
  function getMetalColor(type: string = "gold") {
    switch (type) {
      case "gold":
        return "#C4A265"; // Pharaonic Gold
      case "silver":
        return "#E0E0E0";
      case "platinum":
        return "#E5E4E2";
      case "rose-gold":
        return "#B76E79";
      case "white-gold":
        return "#F5F5F5";
      default:
        return "#C4A265";
    }
  }

  // Get metalness and roughness values based on metal type
  function getMetalProps(type: string = "gold") {
    switch (type) {
      case "gold":
        return { metalness: 0.9, roughness: 0.1 };
      case "silver":
        return { metalness: 0.95, roughness: 0.05 };
      case "platinum":
        return { metalness: 0.85, roughness: 0.15 };
      case "rose-gold":
        return { metalness: 0.9, roughness: 0.1 };
      case "white-gold":
        return { metalness: 0.92, roughness: 0.08 };
      default:
        return { metalness: 0.9, roughness: 0.1 };
    }
  }

  // Get color based on gem type
  function getGemColor(type: string = "emerald") {
    if (type === "custom" && customGemColor) {
      return customGemColor;
    }

    switch (type) {
      case "diamond":
        return "#FFFFFF";
      case "ruby":
        return "#E0115F";
      case "sapphire":
        return "#0F52BA";
      case "emerald":
        return "#2A5B5E"; // Nile Teal
      case "amethyst":
        return "#9966CC";
      default:
        return "#2A5B5E";
    }
  }

  // Get gem properties based on gem type
  function getGemProps(type: string = "emerald") {
    switch (type) {
      case "diamond":
        return {
          metalness: 0.2,
          roughness: 0.0,
          opacity: 0.95,
          envMapIntensity: 4.0,
          clearcoat: 1.0,
          clearcoatRoughness: 0.0,
          transmission: 0.95,
          ior: 2.42,
        };
      case "ruby":
        return {
          metalness: 0.2,
          roughness: 0.1,
          opacity: 0.95,
          envMapIntensity: 2.5,
          clearcoat: 0.8,
          clearcoatRoughness: 0.1,
        };
      case "sapphire":
        return {
          metalness: 0.3,
          roughness: 0.1,
          opacity: 0.95,
          envMapIntensity: 2.5,
          clearcoat: 0.8,
          clearcoatRoughness: 0.1,
        };
      case "emerald":
        return {
          metalness: 0.2,
          roughness: 0.2,
          opacity: 0.9,
          envMapIntensity: 2.0,
          clearcoat: 0.7,
          clearcoatRoughness: 0.2,
        };
      case "amethyst":
        return {
          metalness: 0.2,
          roughness: 0.1,
          opacity: 0.92,
          envMapIntensity: 2.2,
          clearcoat: 0.8,
          clearcoatRoughness: 0.15,
        };
      default:
        return {
          metalness: 0.2,
          roughness: 0.1,
          opacity: 0.9,
          envMapIntensity: 2.0,
          clearcoat: 0.8,
          clearcoatRoughness: 0.1,
        };
    }
  }

  // Get roughness based on finish type
  function getFinishRoughness(finishType: string = "polished") {
    switch (finishType) {
      case "polished":
        return 0.1;
      case "matte":
        return 0.5;
      case "hammered":
        return 0.7;
      case "satin":
        return 0.3;
      default:
        return 0.1;
    }
  }

  // Apply zoom level
  useEffect(() => {
    if (groupRef.current) {
      // Apply the size as a scale factor
      const baseScale = 2.5; // Base scale of the model
      groupRef.current.scale.set(
        baseScale * size,
        baseScale * size,
        baseScale * size
      );

      // Position it higher in the viewport for better visibility
      groupRef.current.position.set(0, 0.5, 0);
    }
  }, [size]);

  useEffect(() => {
    // Update materials with the appropriate colors and finishes
    scene.traverse((child: any) => {
      if (child.isMesh) {
        if (child.material.name === "Metal") {
          const metalProps = getMetalProps(metalType);
          const finishRoughness = getFinishRoughness(finish);

          child.material = new THREE.MeshStandardMaterial({
            ...child.material,
            color: getMetalColor(metalType),
            metalness: metalProps.metalness,
            roughness: Math.max(metalProps.roughness, finishRoughness), // Use higher roughness value
            envMapIntensity: 1.5,
            needsUpdate: true,
          });

          // Apply special effects for hammered finish
          if (finish === "hammered") {
            // Create a displacement map for hammered effect
            const displacementMap = new THREE.TextureLoader().load(
              "/textures/hammered-displacement.jpg",
              (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(4, 4);
                child.material.displacementMap = texture;
                child.material.displacementScale = 0.05;
                child.material.needsUpdate = true;
              }
            );
          }

          // Remove shadow properties for better performance
          child.castShadow = false;
          child.receiveShadow = false;
        } else if (child.material.name === "Crystal") {
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
            needsUpdate: true,
          });

          // Set up different arrangement of gemstones
          if (gemArrangement === "solitaire") {
            // Default - single stone
          } else if (gemArrangement === "three-stone") {
            // Create side stones for three-stone arrangement
            if (!child.parent.userData.hasSideStones) {
              // Clone the main stone for side stones
              const leftStone = child.clone();
              const rightStone = child.clone();

              // Position and scale side stones
              leftStone.scale.set(0.6, 0.6, 0.6);
              rightStone.scale.set(0.6, 0.6, 0.6);

              leftStone.position.set(-0.5, 0, 0);
              rightStone.position.set(0.5, 0, 0);

              child.parent.add(leftStone);
              child.parent.add(rightStone);

              // Mark that we've added side stones to avoid duplication
              child.parent.userData.hasSideStones = true;
            }
          } else if (gemArrangement === "halo") {
            // Create a halo of smaller stones
            if (!child.parent.userData.hasHalo) {
              const haloStoneCount = 8;
              const radius = 0.3;

              for (let i = 0; i < haloStoneCount; i++) {
                const angle = (i / haloStoneCount) * Math.PI * 2;
                const haloStone = child.clone();

                haloStone.scale.set(0.3, 0.3, 0.3);
                haloStone.position.set(
                  Math.cos(angle) * radius,
                  0.05,
                  Math.sin(angle) * radius
                );

                child.parent.add(haloStone);
              }

              child.parent.userData.hasHalo = true;
            }
          }

          // Remove shadow properties for better performance
          child.castShadow = false;
          child.receiveShadow = false;
        }
      }
    });
  }, [
    metalType,
    gemType,
    scene,
    setting,
    gemArrangement,
    finish,
    customGemColor,
  ]);

  // Add subtle animation to make the jewelry sparkle
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      // Very subtle floating motion - reduced amplitude
      groupRef.current.position.y = 1.2 + Math.sin(t * 0.5) * 0.02;

      // Very subtle rotation - reduced amplitude
      groupRef.current.rotation.y = Math.PI / 6 + Math.sin(t * 0.25) * 0.03;
    }
  });

  return (
    <group ref={groupRef} dispose={null} rotation={[0.5, 0, 0]}>
      <primitive object={scene.clone()} />
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const loadingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Show loading state for at least 1 second for UX
    loadingTimeout.current = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Cleanup function
    return () => {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
      }
    };
  }, []);

  const handleError = (e: ErrorEvent) => {
    console.error("Error in 3D viewer:", e);
    setError(true);
    setLoading(false);
  };

  // Add error handler to window for THREE.js errors
  useEffect(() => {
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  // Fall back to image if there's an error
  if (error) {
    return (
      <div className="w-full h-full text-center">
        <FallbackImage
          src="/images/jewelry-fallback.jpg"
          alt="Jewelry"
          width={600}
          height={400}
          className="mx-auto rounded-lg shadow-lg"
          fallbackSrc="/images/fallback-product.svg"
        />
        <p className="mt-4 text-gray-500">
          Interactive 3D viewer unavailable. Please try another browser.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="relative w-full h-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-nile-teal"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Loading 3D Model...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-nile-teal"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Error loading 3D Model...
              </p>
            </div>
          </div>
        )}

        <Canvas
          shadows
          camera={{ position: [0, 0, 5], fov: 50 }}
          className="w-full h-full"
          dpr={[1, 2]}
          gl={{ preserveDrawingBuffer: true }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Suspense fallback={null}>
            <JewelryModel {...props} />
            <CustomEnvironment />
          </Suspense>
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={false}
            autoRotateSpeed={1}
            minDistance={2}
            maxDistance={8}
          />
        </Canvas>
      </div>
    </div>
  );
}
