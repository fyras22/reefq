'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface JewelryVirtualTryOnProps {
  metalType: string;
  gemType: string;
  jewelryType: string;
}

export function JewelryVirtualTryOn({ 
  metalType = 'gold', 
  gemType = 'emerald',
  jewelryType = 'ring'
}: JewelryVirtualTryOnProps) {
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const [isCaptured, setIsCaptured] = useState<boolean>(false);
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const [overlaySize, setOverlaySize] = useState(1);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Request camera permission and initialize video stream
  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraPermission(true);
      }
    } catch (err) {
      setCameraPermission(false);
      console.error('Error accessing camera:', err);
    }
  };
  
  useEffect(() => {
    requestCameraPermission();
    
    // Cleanup function to stop camera when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);
  
  // Handle video loaded event
  const handleVideoLoaded = () => {
    setIsLoading(false);
  };
  
  // Capture current frame from video
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to image URL
    const imageUrl = canvas.toDataURL('image/png');
    setCapturedImageUrl(imageUrl);
    setIsCaptured(true);
  };
  
  // Reset capture and return to camera view
  const resetCapture = () => {
    setIsCaptured(false);
    setCapturedImageUrl(null);
  };
  
  // Get overlay image based on jewelry type and properties
  const getOverlayImage = () => {
    const basePrefix = gemType === 'diamond' ? 'diamond' : 
                      gemType === 'ruby' ? 'ruby' : 
                      gemType === 'sapphire' ? 'sapphire' : 'emerald';
                      
    const metalSuffix = metalType === 'gold' ? 'gold' : 
                        metalType === 'silver' ? 'silver' : 
                        metalType === 'platinum' ? 'platinum' : 'gold';
    
    if (jewelryType === 'ring') {
      return `/images/try-on/${basePrefix}-ring-${metalSuffix}.png`;
    } else if (jewelryType === 'necklace') {
      return `/images/try-on/${basePrefix}-necklace-${metalSuffix}.png`;
    } else if (jewelryType === 'earrings') {
      return `/images/try-on/${basePrefix}-earrings-${metalSuffix}.png`;
    } else {
      return `/images/try-on/${basePrefix}-ring-${metalSuffix}.png`;
    }
  };
  
  // Handle overlay drag
  const handleDrag = (event, info) => {
    setOverlayPosition({
      x: overlayPosition.x + info.delta.x,
      y: overlayPosition.y + info.delta.y
    });
  };
  
  // Handle size change
  const handleSizeChange = (e) => {
    setOverlaySize(parseFloat(e.target.value));
  };
  
  // Save the final image with overlay
  const saveImage = () => {
    if (!canvasRef.current || !capturedImageUrl) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Create a new image from the captured photo
    const img = new Image();
    img.onload = () => {
      // Draw the captured image
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Draw the overlay on top
      const overlay = new Image();
      overlay.onload = () => {
        // Calculate position and size for the overlay
        const overlayWidth = overlay.width * overlaySize;
        const overlayHeight = overlay.height * overlaySize;
        const x = (canvas.width / 2) - (overlayWidth / 2) + overlayPosition.x;
        const y = (canvas.height / 2) - (overlayHeight / 2) + overlayPosition.y;
        
        context.drawImage(overlay, x, y, overlayWidth, overlayHeight);
        
        // Convert the final image to a data URL
        const finalImageUrl = canvas.toDataURL('image/png');
        
        // Create download link
        const link = document.createElement('a');
        link.href = finalImageUrl;
        link.download = `virtual-try-on-${jewelryType}.png`;
        link.click();
      };
      overlay.src = getOverlayImage();
    };
    img.src = capturedImageUrl;
  };
  
  // Get appropriate helper text based on jewelry type
  const getHelperText = () => {
    if (jewelryType === 'ring') {
      return "Position your hand in the frame";
    } else if (jewelryType === 'necklace') {
      return "Position your neck and shoulders in the frame";
    } else if (jewelryType === 'earrings') {
      return "Position your face in the frame, showing your ears";
    } else {
      return "Position yourself in the frame";
    }
  };
  
  if (cameraPermission === false) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-medium">Camera Access Denied</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Please allow camera access to use the virtual try-on feature. You can update your 
          browser permissions and refresh the page.
        </p>
        <button
          onClick={requestCameraPermission}
          className="bg-nile-teal hover:bg-nile-teal/90 text-white py-2 px-4 rounded-md text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {showInstructions && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 z-10 flex items-center justify-center text-white p-6"
        >
          <div className="max-w-md text-center">
            <h3 className="text-xl font-medium mb-4">Virtual Try-On Instructions</h3>
            <ul className="list-disc text-left space-y-2 mb-6 pl-5">
              <li>{getHelperText()}</li>
              <li>Make sure you're in a well-lit area</li>
              <li>Remain still when taking the photo</li>
              <li>After taking the photo, you can adjust the jewelry position and size</li>
            </ul>
            <button
              onClick={() => setShowInstructions(false)}
              className="bg-nile-teal hover:bg-nile-teal/90 text-white py-2 px-6 rounded-md"
            >
              Got It
            </button>
          </div>
        </motion.div>
      )}
      
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nile-teal"></div>
          </div>
        )}
        
        {!isCaptured ? (
          // Camera view
          <div className="relative aspect-[4/3] bg-black">
            <video 
              ref={videoRef}
              autoPlay 
              playsInline
              muted
              onLoadedData={handleVideoLoaded}
              className="w-full h-full object-cover"
            />
            
            {!isLoading && (
              <>
                {/* Positioning guide overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`
                    border-2 border-dashed border-white/50 rounded-lg opacity-70
                    ${jewelryType === 'ring' ? 'w-40 h-40' : 
                      jewelryType === 'necklace' ? 'w-64 h-40' : 
                      jewelryType === 'earrings' ? 'w-48 h-56' : 'w-40 h-40'}
                  `}></div>
                </div>
                
                {/* Helper text */}
                <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black/50 py-2">
                  {getHelperText()}
                </div>
              </>
            )}
          </div>
        ) : (
          // Captured image view with overlay
          <div className="relative aspect-[4/3] bg-black">
            <img 
              src={capturedImageUrl || ''} 
              alt="Captured" 
              className="w-full h-full object-cover"
            />
            
            {/* Draggable jewelry overlay */}
            <motion.div
              ref={overlayRef}
              drag
              dragMomentum={false}
              onDrag={handleDrag}
              className="absolute"
              style={{
                top: `calc(50% + ${overlayPosition.y}px)`,
                left: `calc(50% + ${overlayPosition.x}px)`,
                transform: `translate(-50%, -50%) scale(${overlaySize})`,
                cursor: 'move'
              }}
            >
              <img
                src={getOverlayImage()}
                alt="Jewelry overlay"
                className="max-w-full pointer-events-none"
                style={{ opacity: 0.95 }}
                onError={(e) => {
                  // Fallback if the specific image doesn't exist
                  e.currentTarget.src = `/images/try-on/default-${jewelryType}.png`;
                }}
              />
            </motion.div>
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Controls */}
        <div className="p-4 border-t border-gray-200">
          {!isCaptured ? (
            <div className="flex justify-center">
              <button
                onClick={captureImage}
                className="bg-nile-teal hover:bg-nile-teal/90 text-white h-14 w-14 rounded-full flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adjust Size
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={overlaySize}
                  onChange={handleSizeChange}
                  className="w-full"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={resetCapture}
                  className="flex-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md text-sm"
                >
                  Retake
                </button>
                <button
                  onClick={saveImage}
                  className="flex-1 bg-nile-teal hover:bg-nile-teal/90 text-white py-2 px-4 rounded-md text-sm"
                >
                  Save Image
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 