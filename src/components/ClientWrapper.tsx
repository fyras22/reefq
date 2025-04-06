'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from "lucide-react";

// Define the JewelryViewerProps interface
interface JewelryViewerProps {
  metalType?: 'gold' | 'silver' | 'platinum';
  gemType?: 'diamond' | 'ruby' | 'sapphire' | 'emerald';
  size?: number;
}

// Define the ARTryOnProps interface
interface ARTryOnProps {
  selectedMetal: 'gold' | 'silver' | 'platinum';
  selectedGem: 'diamond' | 'ruby' | 'sapphire' | 'emerald';
}

// Simple placeholder component to use while we fix the JewelryViewer import
const PlaceholderViewer = () => (
  <div className="flex h-full w-full items-center justify-center bg-gray-100 rounded-lg p-8">
    <div className="text-center">
      <p className="text-gray-500">3D viewer temporarily disabled</p>
    </div>
  </div>
);

// Use a placeholder component instead of the problematic dynamic import
const JewelryViewer = PlaceholderViewer;

// Dynamically import the AR Try-On component
const ARTryOn = dynamic<ARTryOnProps>(() => import('./ARTryOn'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <div className="text-sm font-medium text-gray-900">Loading AR Experience...</div>
        <div className="mt-2 h-2 w-32 overflow-hidden rounded-full bg-gray-200">
          <div className="h-full w-1/3 animate-pulse bg-amber-600" />
        </div>
      </div>
    </div>
  ),
});

export function ClientWrapper() {
  return (
    <div className="h-full w-full">
      <JewelryViewer />
    </div>
  );
}

export function ARWrapper() {
  return (
    <div className="h-full w-full">
      <ARTryOn selectedMetal="gold" selectedGem="diamond" />
    </div>
  );
} 