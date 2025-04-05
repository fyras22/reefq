'use client';

import { useState, useEffect } from 'react';
import { IoCodeOutline } from 'react-icons/io5';
import { RiRulerLine } from 'react-icons/ri';
import { IoClose } from 'react-icons/io5';
import Image from 'next/image';

interface ARButtonProps {
  productId: string;
  modelPath?: string;
  iosModelPath?: string;
  androidModelPath?: string;
  variant?: string;
  showLabel?: boolean;
}

/**
 * ARButton component for launching AR experiences on supported devices
 * Supports both iOS QuickLook (.usdz) and Android Scene Viewer (.glb)
 */
export default function ARButton({
  productId,
  modelPath,
  iosModelPath,
  androidModelPath,
  variant = 'default',
  showLabel = false,
}: ARButtonProps) {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [arURL, setArURL] = useState('');
  
  // Detect device
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));
    
    // Generate AR URL based on device
    if (/iphone|ipad|ipod/.test(userAgent) && iosModelPath) {
      // iOS AR Quick Look
      const siteURL = window.location.origin;
      const fullModelPath = `${siteURL}${iosModelPath}`;
      setArURL(`https://developer.apple.com/augmented-reality/quick-look/?url=${encodeURIComponent(fullModelPath)}`);
    } else if (/android/.test(userAgent) && androidModelPath) {
      // Android Scene Viewer
      const siteURL = window.location.origin;
      const fullModelPath = `${siteURL}${androidModelPath}`;
      setArURL(`intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(fullModelPath)}&mode=ar_preferred&resizable=true#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(siteURL)};end;`);
    } else {
      // Fallback for desktop or unsupported device - QR code
      const siteURL = window.location.origin;
      const arPageURL = `${siteURL}/ar-viewer/${productId}?variant=${variant}`;
      setArURL(arPageURL);
    }
  }, [productId, iosModelPath, androidModelPath, variant]);
  
  // Handle AR view click
  const handleARClick = () => {
    if (isIOS || isAndroid) {
      // Open AR directly on mobile
      window.location.href = arURL;
    } else {
      // Show QR code on desktop
      setShowQRCode(true);
    }
  };
  
  // Generate QR code for AR viewing
  const getQRCodeUrl = () => {
    const encodedURL = encodeURIComponent(arURL);
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedURL}`;
  };

  return (
    <>
      <button
        onClick={handleARClick}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg transition-all"
        aria-label="View in augmented reality"
      >
        <RiRulerLine className="text-xl" />
        {showLabel && <span>View in AR</span>}
      </button>
      
      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">View in AR</h3>
              <button
                onClick={() => setShowQRCode(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <IoClose className="text-2xl" />
              </button>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <Image
                  src={getQRCodeUrl()}
                  alt="QR Code for AR View"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </div>
              
              <p className="text-center text-gray-600 mb-4">
                Scan this QR code with your mobile device to view this product in augmented reality.
              </p>
              
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Image 
                      src="/assets/images/icons/ios.png"
                      alt="iOS"
                      width={16}
                      height={16}
                    />
                  </div>
                  <span>iOS 12+ with ARKit support</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Image 
                      src="/assets/images/icons/android.png"
                      alt="Android"
                      width={16}
                      height={16}
                    />
                  </div>
                  <span>Android 8.0+ with ARCore support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 