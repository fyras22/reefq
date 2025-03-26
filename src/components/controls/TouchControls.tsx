import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface TouchControlsProps {
  enabled: boolean;
}

export function TouchControls({ enabled }: TouchControlsProps) {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        touchStartRef.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };
        lastTouchRef.current = touchStartRef.current;
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!touchStartRef.current || !lastTouchRef.current || event.touches.length !== 1) return;

      const touch = event.touches[0];
      const deltaX = touch.clientX - lastTouchRef.current.x;
      const deltaY = touch.clientY - lastTouchRef.current.y;

      if (controlsRef.current) {
        controlsRef.current.rotateLeft(deltaX * 0.005);
        controlsRef.current.rotateUp(deltaY * 0.005);
      }

      lastTouchRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };
    };

    const handleTouchEnd = () => {
      touchStartRef.current = null;
      lastTouchRef.current = null;
    };

    const element = gl.domElement;
    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, gl.domElement]);

  return (
    <OrbitControls
      ref={controlsRef}
      camera={camera}
      enablePan={false}
      enableZoom={enabled}
      enableRotate={enabled}
      minPolarAngle={Math.PI / 3}
      maxPolarAngle={Math.PI / 2}
      minDistance={3}
      maxDistance={10}
      target={[0, 0, 0]}
    />
  );
} 