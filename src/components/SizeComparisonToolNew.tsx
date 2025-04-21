"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  diameterToUSRingSize,
  convertRingSize,
  convertToInches,
  convertToCentimeters,
  ringSizes,
  braceletSizes,
  necklaceSizes,
  earringSizes
} from '../utils/sizeConversions';

interface SizeComparisonToolProps {
  jewelryType: 'ring' | 'bracelet' | 'necklace' | 'earrings';
  initialSize?: string | number;
  onSizeChange?: (size: string | number) => void;
}

const SizeComparisonToolNew: React.FC<SizeComparisonToolProps> = ({
  jewelryType,
  initialSize,
  onSizeChange
}) => {
  // State to manage the current selected size
  const [selectedSize, setSelectedSize] = useState<string | number>(
    initialSize || 
    (jewelryType === 'ring' ? 7 : // Default to US 7
     jewelryType === 'bracelet' ? 'M' : // Default to Medium
     jewelryType === 'necklace' ? 18 : // Default to 18"
     'Medium') // Default to Medium for earrings
  );

  // State for measurement tool
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
      return ringSize ? ringSize.diameter : 1.8; // Convert mm to cm
    }
    
    if (jewelryType === 'bracelet') {
      // For bracelets, use the circumference
      const braceletSize = typeof selectedSize === 'string' 
        ? braceletSizes.find(size => size.size === selectedSize)
        : null;
      
      return braceletSize ? parseFloat(braceletSize.cm.toString().split('-')[0]) : 18;
    }
    
    if (jewelryType === 'necklace') {
      // For necklaces, use half the length (to show radius)
      const necklaceSize = necklaceSizes.find(size => size.inches === selectedSize);
      return necklaceSize ? necklaceSize.cm / 2 : 23; // Half the cm length for radius
    }
    
    // Default return
    return 2;
  };
  
  // Get common object comparisons for the current size
  const getSizeComparisons = () => {
    if (jewelryType === 'ring') {
      const ringSize = ringSizes.find(size => size.us === selectedSize);
      const diameter = ringSize ? ringSize.diameter * 10 : 18; // Convert cm to mm
      
      return [
        diameter < 15 ? 'Smaller than a dime' : 
        diameter < 18 ? 'About the size of a dime' :
        diameter < 20 ? 'Between a dime and a penny' :
        diameter < 23 ? 'About the size of a penny' :
        'Larger than a penny'
      ];
    }
    
    if (jewelryType === 'bracelet') {
      const braceletSize = typeof selectedSize === 'string'
        ? braceletSizes.find(size => size.size === selectedSize)
        : null;
      
      const circumference = braceletSize 
        ? parseFloat(braceletSize.cm.toString().split('-')[0]) 
        : 18;
      
      return [
        circumference < 15 ? 'Similar to a small wrist watch' :
        circumference < 18 ? 'About the size of an average wrist watch' :
        circumference < 21 ? 'Similar to a large wrist watch' :
        'Larger than most wrist watches'
      ];
    }
    
    if (jewelryType === 'necklace') {
      const length = typeof selectedSize === 'number' ? selectedSize : 18;
      
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
                    ? 'bg-indigo-600 text-white'
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
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {size.size} ({size.cm}cm)
              </button>
            ))}
          </div>
        );
        
      case 'necklace':
        return (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {necklaceSizes.map((size) => (
              <button
                key={size.type}
                onClick={() => setSelectedSize(size.inches)}
                className={`py-2 px-3 rounded-md text-sm ${
                  selectedSize === size.inches
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {size.inches}" ({size.type})
              </button>
            ))}
          </div>
        );
        
      case 'earrings':
        return (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {earringSizes.map((size) => (
              <button
                key={size.type}
                onClick={() => setSelectedSize(size.type)}
                className={`py-2 px-3 rounded-md text-sm ${
                  selectedSize === size.type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {size.type} ({size.mm}mm)
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
              <p className="text-2xl">{ringSize.diameter * 10} mm</p>
            </div>
          </div>
        );
        
      case 'bracelet':
        const braceletSize = typeof selectedSize === 'string'
          ? braceletSizes.find(size => size.size === selectedSize)
          : null;
          
        if (!braceletSize) return null;
        
        return (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">Size</h4>
              <p className="text-2xl">{braceletSize.size}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">CM Range</h4>
              <p className="text-lg">{braceletSize.cm}cm</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">Inches</h4>
              <p className="text-2xl">{braceletSize.inches}"</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">Best For</h4>
              <p className="text-lg">Wrist size {braceletSize.cm}</p>
            </div>
          </div>
        );
        
      case 'necklace':
        const necklaceSize = necklaceSizes.find(size => size.inches === selectedSize);
        if (!necklaceSize) return null;
        
        return (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">Length</h4>
              <p className="text-2xl">{necklaceSize.inches} inches</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">Style</h4>
              <p className="text-lg">{necklaceSize.type}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">CM Length</h4>
              <p className="text-2xl">{necklaceSize.cm} cm</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">Description</h4>
              <p className="text-lg">{necklaceSize.description}</p>
            </div>
          </div>
        );
        
      case 'earrings':
        const earringSize = typeof selectedSize === 'string'
          ? earringSizes.find(size => size.type === selectedSize)
          : null;
          
        if (!earringSize) return null;
        
        return (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">Type</h4>
              <p className="text-2xl">{earringSize.type}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium mb-1">Size</h4>
              <p className="text-lg">{earringSize.mm}mm</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md" style={{ gridColumn: "span 2" }}>
              <h4 className="font-medium mb-1">Description</h4>
              <p className="text-lg">{earringSize.description}</p>
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
            className="bg-indigo-200 border-2 border-indigo-500 rounded-full flex items-center justify-center"
            style={{
              width: `${jewelryType === 'ring' ? getVisualSize() * 2 : getVisualSize()}cm`,
              height: `${jewelryType === 'ring' ? getVisualSize() * 2 : getVisualSize()}cm`,
              maxWidth: '90%',
              maxHeight: '90%'
            }}
          >
            {jewelryType === 'ring' && <div className="w-[40%] h-[40%] bg-white rounded-full"></div>}
            {jewelryType === 'necklace' && <div className="text-xs text-center text-indigo-600">Necklace<br/>Radius</div>}
          </div>
        </div>
        
        {/* Common comparisons toggle */}
        <button 
          onClick={() => setShowComparisons(!showComparisons)}
          className="w-full mt-2 text-indigo-600 text-sm hover:underline flex items-center justify-center"
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
              value={measurementValue || ''}
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
              className="bg-indigo-600 text-white py-2 px-4 rounded-md text-sm hover:bg-indigo-700"
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
      <div className="text-sm text-gray-600 p-3 bg-indigo-50 rounded-md">
        <h4 className="font-medium mb-2 text-indigo-600">Sizing Tips</h4>
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
};

export default SizeComparisonToolNew; 