'use client';

import { useState } from 'react';
import { CustomDesign } from '@/services/customizationService';
import { useRouter } from 'next/navigation';
import { XMarkIcon, CheckIcon, ShareIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface DesignSavedModalProps {
  design: CustomDesign;
  isOpen: boolean;
  onClose: () => void;
  onShare: (design: CustomDesign) => void;
}

export default function DesignSavedModal({
  design,
  isOpen,
  onClose,
  onShare
}: DesignSavedModalProps) {
  const router = useRouter();
  const [copySuccess, setCopySuccess] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  
  if (!isOpen) return null;
  
  const shareLink = `${window.location.origin}/designs/${design.id}`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  const viewDesign = () => {
    router.push(`/designs/${design.id}`);
    onClose();
  };
  
  const continueCustomizing = () => {
    router.push(`/jewelry-customizer`);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all relative">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
          
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckIcon className="h-6 w-6 text-green-600" />
            </div>
            
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Design Saved Successfully!
            </h3>
            
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Your custom {design.settings.productType} design has been saved with the name "{design.name}".
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-200">
                <Image 
                  src={design.previewImage || '/images/default-design-preview.jpg'} 
                  alt={design.name} 
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{design.name}</h4>
                <p className="text-sm text-gray-500">
                  {design.settings.metal} {design.settings.designStyle} {design.settings.productType}
                  {design.settings.gemstone && ` with ${design.settings.gemstone}`}
                </p>
                <p className="text-sm font-medium text-nile-teal">
                  ${design.price.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <button
              onClick={viewDesign}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-nile-teal hover:bg-nile-teal-dark"
            >
              View My Design
            </button>
            
            <button
              onClick={() => onShare(design)}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <ShareIcon className="h-4 w-4 mr-2" />
              Share Design
            </button>
            
            <div className="relative mt-2">
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={shareLink}
                  className="block w-full rounded-l-md border-gray-300 text-sm text-gray-900 py-2 px-3 focus:border-nile-teal focus:ring-nile-teal"
                />
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  {linkCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              {linkCopied && (
                <p className="absolute text-xs text-green-600 mt-1">Link copied to clipboard!</p>
              )}
            </div>
            
            <button
              onClick={continueCustomizing}
              className="w-full flex justify-center items-center px-4 py-2 mt-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Create Another Design
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 