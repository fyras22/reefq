'use client';

import { useState, useEffect, useRef } from 'react';
import { ScaleIcon, ViewfinderCircleIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

export default function InteractiveSizeGuide({ jewelryType = 'ring', onSizeSelect }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [measurementMethod, setMeasurementMethod] = useState('circumference');
  const [measurementUnit, setMeasurementUnit] = useState('mm');
  const [customMeasurement, setCustomMeasurement] = useState('');
  const [calculatedSize, setCalculatedSize] = useState(null);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [screenPPI, setScreenPPI] = useState(96); // Default PPI
  const rulerRef = useRef(null);
  
  const ringGuide = [
    { size: 'US 4', circumference: 46.8, diameter: 14.9 },
    { size: 'US 5', circumference: 49.3, diameter: 15.7 },
    { size: 'US 6', circumference: 51.9, diameter: 16.5 },
    { size: 'US 7', circumference: 54.4, diameter: 17.3 },
    { size: 'US 8', circumference: 56.9, diameter: 18.1 },
    { size: 'US 9', circumference: 59.5, diameter: 18.9 },
    { size: 'US 10', circumference: 62.0, diameter: 19.7 },
    { size: 'US 11', circumference: 64.6, diameter: 20.6 },
    { size: 'US 12', circumference: 67.1, diameter: 21.4 },
  ];

  const braceletGuide = [
    { size: 'XS', circumference: 152, wristWidth: '5.5-6.0' },
    { size: 'S', circumference: 165, wristWidth: '6.0-6.5' },
    { size: 'M', circumference: 178, wristWidth: '6.5-7.0' },
    { size: 'L', circumference: 190, wristWidth: '7.0-7.5' },
    { size: 'XL', circumference: 203, wristWidth: '7.5-8.0' },
  ];

  const necklaceGuide = [
    { size: '14"', length: 35.6, style: 'Collar' },
    { size: '16"', length: 40.6, style: 'Choker' },
    { size: '18"', length: 45.7, style: 'Princess' },
    { size: '20"', length: 50.8, style: 'Matinee' },
    { size: '24"', length: 61.0, style: 'Opera' },
    { size: '30"', length: 76.2, style: 'Rope' },
  ];
  
  const calibrateScreen = () => {
    setIsCalibrating(true);
    // This would ideally prompt user to place a credit card or ruler against the screen
    // For demo purposes, we'll just set a more realistic PPI
    setTimeout(() => {
      setScreenPPI(96);
      setIsCalibrating(false);
    }, 2000);
  };
  
  const calculateSize = () => {
    if (!customMeasurement || isNaN(parseFloat(customMeasurement))) {
      alert('Please enter a valid measurement');
      return;
    }
    
    let value = parseFloat(customMeasurement);
    
    // Convert inches to mm if needed
    if (measurementUnit === 'in') {
      value = value * 25.4;
    }
    
    // For diameter, convert to circumference for rings
    if (jewelryType === 'ring' && measurementMethod === 'diameter') {
      value = value * Math.PI;
    }
    
    let guide;
    let property;
    let result;
    
    if (jewelryType === 'ring') {
      guide = ringGuide;
      property = 'circumference';
    } else if (jewelryType === 'bracelet') {
      guide = braceletGuide;
      property = 'circumference';
    } else {
      guide = necklaceGuide;
      property = 'length';
    }
    
    // Find the closest size
    let minDiff = Infinity;
    
    for (const item of guide) {
      const diff = Math.abs(value - item[property]);
      if (diff < minDiff) {
        minDiff = diff;
        result = item;
      }
    }
    
    setCalculatedSize(result);
    setSelectedSize(result.size);
    
    if (onSizeSelect) {
      onSizeSelect({
        size: result.size,
        jewelryType,
        measurement: value,
        unit: measurementUnit,
        method: measurementMethod
      });
    }
  };
  
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    
    if (onSizeSelect) {
      const sizeObject = jewelryType === 'ring' 
        ? ringGuide.find(item => item.size === size)
        : jewelryType === 'bracelet'
          ? braceletGuide.find(item => item.size === size)
          : necklaceGuide.find(item => item.size === size);
          
      onSizeSelect({
        size,
        jewelryType,
        ...(sizeObject || {})
      });
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto text-gray-800">
      <h3 className="text-xl font-semibold mb-4">Interactive Size Guide</h3>
      
      {/* Jewelry Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Jewelry Type</label>
        <div className="flex flex-wrap gap-3">
          {['ring', 'bracelet', 'necklace'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedSize(null) || setJewelryType(type)}
              className={`py-2 px-4 rounded-lg font-medium text-sm transition ${
                jewelryType === type
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Measurement Method */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Measurement Method</label>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setMeasurementMethod('circumference')}
            className={`flex items-center py-2 px-4 rounded-lg font-medium text-sm transition ${
              measurementMethod === 'circumference'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ScaleIcon className="h-4 w-4 mr-2" />
            Circumference
          </button>
          
          {jewelryType === 'ring' && (
            <button
              onClick={() => setMeasurementMethod('diameter')}
              className={`flex items-center py-2 px-4 rounded-lg font-medium text-sm transition ${
                measurementMethod === 'diameter'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ViewfinderCircleIcon className="h-4 w-4 mr-2" />
              Diameter
            </button>
          )}
          
          <button
            onClick={() => setMeasurementMethod('select')}
            className={`flex items-center py-2 px-4 rounded-lg font-medium text-sm transition ${
              measurementMethod === 'select'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ArrowsPointingOutIcon className="h-4 w-4 mr-2" />
            Select Standard Size
          </button>
        </div>
      </div>
      
      {/* Measurement Input */}
      {(measurementMethod === 'circumference' || measurementMethod === 'diameter') && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {measurementMethod === 'circumference' ? 'Circumference' : 'Diameter'}
          </label>
          <div className="flex">
            <input
              type="number"
              value={customMeasurement}
              onChange={(e) => setCustomMeasurement(e.target.value)}
              className="rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm flex-1 p-2"
              placeholder="Enter measurement"
            />
            <select
              value={measurementUnit}
              onChange={(e) => setMeasurementUnit(e.target.value)}
              className="rounded-r-md border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm p-2"
            >
              <option value="mm">mm</option>
              <option value="in">inches</option>
            </select>
          </div>
          <div className="mt-4">
            <button
              onClick={calculateSize}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Calculate Size
            </button>
            <button
              onClick={calibrateScreen}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Calibrate Screen
            </button>
          </div>
          
          {isCalibrating && (
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">Calibrating... Please place a credit card against your screen.</p>
              {/* This would be replaced with an actual calibration UI */}
              <div className="h-2 w-full bg-blue-100 mt-2">
                <div className="h-2 bg-blue-600 animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Size Selection */}
      {measurementMethod === 'select' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Size</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {(jewelryType === 'ring' ? ringGuide : jewelryType === 'bracelet' ? braceletGuide : necklaceGuide).map((item) => (
              <button
                key={item.size}
                onClick={() => handleSizeSelect(item.size)}
                className={`py-2 px-3 border rounded-md text-sm transition ${
                  selectedSize === item.size
                    ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.size}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Results */}
      {calculatedSize && (
        <div className="mt-6 p-4 bg-indigo-50 rounded-md">
          <h4 className="font-semibold text-indigo-900">Your Recommended Size</h4>
          <p className="text-xl font-bold text-indigo-700 mt-1">{calculatedSize.size}</p>
          <div className="mt-2 text-sm text-indigo-800">
            {jewelryType === 'ring' && (
              <>
                <p>Circumference: {calculatedSize.circumference} mm</p>
                <p>Diameter: {calculatedSize.diameter} mm</p>
              </>
            )}
            {jewelryType === 'bracelet' && (
              <>
                <p>Wrist Size: {calculatedSize.wristWidth} inches</p>
                <p>Circumference: {calculatedSize.circumference} mm</p>
              </>
            )}
            {jewelryType === 'necklace' && (
              <>
                <p>Length: {calculatedSize.length} cm</p>
                <p>Style: {calculatedSize.style}</p>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Tips */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h4 className="font-medium text-gray-900 mb-2">Measurement Tips</h4>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          {jewelryType === 'ring' && (
            <>
              <li>Measure at the end of the day when your fingers are at their largest</li>
              <li>Use a piece of string around your finger and then measure it against a ruler</li>
              <li>Ensure the ring slides over your knuckle with slight resistance</li>
            </>
          )}
          {jewelryType === 'bracelet' && (
            <>
              <li>Measure around the widest part of your wrist</li>
              <li>Add 1/2 inch to your wrist measurement for a comfortable fit</li>
              <li>For a looser fit, add 3/4 to 1 inch to your measurement</li>
            </>
          )}
          {jewelryType === 'necklace' && (
            <>
              <li>Measure around your neck and add 2-4 inches for desired hanging length</li>
              <li>For chokers, add 2 inches to your neck measurement</li>
              <li>For pendant necklaces, consider the pendant size when choosing length</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
} 