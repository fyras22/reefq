"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  diameterToUSRingSize,
  convertRingSize,
  convertToInches,
  convertToCentimeters
} from '../utils/sizeConversions';

// Define the size data structures
const ringSizes = [
  { us: 4, uk: 'H', eu: 47, diameterMm: 14.8 },
  { us: 4.5, uk: 'I', eu: 48, diameterMm: 15.3 },
  { us: 5, uk: 'J', eu: 49, diameterMm: 15.7 },
  { us: 5.5, uk: 'K', eu: 50, diameterMm: 16.1 },
  { us: 6, uk: 'L', eu: 51, diameterMm: 16.5 },
  { us: 6.5, uk: 'M', eu: 52, diameterMm: 16.9 },
  { us: 7, uk: 'N', eu: 54, diameterMm: 17.3 },
  { us: 7.5, uk: 'O', eu: 55, diameterMm: 17.7 },
  { us: 8, uk: 'P', eu: 56, diameterMm: 18.1 },
  { us: 8.5, uk: 'Q', eu: 57, diameterMm: 18.5 },
  { us: 9, uk: 'R', eu: 58, diameterMm: 18.9 },
  { us: 9.5, uk: 'S', eu: 59, diameterMm: 19.4 },
  { us: 10, uk: 'T', eu: 61, diameterMm: 19.8 }
];

const braceletSizes = [
  { size: 'XS', description: 'Extra Small', circumferenceCm: 14, fitDescription: 'Very Slim Wrist' },
  { size: 'S', description: 'Small', circumferenceCm: 16, fitDescription: 'Slim Wrist' },
  { size: 'M', description: 'Medium', circumferenceCm: 18, fitDescription: 'Average Wrist' },
  { size: 'L', description: 'Large', circumferenceCm: 20, fitDescription: 'Large Wrist' },
  { size: 'XL', description: 'Extra Large', circumferenceCm: 22, fitDescription: 'Very Large Wrist' }
];

const necklaceSizes = [
  { size: 16, description: 'Choker', lengthInches: 16, placement: 'Base of neck' },
  { size: 18, description: 'Princess', lengthInches: 18, placement: 'Collarbone' },
  { size: 20, description: 'Matinee', lengthInches: 20, placement: 'Just below collarbone' },
  { size: 22, description: 'Matinee', lengthInches: 22, placement: 'Above bust' },
  { size: 24, description: 'Opera', lengthInches: 24, placement: 'On bust' },
  { size: 30, description: 'Rope', lengthInches: 30, placement: 'Below bust' }
];

const earringSizes = [
  { size: 'Tiny', description: 'Very Small', diameterMm: 3, bestFor: 'Subtle everyday wear' },
  { size: 'Small', description: 'Small', diameterMm: 5, bestFor: 'Classic everyday look' },
  { size: 'Medium', description: 'Medium', diameterMm: 7, bestFor: 'Statement everyday wear' },
  { size: 'Large', description: 'Large', diameterMm: 10, bestFor: 'Bold statement look' }
];

interface SizeComparisonToolProps {
  jewelryType: 'ring' | 'bracelet' | 'necklace' | 'earrings';
  initialSize?: string | number;
  onSizeChange?: (size: string | number) => void;
}

export function SizeComparisonTool({
  jewelryType,
  initialSize,
  onSizeChange
}: SizeComparisonToolProps) {
  // State to manage the current selected size
  const [selectedSize, setSelectedSize] = useState<string | number>(
    initialSize || 
    (jewelryType === 'ring' ? ringSizes[4].us : // Default to US 7
     jewelryType === 'bracelet' ? braceletSizes[1].size : // Default to Medium
     jewelryType === 'necklace' ? necklaceSizes[1].size : // Default to 18"
     earringSizes[1].size) // Default to Medium
  );

  // State for measurement tool
  const [measurementMode, setMeasurementMode] = useState<boolean>(false);
  const [measurementValue, setMeasurementValue] = useState<number>(0);
  const [measurementUnit, setMeasurementUnit] = useState<'cm' | 'inches'>('cm');
  
  // State for common object comparisons
  const [showComparisons, setShowComparisons] = useState<boolean>(false);
  
  // Ref for visual reference
  const visualRef = useRef<HTMLDivElement>(null);
  
  // Update parent component when size changes
  useEffect(() => {
    if (onSizeChange) {
      onSizeChange(selectedSize);
    }
  }, [selectedSize, onSizeChange]);
  
  // Convert measurement value to size
  const convertMeasurementToSize = () => {
    // For rings, convert diameter to US ring size
    if (jewelryType === 'ring') {
      // If inches, convert to cm first
      const valueCm = measurementUnit === 'inches' 
        ? convertToCentimeters(measurementValue) 
        : measurementValue;
        
      const usSize = diameterToUSRingSize(valueCm);
      setSelectedSize(usSize);
      return;
    }
    
    // For bracelets and necklaces, simply set the measurement
    const valueInches = measurementUnit === 'cm' 
      ? convertToInches(measurementValue) 
      : measurementValue;
      
    setSelectedSize(valueInches);
  };
  
  // Get the visual display size for reference
  const getVisualSize = () => {
    if (jewelryType === 'ring') {
      // Find the ring with the matching US size
      const ringSize = ringSizes.find(size => size.us === selectedSize);
      return ringSize ? ringSize.diameterMm / 10 : 1.8; // Convert mm to cm
    }
    
    if (jewelryType === 'bracelet') {
      // For bracelets, use the circumference
      const bracelet = braceletSizes.find(size => size.size === selectedSize);
      return bracelet ? bracelet.circumferenceCm : 18;
    }
    
    if (jewelryType === 'necklace') {
      // For necklaces, use half the length (to show radius)
      const necklace = necklaceSizes.find(size => size.size === selectedSize);
      return necklace ? (necklace.lengthInches * 2.54) / 2 : 23; // Convert inches to cm and halve
    }
    
    // Default return
    return 2;
  };
  
  // Get common object comparisons for the current size
  const getSizeComparisons = () => {
    if (jewelryType === 'ring') {
      const diameter = ringSizes.find(size => size.us === selectedSize)?.diameterMm || 18;
      return [
        diameter < 15 ? 'Smaller than a dime' : 
        diameter < 18 ? 'About the size of a dime' :
        diameter < 20 ? 'Between a dime and a penny' :
        diameter < 23 ? 'About the size of a penny' :
        'Larger than a penny'
      ];
    }
    
    if (jewelryType === 'bracelet') {
      const circumference = braceletSizes.find(size => size.size === selectedSize)?.circumferenceCm || 18;
      return [
        circumference < 15 ? 'Similar to a small wrist watch' :
        circumference < 18 ? 'About the size of an average wrist watch' :
        circumference < 21 ? 'Similar to a large wrist watch' :
        'Larger than most wrist watches'
      ];
    }
    
    if (jewelryType === 'necklace') {
      const length = necklaceSizes.find(size => size.size === selectedSize)?.lengthInches || 18;
      return [
        length < 16 ? 'Sits at the base of the neck' :
        length < 18 ? 'Falls to the collarbone' :
        length < 20 ? 'Falls at or just below the collarbone' :
        length < 24 ? 'Falls above the bust' :
        'Falls at or below the bust'
      ];
    }
    
    return ['Size varies by style'];
  };

  // Render size options based on jewelry type
  const renderSizeOptions = () => {
    switch (jewelryType) {
      case 'ring':
        return (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {ringSizes.map((size) => (
              <button
                key={size.us}
                onClick={() => setSelectedSize(size.us)}
                className={`py-2 px-3 rounded-md text-sm ${
                  selectedSize === size.us
                    ? 'bg-nile-teal text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                US {size.us} / {size.uk} UK
              </button>
            ))}
          </div>
        );
        
      case 'bracelet':
        return (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {braceletSizes.map((size) => (
              <button
                key={size.size}
                onClick={() => setSelectedSize(size.size)}
                className={`py-2 px-3 rounded-md text-sm ${
                  selectedSize === size.size
                    ? 'bg-nile-teal text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {size.size} ({size.description})
              </button>
            ))}
          </div>
        );
        
      case 'necklace':
        return (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {necklaceSizes.map((size) => (
              <button
                key={size.size}
                onClick={() => setSelectedSize(size.size)}
                className={`py-2 px-3 rounded-md text-sm ${
                  selectedSize === size.size
                    ? 'bg-nile-teal text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {size.size}" ({size.description})
              </button>
            ))}
          </div>
        );
        
      case 'earrings':
        return (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {earringSizes.map((size) => (
              <button
                key={size.size}
                onClick={() => setSelectedSize(size.size)}
                className={`py-2 px-3 rounded-md text-sm ${
                  selectedSize === size.size
                    ? 'bg-nile-teal text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {size.size} ({size.description})
              </button>
            ))}
          </div>
        );
        
      default:
        return null;
    }
  };

  // Show detailed information for the current size
  const renderSizeDetails = () => {
    switch (jewelryType) {
      case 'ring':
        const ringSize = ringSizes.find(size => size.us === selectedSize);
        if (!ringSize) return null;
        
        return (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">US Size</h4>
              <p className="text-2xl">{ringSize.us}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">UK Size</h4>
              <p className="text-2xl">{ringSize.uk}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">EU Size</h4>
              <p className="text-2xl">{ringSize.eu}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">Diameter</h4>
              <p className="text-2xl">{ringSize.diameterMm} mm</p>
            </div>
          </div>
        );
        
      case 'bracelet':
        const braceletSize = braceletSizes.find(size => size.size === selectedSize);
        if (!braceletSize) return null;
        
        return (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">Size</h4>
              <p className="text-2xl">{braceletSize.size}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">Description</h4>
              <p className="text-lg">{braceletSize.description}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">Circumference</h4>
              <p className="text-2xl">{braceletSize.circumferenceCm} cm</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">Wrist Size</h4>
              <p className="text-lg">{braceletSize.fitDescription}</p>
            </div>
          </div>
        );
        
      case 'necklace':
        const necklaceSize = necklaceSizes.find(size => size.size === selectedSize);
        if (!necklaceSize) return null;
        
        return (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">Length</h4>
              <p className="text-2xl">{necklaceSize.size} inches</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">Style</h4>
              <p className="text-lg">{necklaceSize.description}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">CM Length</h4>
              <p className="text-2xl">{(necklaceSize.size * 2.54).toFixed(1)} cm</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">Placement</h4>
              <p className="text-lg">{necklaceSize.placement}</p>
            </div>
          </div>
        );
        
      case 'earrings':
        const earringSize = earringSizes.find(size => size.size === selectedSize);
        if (!earringSize) return null;
        
        return (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">Size</h4>
              <p className="text-2xl">{earringSize.size}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">Description</h4>
              <p className="text-lg">{earringSize.description}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">Diameter</h4>
              <p className="text-2xl">{earringSize.diameterMm} mm</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">Best For</h4>
              <p className="text-lg">{earringSize.bestFor}</p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Size Comparison Tool</h2>
      
      {/* Size Selection */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2 text-gray-700">Select Your {jewelryType.charAt(0).toUpperCase() + jewelryType.slice(1)} Size</h3>
        {renderSizeOptions()}
      </div>
      
      {/* Size Details */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-3 text-gray-700">Size Details</h3>
        {renderSizeDetails()}
      </div>
      
      {/* Visual Comparison */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-3 text-gray-700">Visual Reference</h3>
        <div className="flex justify-center items-center p-6 bg-gray-50 rounded-md" style={{ minHeight: '200px' }}>
          <div 
            ref={visualRef}
            className="bg-nile-teal/20 border-2 border-nile-teal rounded-full flex items-center justify-center"
            style={{
              width: `${jewelryType === 'ring' ? getVisualSize() * 2 : getVisualSize()}cm`,
              height: `${jewelryType === 'ring' ? getVisualSize() * 2 : getVisualSize()}cm`,
              maxWidth: '90%',
              maxHeight: '90%'
            }}
          >
            {jewelryType === 'ring' && <div className="w-[40%] h-[40%] bg-white rounded-full"></div>}
            {jewelryType === 'necklace' && <div className="text-xs text-center text-nile-teal">Necklace<br/>Radius</div>}
          </div>
        </div>
        
        {/* Common comparisons toggle */}
        <button 
          onClick={() => setShowComparisons(!showComparisons)}
          className="w-full mt-2 text-nile-teal text-sm hover:underline flex items-center justify-center"
        >
          {showComparisons ? 'Hide' : 'Show'} Common Object Comparisons
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showComparisons ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
          </svg>
        </button>
        
        {showComparisons && (
          <div className="mt-2 p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium mb-2 text-sm">Size References</h4>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {getSizeComparisons().map((comparison, index) => (
                <li key={index}>{comparison}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Measurement Tool */}
      <div className="mb-4">
        <h3 className="text-md font-medium mb-3 text-gray-700">Measure & Convert</h3>
        <div className="p-4 bg-gray-50 rounded-md">
          <div className="flex items-center gap-3 mb-4">
            <input
              type="number"
              min="0"
              step="0.1"
              value={measurementValue}
              onChange={(e) => setMeasurementValue(parseFloat(e.target.value) || 0)}
              className="flex-1 p-2 border border-gray-300 rounded-md"
              placeholder="Enter measurement"
            />
            <select
              value={measurementUnit}
              onChange={(e) => setMeasurementUnit(e.target.value as 'cm' | 'inches')}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="cm">cm</option>
              <option value="inches">inches</option>
            </select>
            <button
              onClick={convertMeasurementToSize}
              className="bg-nile-teal text-white py-2 px-4 rounded-md text-sm hover:bg-nile-teal/90"
            >
              Convert
            </button>
          </div>
          <p className="text-xs text-gray-500">
            {jewelryType === 'ring' 
              ? 'Enter the inner diameter of your ring' 
              : jewelryType === 'bracelet'
              ? 'Enter the circumference of your wrist'
              : 'Enter the desired length'}
          </p>
        </div>
      </div>
      
      {/* Sizing Tips */}
      <div className="text-sm text-gray-600 p-3 bg-nile-teal/5 rounded-md">
        <h4 className="font-medium mb-2 text-nile-teal">Sizing Tips</h4>
        <ul className="list-disc list-inside space-y-1">
          {jewelryType === 'ring' && (
            <>
              <li>For accuracy, measure at the end of the day when your fingers are at their largest</li>
              <li>If you're between sizes, we recommend sizing up</li>
              <li>Your dominant hand is typically 1/2 size larger</li>
            </>
          )}
          {jewelryType === 'bracelet' && (
            <>
              <li>Measure your wrist just below the wrist bone</li>
              <li>Add 1/2 inch to your wrist measurement for a comfortable fit</li>
              <li>For a looser fit, add 3/4 to 1 inch to your measurement</li>
            </>
          )}
          {jewelryType === 'necklace' && (
            <>
              <li>16-18" necklaces sit at or just below the collarbone</li>
              <li>20-24" necklaces are ideal for pendants</li>
              <li>Measure your neck and add 2-4 inches for comfort</li>
            </>
          )}
          {jewelryType === 'earrings' && (
            <>
              <li>Smaller studs (3-4mm) are ideal for everyday wear</li>
              <li>Medium studs (5-7mm) offer a balanced look</li>
              <li>Larger studs (8mm+) create a more dramatic statement</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default SizeComparisonTool; 