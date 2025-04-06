'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DIAMOND_ASSETS } from '@/lib/assets/MediaAssets';
import { cn } from '@/lib/utils';

interface DiamondVisualizerProps {
  initialCut?: string;
  initialColor?: string;
  initialClarity?: string;
}

/**
 * DiamondVisualizer component allows users to explore different diamond cuts, colors, and clarity grades
 * with visual representations and educational information.
 */
export default function DiamondVisualizer({
  initialCut = 'round',
  initialColor = 'd',
  initialClarity = 'vvs1',
}: DiamondVisualizerProps) {
  const [cut, setCut] = useState(initialCut);
  const [color, setColor] = useState(initialColor);
  const [clarity, setClarity] = useState(initialClarity);
  const [view, setView] = useState<'cut' | 'color' | 'clarity'>('cut');
  
  const renderRingView = () => {
    let imageSrc = '';
    
    // Choose image based on selected view
    switch(view) {
      case 'cut':
        imageSrc = DIAMOND_ASSETS.cuts[cut as keyof typeof DIAMOND_ASSETS.cuts] || '';
        break;
      case 'color':
        imageSrc = DIAMOND_ASSETS.colors[color as keyof typeof DIAMOND_ASSETS.colors] || '';
        break;
      case 'clarity':
        imageSrc = DIAMOND_ASSETS.clarity[clarity as keyof typeof DIAMOND_ASSETS.clarity] || '';
        break;
      default:
        imageSrc = DIAMOND_ASSETS.cuts.round;
    }
    
    return (
      <div className="relative w-full h-80 bg-white rounded-lg shadow-inner overflow-hidden border border-gray-200">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={`Diamond ${view} visualization`}
            fill
            className="object-contain p-4"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Image not available
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Diamond Visualizer</h2>
      
      {/* View selector tabs */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => setView('cut')}
          className={cn(
            "px-4 py-2 font-medium text-sm",
            view === 'cut' 
              ? "border-b-2 border-blue-500 text-blue-600" 
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Diamond Cut
        </button>
        <button
          onClick={() => setView('color')}
          className={cn(
            "px-4 py-2 font-medium text-sm",
            view === 'color' 
              ? "border-b-2 border-blue-500 text-blue-600" 
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Diamond Color
        </button>
        <button
          onClick={() => setView('clarity')}
          className={cn(
            "px-4 py-2 font-medium text-sm",
            view === 'clarity' 
              ? "border-b-2 border-blue-500 text-blue-600" 
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Diamond Clarity
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Diamond visualization */}
        <div>
          {renderRingView()}
          
          <div className="mt-4 text-center text-sm text-gray-600">
            {view === 'cut' && `Showing ${cut} cut`}
            {view === 'color' && `Showing color grade ${color.toUpperCase()}`}
            {view === 'clarity' && `Showing clarity grade ${clarity.toUpperCase()}`}
          </div>
        </div>
        
        {/* Controls for cut/color/clarity */}
        <div>
          {view === 'cut' && (
            <div>
              <h3 className="font-semibold mb-3">Diamond Cut</h3>
              <p className="text-sm text-gray-600 mb-4">
                The cut of a diamond determines how well it reflects light, affecting its brilliance and fire.
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(DIAMOND_ASSETS.cuts).map((cutType) => (
                  <button
                    key={cutType}
                    onClick={() => setCut(cutType)}
                    className={cn(
                      "py-2 px-3 rounded-md text-sm",
                      cut === cutType 
                        ? "bg-blue-100 text-blue-700 border border-blue-200" 
                        : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                    )}
                  >
                    {cutType.charAt(0).toUpperCase() + cutType.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {view === 'color' && (
            <div>
              <h3 className="font-semibold mb-3">Diamond Color</h3>
              <p className="text-sm text-gray-600 mb-4">
                Diamond color grades range from D (colorless) to Z (light yellow). The more colorless, the higher the value.
              </p>
              
              <div className="grid grid-cols-4 gap-2">
                {Object.keys(DIAMOND_ASSETS.colors).map((colorGrade) => (
                  <button
                    key={colorGrade}
                    onClick={() => setColor(colorGrade)}
                    className={cn(
                      "h-12 rounded-md flex items-center justify-center",
                      color === colorGrade 
                        ? "bg-blue-100 text-blue-700 border-2 border-blue-300" 
                        : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                    )}
                  >
                    {colorGrade.toUpperCase()}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 flex justify-between text-xs text-gray-500">
                <span>Colorless</span>
                <span>Near Colorless</span>
                <span>Faint Color</span>
              </div>
            </div>
          )}
          
          {view === 'clarity' && (
            <div>
              <h3 className="font-semibold mb-3">Diamond Clarity</h3>
              <p className="text-sm text-gray-600 mb-4">
                Clarity refers to the absence of inclusions and blemishes, ranging from FL (Flawless) to I3 (Included).
              </p>
              
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(DIAMOND_ASSETS.clarity).map((clarityGrade) => (
                  <button
                    key={clarityGrade}
                    onClick={() => setClarity(clarityGrade)}
                    className={cn(
                      "py-2 px-1 rounded-md text-sm",
                      clarity === clarityGrade 
                        ? "bg-blue-100 text-blue-700 border border-blue-200" 
                        : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                    )}
                  >
                    {clarityGrade.toUpperCase()}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 flex justify-between text-xs text-gray-500">
                <span>Flawless</span>
                <span>Very Slightly Included</span>
                <span>Included</span>
              </div>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-800 mb-2">Pro Tip</h4>
            {view === 'cut' && (
              <p className="text-sm text-blue-700">
                The cut is considered the most important of the 4Cs as it has the greatest influence on a diamond's sparkle.
              </p>
            )}
            {view === 'color' && (
              <p className="text-sm text-blue-700">
                Most people can't tell the difference between color grades D-F with the naked eye, so G-H offers excellent value.
              </p>
            )}
            {view === 'clarity' && (
              <p className="text-sm text-blue-700">
                VS1 and VS2 clarity grades are considered the sweet spot, as inclusions are invisible to the naked eye.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 