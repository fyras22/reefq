'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, ArrowPathIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { ZoomInIcon, ZoomOutIcon } from '@heroicons/react/24/outline';

// Sizing guides for different jewelry types
const SIZING_GUIDES = {
  rings: [
    { size: 'US 4', circumference: 46.8, diameter: 14.9 },
    { size: 'US 5', circumference: 49.3, diameter: 15.7 },
    { size: 'US 6', circumference: 51.9, diameter: 16.5 },
    { size: 'US 7', circumference: 54.4, diameter: 17.3 },
    { size: 'US 8', circumference: 56.9, diameter: 18.1 },
    { size: 'US 9', circumference: 59.5, diameter: 18.9 },
    { size: 'US 10', circumference: 62.0, diameter: 19.7 },
    { size: 'US 11', circumference: 64.6, diameter: 20.6 },
    { size: 'US 12', circumference: 67.1, diameter: 21.4 }
  ],
  bracelets: [
    { size: 'XS', circumference: 152, wristWidth: '5.5-6.0' },
    { size: 'S', circumference: 165, wristWidth: '6.0-6.5' },
    { size: 'M', circumference: 178, wristWidth: '6.5-7.0' },
    { size: 'L', circumference: 190, wristWidth: '7.0-7.5' },
    { size: 'XL', circumference: 203, wristWidth: '7.5-8.0' }
  ],
  necklaces: [
    { size: '14"', length: 35.6, style: 'Collar' },
    { size: '16"', length: 40.6, style: 'Choker' },
    { size: '18"', length: 45.7, style: 'Princess' },
    { size: '20"', length: 50.8, style: 'Matinee' },
    { size: '22"', length: 55.9, style: 'Matinee' },
    { size: '24"', length: 61.0, style: 'Opera' },
    { size: '30"', length: 76.2, style: 'Opera' },
    { size: '36"', length: 91.4, style: 'Rope' }
  ]
};

export default function SizeCalculator({ onMeasurementComplete }) {
  const [jewelryType, setJewelryType] = useState('rings');
  const [currentStep, setCurrentStep] = useState(1);
  const [measurements, setMeasurements] = useState({
    circumference: 0,
    diameter: 0,
    method: '',
    measurementUnit: 'mm'
  });
  const [result, setResult] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  
  // Ring sizer calibration and state
  const [ringSizerScale, setRingSizerScale] = useState(1);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [screenDPI, setScreenDPI] = useState(96); // Default DPI
  const ringSizerRef = useRef(null);
  
  // Virtual ruler state and refs
  const [rulerValue, setRulerValue] = useState(0);
  const rulerValueRef = useRef(0);
  const rulerRef = useRef(null);

  // Calibrate the screen for accurate measurements
  useEffect(() => {
    if (measurements.method === 'ringsizer' || measurements.method === 'virtualruler') {
      // Try to calibrate screen DPI
      const testDiv = document.createElement('div');
      testDiv.style.width = '1in';
      testDiv.style.height = '1in';
      testDiv.style.visibility = 'hidden';
      document.body.appendChild(testDiv);
      
      const detectedDPI = testDiv.offsetWidth;
      if (detectedDPI > 0) {
        setScreenDPI(detectedDPI);
      }
      
      document.body.removeChild(testDiv);
    }
  }, [measurements.method]);

  // Handle measurement input change
  const handleMeasurementChange = useCallback((e) => {
    const { name, value } = e.target;
    setMeasurements(prevMeasurements => ({
      ...prevMeasurements,
      [name]: value
    }));
  }, []);

  // Handle jewelry type change
  const handleJewelryTypeChange = useCallback((type) => {
    setJewelryType(type);
    setCurrentStep(1);
    setMeasurements({
      circumference: 0,
      diameter: 0,
      method: '',
      measurementUnit: 'mm'
    });
    setResult(null);
  }, []);

  // Handle measurement method selection
  const selectMethod = useCallback((method) => {
    // Use the functional update pattern to avoid stale state
    setMeasurements(prevMeasurements => ({
      ...prevMeasurements,
      method,
      // Reset method-specific values
      ...(method === 'circumference' ? { circumference: prevMeasurements.circumference || 0 } : {}),
      ...(method === 'diameter' ? { diameter: prevMeasurements.diameter || 0 } : {})
    }));
    
    // Update step
    setCurrentStep(2);
    
    // Reset specific method state values
    if (method === 'ringsizer') {
      setRingSizerScale(1);
      setIsCalibrated(false);
    } else if (method === 'virtualruler') {
      setRulerValue(0);
    }
  }, []);

  // Calculate the size based on measurements
  const calculateSize = useCallback(() => {
    let sizeResult = null;
    
    // For rings
    if (jewelryType === 'rings') {
      let value = 0;
      const { method, circumference, diameter, measurementUnit } = measurements;
      
      if (method === 'circumference') {
        value = parseFloat(circumference);
        // Convert to mm if in inches
        if (measurementUnit === 'in') {
          value = value * 25.4;
        }
      } else if (method === 'diameter') {
        value = parseFloat(diameter);
        // Convert to mm if in inches
        if (measurementUnit === 'in') {
          value = value * 25.4;
        }
        // Convert diameter to circumference
        value = value * Math.PI;
      } else if (method === 'ringsizer') {
        // The diameter is calculated based on ring sizer scale and base size
        const baseDiameter = 20; // Base diameter in mm
        value = (baseDiameter * ringSizerScale) * Math.PI; // Convert to circumference
      } else if (method === 'virtualruler') {
        // Ruler value is already in mm for circumference
        value = rulerValue;
      }
      
      // Find the closest ring size
      const sizes = SIZING_GUIDES.rings;
      let closestSize = sizes[0];
      let minDiff = Math.abs(value - sizes[0].circumference);
      
      for (let i = 1; i < sizes.length; i++) {
        const diff = Math.abs(value - sizes[i].circumference);
        if (diff < minDiff) {
          minDiff = diff;
          closestSize = sizes[i];
        }
      }
      
      sizeResult = {
        size: closestSize.size,
        circumference: closestSize.circumference,
        diameter: closestSize.diameter,
        measurementUsed: method,
        valueUsed: method === 'circumference' ? circumference : 
                   method === 'diameter' ? diameter : 
                   method === 'ringsizer' ? (baseDiameter * ringSizerScale).toFixed(1) : 
                   rulerValue.toFixed(1),
        unit: method === 'ringsizer' || method === 'virtualruler' ? 'mm' : measurementUnit
      };
    }
    
    // For bracelets
    else if (jewelryType === 'bracelets') {
      const { circumference, measurementUnit } = measurements;
      let value = parseFloat(circumference);
      
      // Convert to mm if in inches
      if (measurementUnit === 'in') {
        value = value * 25.4;
      }
      
      // Find the closest bracelet size
      const sizes = SIZING_GUIDES.bracelets;
      let closestSize = sizes[0];
      let minDiff = Math.abs(value - sizes[0].circumference);
      
      for (let i = 1; i < sizes.length; i++) {
        const diff = Math.abs(value - sizes[i].circumference);
        if (diff < minDiff) {
          minDiff = diff;
          closestSize = sizes[i];
        }
      }
      
      sizeResult = {
        size: closestSize.size,
        circumference: closestSize.circumference,
        wristWidth: closestSize.wristWidth,
        valueUsed: circumference,
        unit: measurementUnit
      };
    }
    
    // For necklaces
    else if (jewelryType === 'necklaces') {
      // Calculate necklace size based on neck circumference + desired hanging length
      const { circumference, measurementUnit } = measurements;
      let value = parseFloat(circumference);
      
      // Convert to cm if in inches
      if (measurementUnit === 'in') {
        value = value * 2.54;
      }
      
      // Add 5cm (2 inches) for comfort
      const recommendedLength = value + 5;
      
      // Find the closest necklace size
      const sizes = SIZING_GUIDES.necklaces;
      let closestSize = sizes[0];
      let minDiff = Math.abs(recommendedLength - sizes[0].length);
      
      for (let i = 1; i < sizes.length; i++) {
        const diff = Math.abs(recommendedLength - sizes[i].length);
        if (diff < minDiff) {
          minDiff = diff;
          closestSize = sizes[i];
        }
      }
      
      sizeResult = {
        size: closestSize.size,
        length: closestSize.length,
        style: closestSize.style,
        recommendedLength,
        valueUsed: circumference,
        unit: measurementUnit
      };
    }
    
    setResult(sizeResult);
    setCurrentStep(3);
    
    // Notify parent component
    if (onMeasurementComplete) {
      onMeasurementComplete({
        type: jewelryType,
        size: sizeResult.size,
        measurements,
        timestamp: new Date().toISOString()
      });
    }
  }, [jewelryType, measurements, ringSizerScale, rulerValue, onMeasurementComplete]);
  
  // Handle ring sizer scale change
  const adjustRingSizerScale = useCallback((adjustment) => {
    // Calculate new scale without changing state yet
    const newScale = Math.max(0.5, Math.min(2.0, ringSizerScale + adjustment));
    
    // Calculate new diameter
    const baseDiameter = 20; // Base diameter in mm
    const newDiameter = (baseDiameter * newScale).toFixed(1);
    
    // Batch state updates
    setRingSizerScale(newScale);
    
    // Update measurements separately to avoid nested state updates
    setMeasurements(prev => ({
      ...prev,
      diameter: newDiameter
    }));
  }, [ringSizerScale]);
  
  // Set up simplified virtual ruler handling with refs
  useEffect(() => {
    if (measurements.method !== 'virtualruler' || !rulerRef.current) return;
    
    let isDragging = false;
    
    const onMouseDown = (e) => {
      isDragging = true;
      const rect = rulerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(500, e.clientX - rect.left));
      rulerValueRef.current = x;
      setRulerValue(x);
    };
    
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const rect = rulerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(500, e.clientX - rect.left));
      rulerValueRef.current = x;
      setRulerValue(x);
    };
    
    const onMouseUp = () => {
      isDragging = false;
    };
    
    // Add event listeners to the ruler element
    rulerRef.current.addEventListener('mousedown', onMouseDown);
    
    // Add window event listeners
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    
    return () => {
      if (rulerRef.current) {
        rulerRef.current.removeEventListener('mousedown', onMouseDown);
      }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [measurements.method]);

  const resetCalculator = useCallback(() => {
    setCurrentStep(1);
    setMeasurements({
      circumference: 0,
      diameter: 0,
      method: '',
      measurementUnit: 'mm'
    });
    setResult(null);
    setRingSizerScale(1);
    setRulerValue(0);
  }, []);

  // Handle step navigation
  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Jewelry Type Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Select Jewelry Type</h2>
        <div className="grid grid-cols-3 gap-4">
          {['rings', 'bracelets', 'necklaces'].map((type) => (
            <button
              key={type}
              onClick={() => handleJewelryTypeChange(type)}
              className={`py-3 px-4 rounded-lg font-medium text-center transition ${
                jewelryType === type
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Size Calculator Steps */}
      <div className="border-t border-gray-200 pt-6">
        {/* Step 1: Choose Measurement Method */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">How would you like to measure?</h3>
            <div className="mb-4">
              <p className="block text-sm font-medium text-gray-700 mb-2">Method</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <button
                  type="button"
                  onClick={() => selectMethod('circumference')}
                  className={`flex items-center justify-center px-4 py-3 border rounded-md text-xs sm:text-sm ${
                    measurements.method === 'circumference'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a15 15 0 0 1 0 20" />
                  </svg>
                  Circumference
                </button>
                <button
                  type="button"
                  onClick={() => selectMethod('diameter')}
                  className={`flex items-center justify-center px-4 py-3 border rounded-md text-xs sm:text-sm ${
                    measurements.method === 'diameter'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                  </svg>
                  Diameter
                </button>
                <button
                  type="button"
                  onClick={() => selectMethod('ringsizer')}
                  className={`flex items-center justify-center px-4 py-3 border rounded-md text-xs sm:text-sm ${
                    measurements.method === 'ringsizer'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="8" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                  Ring Sizer
                </button>
                <button
                  type="button"
                  onClick={() => selectMethod('virtualruler')}
                  className={`flex items-center justify-center px-4 py-3 border rounded-md text-xs sm:text-sm ${
                    measurements.method === 'virtualruler'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 12h20M4 8v8M8 6v12M12 8v8M16 6v12M20 8v8" />
                  </svg>
                  Virtual Ruler
                </button>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Sizing Guide</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  {jewelryType === 'rings' 
                    ? 'For the most accurate ring size, measure your finger at the end of the day when your fingers are warmest.'
                    : jewelryType === 'bracelets'
                    ? 'Measure your wrist just below the wrist bone for the most accurate bracelet size.'
                    : 'Measure around the base of your neck for the most accurate necklace size.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Enter Measurements */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Enter Your Measurements</h3>
              <button 
                onClick={() => goToStep(1)}
                className="text-sm text-primary hover:text-primary/80 flex items-center"
              >
                <ArrowPathIcon className="h-4 w-4 mr-1" />
                Change method
              </button>
            </div>
            
            {/* Standard measurement inputs */}
            {(measurements.method === 'circumference' || measurements.method === 'diameter') && (
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="mb-4">
                  <label htmlFor={measurements.method} className="block text-sm font-medium text-gray-700 mb-1">
                    {measurements.method === 'circumference' ? 'Circumference' : 'Diameter'} 
                    {jewelryType === 'rings' 
                      ? ' of your finger'
                      : jewelryType === 'bracelets'
                      ? ' of your wrist'
                      : ' of your neck'}
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      step="0.1"
                      name={measurements.method}
                      id={measurements.method}
                      value={measurements[measurements.method] || ''}
                      onChange={handleMeasurementChange}
                      className="grow p-2 border border-gray-300 rounded-l-md focus:ring-primary focus:border-primary"
                      placeholder="Enter measurement"
                    />
                    <select
                      name="measurementUnit"
                      value={measurements.measurementUnit}
                      onChange={handleMeasurementChange}
                      className="p-2 border border-gray-300 rounded-r-md bg-white focus:ring-primary focus:border-primary"
                    >
                      <option value="mm">mm</option>
                      <option value="in">in</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="relative h-2 bg-gray-200 rounded">
                    <div 
                      className="absolute h-2 bg-primary rounded"
                      style={{ 
                        width: `${Math.min(100, (measurements[measurements.method] || 0) * (measurements.method === 'circumference' ? 1.5 : 5))}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Small</span>
                    <span>Medium</span>
                    <span>Large</span>
                  </div>
                </div>
                
                <button
                  onClick={() => calculateSize()}
                  disabled={!measurements[measurements.method]}
                  className={`w-full py-2 rounded-md text-center font-medium transition ${
                    measurements[measurements.method]
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Calculate Size
                </button>
              </div>
            )}
            
            {/* Ring Sizer Tool */}
            {measurements.method === 'ringsizer' && (
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Place your ring on the circle below and adjust the size until it matches perfectly
                  </p>
                  <div className="relative inline-block">
                    <div 
                      ref={ringSizerRef}
                      className="rounded-full border-2 border-primary mx-auto"
                      style={{ 
                        width: `${40 * ringSizerScale}mm`,
                        height: `${40 * ringSizerScale}mm`,
                        backgroundColor: 'rgba(196, 162, 101, 0.1)'
                      }}
                    ></div>
                    
                    <div className="flex justify-center mt-4 space-x-4">
                      <button
                        onClick={() => adjustRingSizerScale(-0.05)}
                        className="p-2 bg-white rounded-full shadow text-gray-700 hover:bg-gray-100"
                      >
                        <ZoomOutIcon className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => adjustRingSizerScale(0.05)}
                        className="p-2 bg-white rounded-full shadow text-gray-700 hover:bg-gray-100"
                      >
                        <ZoomInIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-sm font-medium text-gray-700">
                    Estimated Diameter: {(20 * ringSizerScale).toFixed(1)} mm
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Resize the circle until your ring fits perfectly on it
                  </p>
                </div>
                
                <button
                  onClick={() => calculateSize()}
                  className="w-full py-2 rounded-md text-center font-medium bg-primary text-white hover:bg-primary/90"
                >
                  Calculate Size
                </button>
                </div>
              )}
              
            {/* Virtual Ruler Tool */}
            {measurements.method === 'virtualruler' && (
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Place a string around your finger, mark the length, then measure it on our virtual ruler
                  </p>
                  
                  <div 
                    ref={rulerRef}
                    className="h-12 mx-auto my-6 bg-white rounded-lg shadow-inner overflow-hidden relative cursor-ew-resize"
                  >
                    {/* Ruler markings */}
                    <div className="flex h-full">
                      {Array.from({ length: 100 }).map((_, i) => (
                        <div key={i} className="h-full flex flex-col items-center" style={{ width: '5mm' }}>
                          <div className={`w-px bg-gray-400 ${i % 10 === 0 ? 'h-1/2' : i % 5 === 0 ? 'h-1/3' : 'h-1/4'}`}></div>
                          {i % 10 === 0 && (
                            <span className="text-xs text-gray-600 absolute -bottom-0">{i}</span>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Measurement indicator */}
                    <div 
                      className="absolute top-0 h-full border-r-2 border-primary"
                      style={{ left: `${rulerValue}mm` }}
                    >
                      <div className="absolute -top-6 -translate-x-1/2 bg-primary text-white text-xs px-2 py-1 rounded">
                        {rulerValue.toFixed(1)} mm
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    <span className="font-medium">Instructions:</span> Click and drag left/right on the ruler to measure your string
                  </p>
                </div>
              
              <button
                  onClick={() => calculateSize()}
                  disabled={rulerValue <= 0}
                  className={`w-full py-2 rounded-md text-center font-medium transition ${
                    rulerValue > 0
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Calculate Size
              </button>
            </div>
            )}
            
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Tips for Accurate Measurement</h4>
              <ul className="text-sm text-blue-700 list-disc list-inside">
                {measurements.method === 'ringsizer' ? (
                  <>
                    <li>Use a ring that fits well on the intended finger</li>
                    <li>Place the ring directly on your screen for best results</li>
                    <li>Adjust the circle until the inner edge matches your ring</li>
                  </>
                ) : measurements.method === 'virtualruler' ? (
                  <>
                    <li>Use a non-stretchy string or paper strip around your finger</li>
                    <li>Mark where the string meets after wrapping around your finger</li>
                    <li>Lay the string flat on the screen and measure with our ruler</li>
                    <li>Don't pull the string too tight - it should be snug but comfortable</li>
                  </>
                ) : (
                  <>
                    <li>Use a flexible measuring tape for best results</li>
                    <li>Don't pull too tight - keep the tape snug but comfortable</li>
                    <li>Measure multiple times to ensure accuracy</li>
                    <li>If between sizes, choose the larger size</li>
                        </>
                      )}
              </ul>
              </div>
          </motion.div>
        )}

        {/* Step 3: Show Results */}
        {currentStep === 3 && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600">
              <CheckIcon className="h-10 w-10" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your Perfect Size</h3>
            <p className="text-gray-600 mb-6">Based on your measurements, here's your recommended size:</p>
            
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg mb-6">
              <div className="text-5xl font-bold text-primary mb-2">{result.size}</div>
              <p className="text-gray-600">
                {jewelryType === 'rings' 
                  ? `Ring Size`
                  : jewelryType === 'bracelets'
                  ? `Bracelet Size`
                  : `Necklace Size`}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500 mb-1">
                  {measurements.method === 'virtualruler' ? 'Circumference' :
                   measurements.method === 'ringsizer' ? 'Diameter' :
                   measurements.method === 'circumference' ? 'Circumference' : 'Diameter'}
                </div>
                <div className="font-medium text-gray-900">
                  {measurements.method === 'circumference' || measurements.method === 'virtualruler'
                    ? result.circumference 
                    : result.diameter} mm
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500 mb-1">
                  {jewelryType === 'necklaces' ? 'Style' : 'Your Measurement'}
                </div>
                <div className="font-medium text-gray-900">
                  {jewelryType === 'necklaces' 
                    ? result.style 
                    : `${result.valueUsed} ${result.unit}`}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <a
                href={`/jewelry?type=${jewelryType}&size=${result.size}`}
                className="w-full py-3 px-6 bg-primary text-white rounded-md font-medium hover:bg-primary/90 flex justify-center items-center"
              >
                Shop {jewelryType.slice(0, -1).charAt(0).toUpperCase() + jewelryType.slice(0, -1).slice(1)}s in Your Size
              </a>
              
              <button
                onClick={resetCalculator}
                className="w-full py-3 px-6 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50"
              >
                Calculate Another Size
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 