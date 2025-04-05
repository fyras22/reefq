'use client';

import { useState, useEffect, useRef } from 'react';
import { MetalType, GemstoneType } from '@/data/materialsData';
import Image from 'next/image';
import { XMarkIcon, CameraIcon, ArrowPathIcon, CheckIcon } from '@heroicons/react/24/outline';
import {
  HandRaisedIcon,
  FingerPrintIcon,
  UserIcon,
  HeartIcon,
  EyeIcon
} from '@heroicons/react/24/solid';

interface ARJewelryViewerProps {
  modelPath: string;
  productType: string;
  selectedMetal: MetalType;
  selectedGem: GemstoneType;
  isOpen: boolean;
  onClose: () => void;
  onPhotoTaken?: (dataUrl: string) => void;
}

// Body parts where jewelry can be worn
type BodyPart = 'hand' | 'finger' | 'neck' | 'wrist' | 'ear' | 'face';

export default function ARJewelryViewer({
  modelPath,
  productType,
  selectedMetal,
  selectedGem,
  isOpen,
  onClose,
  onPhotoTaken
}: ARJewelryViewerProps) {
  // State for AR/camera functionality
  const [hasARSupport, setHasARSupport] = useState<boolean | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [activeBodyPart, setActiveBodyPart] = useState<BodyPart>('hand');
  const [isLoading, setIsLoading] = useState(true);
  const [showTips, setShowTips] = useState(true);
  const [photoTaken, setPhotoTaken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const xrSessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Check for AR support
  useEffect(() => {
    if (!isOpen) return;
    
    const checkARSupport = async () => {
      try {
        // Check if WebXR is supported
        if ('xr' in navigator) {
          // @ts-ignore - TS doesn't have types for this yet
          const isSupported = await navigator.xr.isSessionSupported('immersive-ar');
          setHasARSupport(isSupported);
          if (!isSupported) {
            // Fall back to checking camera access as alternative
            checkCameraAccess();
          }
        } else {
          setHasARSupport(false);
          // Fall back to checking camera access as alternative
          checkCameraAccess();
        }
      } catch (err) {
        console.error('Error checking AR support:', err);
        setHasARSupport(false);
        // Fall back to checking camera access as alternative
        checkCameraAccess();
      } finally {
        setIsLoading(false);
      }
    };
    
    const checkCameraAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        stream.getTracks().forEach(track => track.stop()); // Release the camera
      } catch (err) {
        console.error('Camera permission denied:', err);
        setHasCameraPermission(false);
      }
    };
    
    checkARSupport();
    
    return () => {
      cleanupCamera();
    };
  }, [isOpen]);
  
  // Initialize camera when modal opens and we have permission
  useEffect(() => {
    if (!isOpen || hasARSupport === null || hasCameraPermission === null) return;
    
    if (!hasARSupport && hasCameraPermission) {
      initializeCamera();
    }
    
    return () => {
      cleanupCamera();
    };
  }, [isOpen, hasARSupport, hasCameraPermission]);
  
  // Initialize camera
  const initializeCamera = async () => {
    try {
      if (!videoRef.current) return;
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setIsLoading(false);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please check permissions.');
      setIsLoading(false);
    }
  };
  
  // Cleanup camera resources
  const cleanupCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    if (xrSessionRef.current) {
      xrSessionRef.current.end().catch((err: any) => {
        console.error('Error ending XR session:', err);
      });
      xrSessionRef.current = null;
    }
  };
  
  // Start AR session
  const startARSession = async () => {
    try {
      if (!('xr' in navigator)) {
        throw new Error('WebXR not supported');
      }
      
      // Find the AR overlay element
      const arOverlayElement = document.getElementById('ar-overlay');
      
      // @ts-ignore - TS doesn't have types for this yet
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay'],
        ...(arOverlayElement ? { domOverlay: { root: arOverlayElement } } : {})
      });
      
      xrSessionRef.current = session;
      
      // More AR session setup would go here
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error starting AR session:', err);
      setError('Failed to start AR session. Try using regular camera mode.');
      setHasARSupport(false);
      initializeCamera(); // Fall back to regular camera
      setIsLoading(false);
    }
  };
  
  // Take a photo
  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Draw the video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Add the overlay image based on active body part and product type
    const overlayImg = getOverlayImage();
    if (overlayImg && overlayRef.current) {
      // Calculate positioning based on body part
      const { x, y, width, height } = getOverlayPosition(activeBodyPart, canvas.width, canvas.height);
      
      ctx.drawImage(overlayRef.current, x, y, width, height);
    }
    
    // Get the data URL and save it
    const dataUrl = canvas.toDataURL('image/jpeg');
    setPhotoTaken(dataUrl);
    
    if (onPhotoTaken) {
      onPhotoTaken(dataUrl);
    }
  };
  
  // Get overlay image path based on product type and body part
  const getOverlayImage = () => {
    // Map product types to body parts and corresponding overlay images
    const overlayMap: Record<string, Record<BodyPart, string>> = {
      ring: {
        hand: '/overlays/ring-hand.png',
        finger: '/overlays/ring-finger.png',
        neck: '',
        wrist: '',
        ear: '',
        face: ''
      },
      necklace: {
        hand: '',
        finger: '',
        neck: '/overlays/necklace-neck.png',
        wrist: '',
        ear: '',
        face: ''
      },
      bracelet: {
        hand: '',
        finger: '',
        neck: '',
        wrist: '/overlays/bracelet-wrist.png',
        ear: '',
        face: ''
      },
      earrings: {
        hand: '',
        finger: '',
        neck: '',
        wrist: '',
        ear: '/overlays/earrings-ear.png',
        face: ''
      },
      pendant: {
        hand: '',
        finger: '',
        neck: '/overlays/pendant-neck.png',
        wrist: '',
        ear: '',
        face: ''
      }
    };
    
    // Default to generic product type if not found
    const productMap = overlayMap[productType.toLowerCase()] || overlayMap.ring;
    
    return productMap[activeBodyPart] || '';
  };
  
  // Get positioning for overlay based on body part
  const getOverlayPosition = (bodyPart: BodyPart, canvasWidth: number, canvasHeight: number) => {
    // Default position (centered)
    let x = canvasWidth * 0.5;
    let y = canvasHeight * 0.5;
    let width = canvasWidth * 0.25;
    let height = canvasHeight * 0.25;
    
    switch (bodyPart) {
      case 'hand':
        x = canvasWidth * 0.5 - width * 0.5;
        y = canvasHeight * 0.6 - height * 0.5;
        width = canvasWidth * 0.4;
        height = canvasHeight * 0.25;
        break;
      case 'finger':
        x = canvasWidth * 0.5 - width * 0.5;
        y = canvasHeight * 0.6 - height * 0.5;
        width = canvasWidth * 0.15;
        height = canvasHeight * 0.15;
        break;
      case 'neck':
        x = canvasWidth * 0.5 - width * 0.5;
        y = canvasHeight * 0.35 - height * 0.5;
        width = canvasWidth * 0.4;
        height = canvasHeight * 0.25;
        break;
      case 'wrist':
        x = canvasWidth * 0.5 - width * 0.5;
        y = canvasHeight * 0.5 - height * 0.5;
        width = canvasWidth * 0.3;
        height = canvasHeight * 0.2;
        break;
      case 'ear':
        x = canvasWidth * 0.65 - width * 0.5;
        y = canvasHeight * 0.35 - height * 0.5;
        width = canvasWidth * 0.15;
        height = canvasHeight * 0.2;
        break;
    }
    
    return { x, y, width, height };
  };
  
  // Save photo
  const savePhoto = () => {
    if (!photoTaken) return;
    
    // Create a download link
    const a = document.createElement('a');
    a.href = photoTaken;
    a.download = `jewelry-ar-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Reset state for another photo
    resetPhoto();
  };
  
  // Reset the photo view
  const resetPhoto = () => {
    setPhotoTaken(null);
  };
  
  // Select a body part for the AR/camera view
  const selectBodyPart = (part: BodyPart) => {
    setActiveBodyPart(part);
  };
  
  // Get the appropriate body parts for this product type
  const getRelevantBodyParts = (): BodyPart[] => {
    const partMap: Record<string, BodyPart[]> = {
      ring: ['finger', 'hand'],
      necklace: ['neck'],
      bracelet: ['wrist', 'hand'],
      earrings: ['ear'],
      pendant: ['neck']
    };
    
    return partMap[productType.toLowerCase()] || ['hand'];
  };
  
  // Image overlay ref
  const overlayRef = useRef<HTMLImageElement | null>(null);
  
  // This div is only rendered when the modal is open
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" onClick={onClose}></div>
      
      <div className="relative w-full max-w-3xl mx-auto z-50 bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Try On Your {productType} With AR
          </h3>
          <button className="text-gray-400 hover:text-gray-500" onClick={onClose}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nile-teal"></div>
            </div>
          ) : error ? (
            <div className="h-96 flex flex-col items-center justify-center text-red-500">
              <div className="mb-4 text-center">{error}</div>
              <button
                className="px-4 py-2 bg-nile-teal text-white rounded-md"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          ) : photoTaken ? (
            // Photo preview
            <div className="relative">
              <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={photoTaken} 
                  alt="AR jewelry preview" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md flex items-center"
                  onClick={resetPhoto}
                >
                  <ArrowPathIcon className="h-5 w-5 mr-2" />
                  Try Again
                </button>
                <button
                  className="px-4 py-2 bg-nile-teal text-white rounded-md flex items-center"
                  onClick={savePhoto}
                >
                  <CheckIcon className="h-5 w-5 mr-2" />
                  Save Photo
                </button>
              </div>
            </div>
          ) : (!hasARSupport && !hasCameraPermission) ? (
            // No AR or camera permission
            <div className="h-96 flex flex-col items-center justify-center">
              <div className="mb-4 text-center">
                <p className="text-lg font-medium text-gray-900">
                  AR and Camera Access Required
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Please allow camera access to use this feature.
                </p>
              </div>
              <button
                className="px-4 py-2 bg-nile-teal text-white rounded-md"
                onClick={initializeCamera}
              >
                Try Again
              </button>
            </div>
          ) : hasARSupport ? (
            // WebXR AR View
            <div id="ar-overlay" className="relative h-96 bg-gray-100 rounded-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500">
                  {isLoading ? 'Loading AR Experience...' : 'AR View Will Appear Here'}
                </p>
              </div>
              
              {/* AR mode UI would go here */}
              <div className="absolute bottom-4 inset-x-0 flex justify-center">
                <button
                  className="px-4 py-2 bg-nile-teal text-white rounded-full flex items-center"
                  onClick={startARSession}
                >
                  <EyeIcon className="h-5 w-5 mr-2" />
                  Start AR Experience
                </button>
              </div>
            </div>
          ) : (
            // Regular camera view with overlay
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Overlay image for the selected body part */}
              <img
                ref={overlayRef}
                src={getOverlayImage()}
                alt=""
                className="hidden" // Hidden, used for canvas drawing
              />
              
              {/* Canvas for taking photos */}
              <canvas
                ref={canvasRef}
                className="hidden"
              />
              
              {/* UI overlay */}
              <div className="absolute bottom-4 inset-x-0 flex justify-center">
                <button
                  className="p-4 bg-white rounded-full shadow-lg flex items-center justify-center"
                  onClick={takePhoto}
                >
                  <CameraIcon className="h-8 w-8 text-nile-teal" />
                </button>
              </div>
              
              {/* Body part selection */}
              <div className="absolute top-4 inset-x-0 flex justify-center">
                <div className="bg-white rounded-full shadow-lg p-1 flex space-x-1">
                  {getRelevantBodyParts().map((part) => (
                    <button
                      key={part}
                      className={`p-2 rounded-full ${activeBodyPart === part ? 'bg-nile-teal text-white' : 'text-gray-500'}`}
                      onClick={() => selectBodyPart(part)}
                    >
                      {part === 'hand' && <HandRaisedIcon className="h-5 w-5" />}
                      {part === 'finger' && <FingerPrintIcon className="h-5 w-5" />}
                      {part === 'neck' && <UserIcon className="h-5 w-5" />}
                      {part === 'wrist' && <HandRaisedIcon className="h-5 w-5" />}
                      {part === 'ear' && <EyeIcon className="h-5 w-5" />}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Usage tips */}
              {showTips && (
                <div className="absolute top-16 inset-x-0 flex justify-center">
                  <div className="bg-white bg-opacity-75 rounded-lg shadow-lg p-3 max-w-xs">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">Usage Tips</h4>
                      <button onClick={() => setShowTips(false)} className="text-gray-400">
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Hold the camera steady</li>
                      <li>• Good lighting helps with better results</li>
                      <li>• Select the body part where you want to visualize</li>
                      <li>• The jewelry will appear as an overlay</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Product info */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                {selectedGem ? (
                  <div 
                    className="w-8 h-8 rounded-full" 
                    style={{ backgroundColor: selectedGem === 'diamond' ? '#F4F4F4' : GEMSTONE_COLORS[selectedGem] }}
                  />
                ) : (
                  <div 
                    className="w-8 h-8 rounded-md" 
                    style={{ backgroundColor: METAL_COLORS[selectedMetal] }}
                  />
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  {capitalizeFirstLetter(selectedMetal)} {capitalizeFirstLetter(productType)}
                  {selectedGem && ` with ${capitalizeFirstLetter(selectedGem)}`}
                </h4>
                <p className="text-sm text-gray-500">
                  Visualize how this piece would look on you
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to capitalize first letter
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Color constants for the UI
const METAL_COLORS: Record<MetalType, string> = {
  gold: '#FFD700',
  silver: '#C0C0C0',
  platinum: '#E5E4E2',
  rosegold: '#B76E79',
  whitegold: '#E8E8E8'
};

const GEMSTONE_COLORS: Record<Exclude<GemstoneType, null>, string> = {
  diamond: '#F4F4F4',
  ruby: '#E0115F',
  sapphire: '#0F52BA',
  emerald: '#50C878',
  amethyst: '#9966CC',
  topaz: '#FFC87C',
  pearl: '#F5F5F1',
  morganite: '#F9D1D1',
  opal: '#E5E4E2'
}; 