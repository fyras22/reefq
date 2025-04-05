'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ArrowPathIcon, 
  CameraIcon, 
  CheckIcon, 
  QuestionMarkCircleIcon,
  InformationCircleIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { 
  RING_SIZE_CHART, 
  RingSizeChart, 
  REFERENCE_OBJECTS, 
  ReferenceObject,
  RING_WIDTH_ADJUSTMENTS,
  TEMPERATURE_ADJUSTMENTS,
  TIME_ADJUSTMENTS,
  findRingSizeByCircumference,
  findRingSizeByDiameter,
  diameterToCircumference,
  circumferenceToDiameter,
  findClosestReferenceObject,
  getSurroundingSizes
} from '@/data/ringSizeData';

interface MeasurementMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export function FingerSizeCalculator() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [fingerDiameter, setFingerDiameter] = useState<number | null>(null);
  const [referenceObject, setReferenceObject] = useState<ReferenceObject>(REFERENCE_OBJECTS[0]);
  const [objectWidth, setObjectWidth] = useState<number | null>(null);
  const [fingerSize, setFingerSize] = useState<RingSizeChart | null>(null);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Advanced adjustment states
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [ringWidth, setRingWidth] = useState("< 2mm");
  const [temperature, setTemperature] = useState("Normal (70-80°F/21-27°C)");
  const [timeOfDay, setTimeOfDay] = useState("Midday (10am-2pm)");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const methods: MeasurementMethod[] = [
    {
      id: 'string',
      name: 'String Method',
      description: 'Use a string or strip of paper to measure your finger circumference.',
      icon: <div className="h-6 w-6 text-nile-teal">🧵</div>
    },
    {
      id: 'reference',
      name: 'Reference Object',
      description: 'Compare with a common object of known size.',
      icon: <div className="h-6 w-6 text-nile-teal">📏</div>
    },
    {
      id: 'upload',
      name: 'Photo Upload',
      description: 'Upload a photo of your finger next to a reference object.',
      icon: <CameraIcon className="h-6 w-6 text-nile-teal" />
    },
    {
      id: 'existing',
      name: 'Existing Ring',
      description: 'Measure a ring that already fits well.',
      icon: <div className="h-6 w-6 text-nile-teal">💍</div>
    }
  ];

  // Calculate ring size based on diameter with adjustments
  useEffect(() => {
    if (fingerDiameter) {
      // Apply adjustments
      let adjustedDiameter = fingerDiameter;
      
      if (showAdvancedOptions) {
        // Ring width adjustment
        const widthAdjustment = RING_WIDTH_ADJUSTMENTS.find(adj => adj.width === ringWidth);
        if (widthAdjustment) {
          adjustedDiameter += widthAdjustment.adjustment;
        }
        
        // Temperature adjustment
        const tempAdjustment = TEMPERATURE_ADJUSTMENTS.find(adj => adj.condition === temperature);
        if (tempAdjustment) {
          adjustedDiameter += tempAdjustment.adjustment;
        }
        
        // Time of day adjustment
        const timeAdjustment = TIME_ADJUSTMENTS.find(adj => adj.time === timeOfDay);
        if (timeAdjustment) {
          adjustedDiameter += timeAdjustment.adjustment;
        }
      }
      
      setFingerSize(findRingSizeByDiameter(adjustedDiameter));
    }
  }, [fingerDiameter, showAdvancedOptions, ringWidth, temperature, timeOfDay]);

  // Handle string method submission
  const handleStringMethodSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const circumference = parseFloat(formData.get('circumference') as string);
    
    if (isNaN(circumference) || circumference <= 0) {
      setError('Please enter a valid measurement.');
      return;
    }
    
    // Calculate diameter from circumference
    const diameter = circumferenceToDiameter(circumference);
    setFingerDiameter(diameter);
    setError(null);
  };

  // Handle reference object method submission
  const handleReferenceMethodSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const ratio = parseFloat(formData.get('ratio') as string);
    
    if (isNaN(ratio) || ratio <= 0 || ratio > 2) {
      setError('Please enter a valid ratio between 0.1 and 2.');
      return;
    }
    
    // Calculate finger diameter using the reference object and ratio
    const diameter = referenceObject.diameter * ratio;
    setFingerDiameter(diameter);
    setError(null);
  };

  // Handle existing ring method submission
  const handleExistingRingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const diameter = parseFloat(formData.get('diameter') as string);
    
    if (isNaN(diameter) || diameter <= 0) {
      setError('Please enter a valid diameter.');
      return;
    }
    
    setFingerDiameter(diameter);
    setError(null);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setError(null);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.onload = () => {
        // Improved implementation would analyze the image
        // For now, we'll just set a placeholder value
        setFingerDiameter(17.3); // Placeholder value (size 7 US)
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const resetMeasurement = () => {
    setSelectedMethod(null);
    setFingerDiameter(null);
    setFingerSize(null);
    setError(null);
    setShowAdvancedOptions(false);
    setRingWidth("< 2mm");
    setTemperature("Normal (70-80°F/21-27°C)");
    setTimeOfDay("Midday (10am-2pm)");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Get similar size recommendations
  const getSimilarSizes = () => {
    if (!fingerSize) return [];
    return getSurroundingSizes(fingerSize.usSize);
  };

  // Find a reference object close to the current finger size
  const getNearbyReferenceObject = () => {
    if (!fingerSize) return null;
    return findClosestReferenceObject(fingerSize.diameterMM);
  };

  // ReferenceObjects display component
  function ReferenceObjectsDisplay({ 
    selectedObject, 
    onSelect 
  }: { 
    selectedObject: ReferenceObject, 
    onSelect: (obj: ReferenceObject) => void 
  }) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-3">
        {REFERENCE_OBJECTS.map((object) => (
          <div 
            key={object.name}
            onClick={() => onSelect(object)}
            className={`cursor-pointer border rounded-lg p-2 ${
              selectedObject.name === object.name 
                ? 'border-nile-teal bg-nile-teal/5' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="aspect-square relative rounded-md overflow-hidden mb-2">
              <Image
                src={object.image}
                alt={object.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 50vw, 100px"
              />
            </div>
            <div className="text-xs text-center">
              <div className="font-medium text-gray-800">{object.name}</div>
              <div className="text-gray-500">{object.diameter.toFixed(1)}mm</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-3xl mx-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-nile-teal mb-2">Ring Size Calculator</h2>
        <p className="text-gray-600 mb-6">
          Determine your perfect ring size using one of our measurement methods.
        </p>
        
        {/* Advanced options toggle */}
        {(selectedMethod || fingerSize) && (
          <div className="mb-4">
            <button 
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="flex items-center text-sm text-nile-teal hover:text-pharaonic-gold"
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4 mr-1" />
              {showAdvancedOptions ? 'Hide advanced options' : 'Show advanced options'}
            </button>
          </div>
        )}
        
        {/* Advanced options panel */}
        {showAdvancedOptions && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-gray-50 rounded-lg p-4 mb-6"
          >
            <h3 className="text-md font-medium text-gray-900 mb-3">Fine-tune your measurement:</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Ring Width */}
              <div>
                <label htmlFor="ringWidth" className="block text-sm font-medium text-gray-700 mb-1">
                  Ring Width
                </label>
                <select
                  id="ringWidth"
                  value={ringWidth}
                  onChange={(e) => setRingWidth(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-nile-teal text-sm"
                >
                  {RING_WIDTH_ADJUSTMENTS.map((adj) => (
                    <option key={adj.width} value={adj.width}>
                      {adj.width} {adj.adjustment > 0 ? `(+${adj.adjustment})` : adj.adjustment < 0 ? `(${adj.adjustment})` : ''}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Wider bands need larger sizes</p>
              </div>
              
              {/* Temperature */}
              <div>
                <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature
                </label>
                <select
                  id="temperature"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-nile-teal text-sm"
                >
                  {TEMPERATURE_ADJUSTMENTS.map((adj) => (
                    <option key={adj.condition} value={adj.condition}>
                      {adj.condition} {adj.adjustment > 0 ? `(+${adj.adjustment})` : adj.adjustment < 0 ? `(${adj.adjustment})` : ''}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Fingers swell in heat, shrink in cold</p>
              </div>
              
              {/* Time of Day */}
              <div>
                <label htmlFor="timeOfDay" className="block text-sm font-medium text-gray-700 mb-1">
                  Time of Day
                </label>
                <select
                  id="timeOfDay"
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-nile-teal text-sm"
                >
                  {TIME_ADJUSTMENTS.map((adj) => (
                    <option key={adj.time} value={adj.time}>
                      {adj.time} {adj.adjustment > 0 ? `(+${adj.adjustment})` : adj.adjustment < 0 ? `(${adj.adjustment})` : ''}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Fingers often swell in the evening</p>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Result display */}
        {fingerSize && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-pharaonic-gold/10 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-pharaonic-gold flex items-center">
                  <CheckIcon className="h-5 w-5 mr-2" />
                  Your Ring Size
                </h3>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">US</span>
                    <p className="text-2xl font-bold">{fingerSize.usSize}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">UK</span>
                    <p className="text-2xl font-bold">{fingerSize.ukSize}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">EU</span>
                    <p className="text-2xl font-bold">{fingerSize.euSize}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Diameter: {fingerSize.diameterMM.toFixed(1)}mm | 
                  Circumference: {fingerSize.circumferenceMM.toFixed(1)}mm
                </p>
              </div>
              <button 
                onClick={resetMeasurement}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Similar sizes */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Similar sizes:</h4>
              <div className="flex flex-wrap gap-2">
                {getSimilarSizes().map((size) => (
                  <div 
                    key={size.usSize} 
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      size.usSize === fingerSize.usSize 
                        ? 'bg-pharaonic-gold text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    US {size.usSize} | {size.diameterMM.toFixed(1)}mm
                  </div>
                ))}
              </div>
            </div>
            
            {/* Comparable object */}
            {getNearbyReferenceObject() && (
              <div className="mt-4 text-sm text-gray-600">
                <p>Similar in size to: <strong>{getNearbyReferenceObject()?.name}</strong> ({getNearbyReferenceObject()?.diameter.toFixed(1)}mm)</p>
              </div>
            )}
            
            <div className="mt-4 pt-2 border-t border-pharaonic-gold/20">
              <p className="text-sm text-gray-600">
                For the best fit, we recommend trying on rings in your calculated size before making a purchase, 
                as finger sizes can vary with temperature and time of day.
              </p>
            </div>
          </motion.div>
        )}
        
        {/* Method selection */}
        {!selectedMethod && !fingerSize && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Select a measurement method:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {methods.map((method) => (
                <motion.button
                  key={method.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedMethod(method.id)}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-left transition-colors border border-gray-200 flex items-start"
                >
                  <div className="mr-4 mt-1">{method.icon}</div>
                  <div>
                    <h4 className="font-medium text-gray-900">{method.name}</h4>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}
        
        {/* String method */}
        {selectedMethod === 'string' && !fingerSize && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">String Method</h3>
              <button 
                onClick={resetMeasurement}
                className="text-sm text-nile-teal hover:text-pharaonic-gold"
              >
                Change method
              </button>
            </div>
            
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                  <li>Wrap a piece of string or paper strip around your finger where the ring will sit.</li>
                  <li>Mark the point where the string or paper overlaps to form a complete circle.</li>
                  <li>Measure the length from the starting point to the mark in millimeters.</li>
                  <li>Enter this measurement below.</li>
                </ol>
              </div>
              
              <div className="flex justify-center mb-4">
                <Image 
                  src="/images/size-string-method.jpg" 
                  alt="String measurement method" 
                  width={300} 
                  height={200}
                  className="rounded-lg shadow-md"
                />
              </div>
              
              <form onSubmit={handleStringMethodSubmit}>
                <div className="mb-4">
                  <label htmlFor="circumference" className="block text-sm font-medium text-gray-700 mb-1">
                    Circumference (mm)
                  </label>
                  <input
                    type="number"
                    id="circumference"
                    name="circumference"
                    step="0.1"
                    min="40"
                    max="80"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nile-teal"
                    placeholder="e.g., 54.4"
                  />
                </div>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-nile-teal text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Calculate My Size
                </button>
              </form>
            </div>
          </motion.div>
        )}
        
        {/* Reference object method */}
        {selectedMethod === 'reference' && !fingerSize && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Reference Object Method</h3>
              <button 
                onClick={resetMeasurement}
                className="text-sm text-nile-teal hover:text-pharaonic-gold"
              >
                Change method
              </button>
            </div>
            
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                  <li>Select a common reference object from the options below.</li>
                  <li>Compare your finger width to the object's diameter.</li>
                  <li>Estimate the ratio of your finger's diameter to the object's diameter.</li>
                  <li>Enter this ratio below (e.g., if your finger is half the width, enter 0.5).</li>
                </ol>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Select a reference object:</h4>
                <ReferenceObjectsDisplay 
                  selectedObject={referenceObject} 
                  onSelect={setReferenceObject} 
                />
              </div>
              
              <form onSubmit={handleReferenceMethodSubmit}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1">
                    <label htmlFor="ratio" className="block text-sm font-medium text-gray-700 mb-1">
                      Ratio (finger width / object width)
                    </label>
                    <input
                      type="number"
                      id="ratio"
                      name="ratio"
                      step="0.01"
                      min="0.1"
                      max="2"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nile-teal"
                      placeholder="e.g., 0.7"
                    />
                  </div>
                  <div className="flex-none">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">×</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Object Width
                    </label>
                    <div className="px-4 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-700">
                      {referenceObject.diameter.toFixed(1)} mm
                    </div>
                  </div>
                </div>
                
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-nile-teal text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Calculate My Size
                </button>
              </form>
            </div>
          </motion.div>
        )}
        
        {/* Photo upload method */}
        {selectedMethod === 'upload' && !fingerSize && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Photo Upload Method</h3>
              <button 
                onClick={resetMeasurement}
                className="text-sm text-nile-teal hover:text-pharaonic-gold"
              >
                Change method
              </button>
            </div>
            
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                  <li>Place a coin or credit card next to your finger.</li>
                  <li>Take a photo ensuring both the reference object and your finger are clearly visible.</li>
                  <li>Upload the photo, and we'll calculate your ring size.</li>
                </ol>
                <div className="flex items-start mt-3 text-xs bg-yellow-50 p-2 rounded border border-yellow-200">
                  <InformationCircleIcon className="h-4 w-4 text-yellow-500 mr-1 flex-shrink-0 mt-0.5" />
                  <p className="text-yellow-700">
                    Note: This method provides an estimate. For the most accurate measurement, we recommend using 
                    the string method or visiting a jeweler.
                  </p>
                </div>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
                <input
                  type="file"
                  id="photo"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <CameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-4">
                  Drag and drop your photo here, or click to select
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-nile-teal text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Upload Photo
                </button>
              </div>
              
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            </div>
          </motion.div>
        )}
        
        {/* Existing ring method */}
        {selectedMethod === 'existing' && !fingerSize && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Existing Ring Method</h3>
              <button 
                onClick={resetMeasurement}
                className="text-sm text-nile-teal hover:text-pharaonic-gold"
              >
                Change method
              </button>
            </div>
            
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                  <li>Find a ring that fits the intended finger well.</li>
                  <li>Measure the internal diameter of the ring in millimeters.</li>
                  <li>Enter this measurement below.</li>
                </ol>
                <div className="flex items-center justify-center mt-3">
                  <div className="relative h-32 w-32">
                    <Image 
                      src="/images/ring-diameter.jpg" 
                      alt="Ring diameter measurement" 
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleExistingRingSubmit}>
                <div className="mb-4">
                  <label htmlFor="diameter" className="block text-sm font-medium text-gray-700 mb-1">
                    Internal Diameter (mm)
                  </label>
                  <input
                    type="number"
                    id="diameter"
                    name="diameter"
                    step="0.1"
                    min="13"
                    max="25"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nile-teal"
                    placeholder="e.g., 17.3"
                  />
                </div>
                
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                
                <button
                  type="submit"
                  className="w-full bg-nile-teal text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Calculate My Size
                </button>
              </form>
            </div>
          </motion.div>
        )}
        
        {/* Size chart toggle button */}
        <div className="px-6 pb-6 flex justify-center">
          <button 
            onClick={() => setShowSizeChart(!showSizeChart)} 
            className="flex items-center text-nile-teal hover:text-pharaonic-gold text-sm font-medium"
          >
            {showSizeChart ? 'Hide size chart' : 'View complete size chart'}
            <QuestionMarkCircleIcon className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        {/* Size chart table */}
        {showSizeChart && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="px-6 pb-6"
          >
            <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        US Size
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        UK Size
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        EU Size
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Diameter (mm)
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Circumference (mm)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {RING_SIZE_CHART.map((size) => (
                      <tr key={size.usSize} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {size.usSize}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {size.ukSize}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {size.euSize}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {size.diameterMM.toFixed(1)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {size.circumferenceMM.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 