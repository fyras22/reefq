'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CameraIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';

// Dynamically import AR component with no SSR
const ARExperience = dynamic(() => import('./ARExperience'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-t-2 border-nile-teal rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Loading AR Experience...</p>
      </div>
    </div>
  )
});

const DEMO_PRODUCTS = [
  {
    id: 'ring1',
    name: 'Sapphire Eternity Band',
    image: '/images/ring-1.jpg',
    price: 1250,
    arModel: '/models/ring1.glb'
  },
  {
    id: 'ring2',
    name: 'Diamond Solitaire',
    image: '/images/ring-2.jpg',
    price: 3500,
    arModel: '/models/ring2.glb'
  },
  {
    id: 'bracelet1',
    name: 'Gold Chain Bracelet',
    image: '/images/bracelet-1.jpg',
    price: 950,
    arModel: '/models/bracelet1.glb'
  }
];

export default function ARViewer({ onSessionComplete }) {
  const [currentStep, setCurrentStep] = useState('intro'); // intro, camera-permission, experience, complete
  const [selectedProduct, setSelectedProduct] = useState(DEMO_PRODUCTS[0]);
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  // Check AR/WebXR support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Basic check for modern browsers
      setIsSupported(
        'xr' in navigator || 
        'mediaDevices' in navigator || 
        'getUserMedia' in navigator
      );
    }
  }, []);

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraAllowed(true);
      setCurrentStep('experience');
    } catch (error) {
      console.error('Camera permission denied:', error);
      alert('Camera access is required for the AR experience. Please allow camera access and try again.');
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const completeSession = () => {
    if (onSessionComplete) {
      onSessionComplete({
        success: true,
        product: selectedProduct,
        timestamp: new Date().toISOString()
      });
    }
    setCurrentStep('complete');
  };

  const resetExperience = () => {
    setCurrentStep('intro');
    setSelectedProduct(DEMO_PRODUCTS[0]);
  };

  // Intro step
  if (currentStep === 'intro') {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-nile-teal/10 text-nile-teal mb-4">
            <CameraIcon className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Virtual Try-On Experience
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Use your device's camera to see how our jewelry would look on you. 
            Choose a piece of jewelry and try it on virtually.
          </p>
        </div>

        {!isSupported ? (
          <div className="bg-amber-50 text-amber-800 p-4 rounded-lg mb-6">
            <p className="font-medium">
              Your device or browser doesn't support AR features.
            </p>
            <p className="text-sm mt-1">
              Please try using a modern browser or device with camera access.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {DEMO_PRODUCTS.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductSelect(product)}
                className={`border rounded-lg p-3 cursor-pointer transition ${
                  selectedProduct.id === product.id 
                    ? 'border-nile-teal ring-2 ring-nile-teal/20' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="aspect-square bg-gray-100 rounded-md mb-2"></div>
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-600">${product.price}</p>
              </div>
            ))}
          </div>
        )}

        {isSupported && (
          <div className="flex justify-center">
            <button
              onClick={() => setCurrentStep('camera-permission')}
              className="px-5 py-2.5 bg-nile-teal text-white rounded-md font-medium hover:bg-nile-teal-dark transition"
            >
              Start Virtual Try-On
            </button>
          </div>
        )}
      </div>
    );
  }

  // Camera permission step
  if (currentStep === 'camera-permission') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Camera Access Required
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            We need access to your camera to show how the jewelry will look on you. 
            Your privacy is important to us, and camera data is not recorded or stored.
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={resetExperience}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={requestCameraPermission}
            className="px-5 py-2 bg-nile-teal text-white rounded-md font-medium hover:bg-nile-teal-dark transition"
          >
            Allow Camera Access
          </button>
        </div>
      </motion.div>
    );
  }

  // AR Experience step
  if (currentStep === 'experience') {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="relative">
          <ARExperience product={selectedProduct} />
          
          <div className="absolute bottom-4 right-4 z-10">
            <button
              onClick={completeSession}
              className="px-4 py-2 bg-nile-teal text-white rounded-md font-medium hover:bg-nile-teal-dark transition"
            >
              Complete Try-On
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Complete step
  if (currentStep === 'complete') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg shadow-sm p-6 text-center"
      >
        <div className="inline-block p-3 rounded-full bg-green-100 text-green-600 mb-4">
          <CheckCircleIcon className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Try-On Complete!
        </h2>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          You've completed the virtual try-on for {selectedProduct.name}.
          How did it look?
        </p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={resetExperience}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Try Another Item
          </button>
        </div>
      </motion.div>
    );
  }

  return null;
} 