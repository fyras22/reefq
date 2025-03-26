import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';

interface ViewerControlsProps {
  onMetalChange: (type: 'gold' | 'silver' | 'platinum') => void;
  onGemChange: (type: 'diamond' | 'ruby' | 'sapphire' | 'emerald') => void;
  onSizeChange: (size: number) => void;
  onCameraPreset: (preset: 'front' | 'side' | 'top' | 'detail') => void;
  onFullscreen: () => void;
  isFullscreen: boolean;
}

const cameraPresets = {
  front: { position: [0, 0, 5], target: [0, 0, 0] },
  side: { position: [5, 0, 0], target: [0, 0, 0] },
  top: { position: [0, 5, 0], target: [0, 0, 0] },
  detail: { position: [2, 2, 2], target: [0, 0, 0] },
};

export function ViewerControls({
  onMetalChange,
  onGemChange,
  onSizeChange,
  onCameraPreset,
  onFullscreen,
  isFullscreen,
}: ViewerControlsProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-4 right-4 z-10"
    >
      <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
        {/* Metal Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Metal Type</label>
          <select
            onChange={(e) => onMetalChange(e.target.value as 'gold' | 'silver' | 'platinum')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
          >
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="platinum">Platinum</option>
          </select>
        </div>

        {/* Gem Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gemstone</label>
          <select
            onChange={(e) => onGemChange(e.target.value as 'diamond' | 'ruby' | 'sapphire' | 'emerald')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
          >
            <option value="diamond">Diamond</option>
            <option value="ruby">Ruby</option>
            <option value="sapphire">Sapphire</option>
            <option value="emerald">Emerald</option>
          </select>
        </div>

        {/* Size Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ring Size</label>
          <input
            type="range"
            min="1"
            max="10"
            defaultValue="5"
            onChange={(e) => onSizeChange(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Camera Presets */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">View</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(cameraPresets).map(([preset, _]) => (
              <button
                key={preset}
                onClick={() => onCameraPreset(preset as 'front' | 'side' | 'top' | 'detail')}
                className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
              >
                {preset.charAt(0).toUpperCase() + preset.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={onFullscreen}
          className="w-full flex items-center justify-center px-3 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
        >
          {isFullscreen ? (
            <>
              <ArrowsPointingInIcon className="h-4 w-4 mr-1" />
              Exit Fullscreen
            </>
          ) : (
            <>
              <ArrowsPointingOutIcon className="h-4 w-4 mr-1" />
              Enter Fullscreen
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
} 