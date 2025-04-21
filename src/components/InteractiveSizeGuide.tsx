"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  ArrowsPointingOutIcon,
  ArrowsRightLeftIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline';

type JewelryType = 'ring' | 'bracelet' | 'necklace';
type MeasurementMethod = 'string' | 'ruler' | 'existing' | 'printable';

const InteractiveSizeGuide: React.FC = () => {
  const [jewelryType, setJewelryType] = useState<JewelryType>('ring');
  const [measurementMethod, setMeasurementMethod] = useState<MeasurementMethod>('string');
  const [showTip, setShowTip] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Reset the video when jewelry type changes
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(e => console.log('Video autoplay prevented:', e));
    }
  }, [jewelryType, measurementMethod]);

  const renderMeasurementInstructions = () => {
    switch (measurementMethod) {
      case 'string':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">String Method</h3>
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
              <video 
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster="/images/measurements/string-method-poster.jpg"
              >
                <source src={`/videos/measurements/${jewelryType}-string-method.mp4`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Take a piece of string, thread, or paper strip.</li>
              <li>{jewelryType === 'ring' 
                ? 'Wrap it around the base of your finger where you want to wear the ring.' 
                : jewelryType === 'bracelet' 
                ? 'Wrap it around your wrist at the point where you would wear your bracelet.'
                : 'Place it around your neck at the desired length.'
              }</li>
              <li>Mark the point where the string overlaps.</li>
              <li>Lay the string flat and measure the length with a ruler in millimeters.</li>
              <li>
                {jewelryType === 'ring' 
                  ? 'Use our size chart to find your ring size.' 
                  : jewelryType === 'bracelet'
                  ? 'Add 1-2 cm for comfort depending on your preference.'
                  : 'Choose a necklace length based on where you want it to sit on your chest.'
                }
              </li>
            </ol>
            <div className="mt-4 p-4 bg-yellow-50 rounded-md">
              <p className="text-sm text-yellow-700">
                <strong>Pro Tip:</strong> For the most accurate measurement, measure 2-3 times, especially if you're between sizes.
              </p>
            </div>
          </div>
        );
      
      case 'ruler':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Ruler Method</h3>
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
              <video 
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster="/images/measurements/ruler-method-poster.jpg"
              >
                <source src={`/videos/measurements/${jewelryType}-ruler-method.mp4`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="space-y-2 text-gray-600">
              {jewelryType === 'ring' ? (
                <>
                  <p>Direct measurement with a ruler:</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Measure the inside diameter of a ring that fits you well.</li>
                    <li>Measure in millimeters for the most accurate sizing.</li>
                    <li>Use our conversion chart to find your ring size.</li>
                  </ol>
                </>
              ) : jewelryType === 'bracelet' ? (
                <>
                  <p>Direct measurement with a ruler:</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Place a ruler directly against your wrist where you would wear the bracelet.</li>
                    <li>Measure in centimeters and add 1-2 cm for comfort.</li>
                    <li>For a tighter fit, add 1 cm; for a looser fit, add 2 cm.</li>
                  </ol>
                </>
              ) : (
                <>
                  <p>Direct measurement with a ruler:</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Use a measuring tape to measure from the base of your neck to your desired length.</li>
                    <li>Standard necklace lengths: Choker (14-16"), Princess (17-19"), Matinee (20-24"), Opera (28-36"), Rope (36"+).</li>
                    <li>Consider your neck size, height, and the style of clothing you typically wear.</li>
                  </ol>
                </>
              )}
            </div>
            <div className="mt-4 p-4 bg-yellow-50 rounded-md">
              <p className="text-sm text-yellow-700">
                <strong>Pro Tip:</strong> If measuring your finger, do so at the end of the day when your fingers may be slightly larger.
              </p>
            </div>
          </div>
        );
      
      case 'existing':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Using Existing Jewelry</h3>
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
              <video 
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster="/images/measurements/existing-method-poster.jpg"
              >
                <source src={`/videos/measurements/${jewelryType}-existing-method.mp4`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="space-y-2 text-gray-600">
              <p>This is often the most reliable method:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Find a piece of {jewelryType} that fits you perfectly.</li>
                <li>
                  {jewelryType === 'ring' 
                    ? 'Measure the inside diameter in millimeters.' 
                    : jewelryType === 'bracelet'
                    ? 'Measure its total length in centimeters.'
                    : 'Measure its total length in inches or centimeters.'
                  }
                </li>
                <li>Use our size charts to find the corresponding size.</li>
                <li>If you know the size of your existing piece, you can directly use that as reference.</li>
              </ol>
            </div>
            <div className="mt-4 p-4 bg-yellow-50 rounded-md">
              <p className="text-sm text-yellow-700">
                <strong>Pro Tip:</strong> Consider the width of the {jewelryType}. Wider pieces may require going up a size for comfort.
              </p>
            </div>
          </div>
        );
      
      case 'printable':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Printable Sizing Guide</h3>
            <div className="bg-gray-100 rounded-lg overflow-hidden p-4 text-center">
              <Image
                src={`/images/measurements/${jewelryType}-printable-guide.png`}
                alt={`Printable ${jewelryType} sizing guide`}
                width={400}
                height={300}
                className="mx-auto"
              />
            </div>
            <div className="space-y-2 text-gray-600">
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  <a 
                    href={`/pdfs/${jewelryType}-sizing-guide.pdf`} 
                    download
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Download our printable guide
                  </a>
                </li>
                <li>Print the PDF at 100% scale (no scaling).</li>
                <li>Verify the scale by measuring the reference line with a ruler.</li>
                <li>
                  {jewelryType === 'ring' 
                    ? 'Cut out the circles and find the one that fits your finger, or place an existing ring over the circles to find a match.' 
                    : jewelryType === 'bracelet'
                    ? 'Cut out the strip, wrap it around your wrist, and note the size where it overlaps.'
                    : 'Use the necklace length chart to determine your ideal length.'
                  }
                </li>
              </ol>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Important:</strong> Make sure your printer is set to "Actual Size" and not "Fit to Page" for accurate measurements.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="py-6 px-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Interactive Size Guide</h2>
        
        {/* Jewelry Type Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Select Jewelry Type</label>
          <div className="grid grid-cols-3 gap-4">
            {(['ring', 'bracelet', 'necklace'] as JewelryType[]).map((type) => (
              <button
                key={type}
                onClick={() => setJewelryType(type)}
                className={`
                  py-3 px-4 rounded-lg flex flex-col items-center justify-center text-center
                  ${jewelryType === type 
                    ? 'bg-indigo-100 border-2 border-indigo-500 text-indigo-700' 
                    : 'bg-gray-50 border border-gray-300 text-gray-600 hover:bg-gray-100'}
                `}
              >
                <div className="h-12 w-12 flex items-center justify-center mb-2">
                  <Image 
                    src={`/images/jewelry-icons/${type}-icon.svg`} 
                    alt={`${type} icon`}
                    width={40}
                    height={40}
                  />
                </div>
                <span className="capitalize">{type}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Measurement Method Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Select Measurement Method</label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {(['string', 'ruler', 'existing', 'printable'] as MeasurementMethod[]).map((method) => (
              <button
                key={method}
                onClick={() => setMeasurementMethod(method)}
                className={`
                  py-3 px-4 rounded-lg flex flex-col items-center justify-center text-center
                  ${measurementMethod === method 
                    ? 'bg-indigo-100 border-2 border-indigo-500 text-indigo-700' 
                    : 'bg-gray-50 border border-gray-300 text-gray-600 hover:bg-gray-100'}
                `}
              >
                <div className="h-8 w-8 flex items-center justify-center mb-1">
                  {method === 'string' && <ArrowsRightLeftIcon className="h-6 w-6" />}
                  {method === 'ruler' && <ArrowsPointingOutIcon className="h-6 w-6" />}
                  {method === 'existing' && <HandRaisedIcon className="h-6 w-6" />}
                  {method === 'printable' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  )}
                </div>
                <span className="capitalize text-sm">{method}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Instructions */}
        <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
          {renderMeasurementInstructions()}
        </div>
        
        {/* Additional Tips Toggle */}
        <div className="mt-8">
          <button
            onClick={() => setShowTip(!showTip)}
            className="text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 mr-2 transition-transform ${showTip ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {showTip ? 'Hide Additional Tips' : 'Show Additional Tips'}
          </button>
          
          {showTip && (
            <div className="mt-4 p-5 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Additional Tips for {jewelryType.charAt(0).toUpperCase() + jewelryType.slice(1)} Sizing</h4>
              <ul className="space-y-2 text-gray-600">
                {jewelryType === 'ring' && (
                  <>
                    <li>• Your fingers may change size throughout the day and seasons.</li>
                    <li>• Wider bands typically require a larger size than thinner bands.</li>
                    <li>• Your dominant hand is usually slightly larger.</li>
                    <li>• If you're between sizes, go with the larger size.</li>
                    <li>• Measure when your body temperature is normal for the most accurate size.</li>
                  </>
                )}
                {jewelryType === 'bracelet' && (
                  <>
                    <li>• Consider the bracelet style - chains need more room than cuffs or bangles.</li>
                    <li>• For chain bracelets, add 1-2 cm to your wrist measurement.</li>
                    <li>• For bangle bracelets, you should be able to slip it over your hand with slight resistance.</li>
                    <li>• If the bracelet has a clasp, you may need less additional room.</li>
                    <li>• Consider the weight of the bracelet - heavier pieces may sit more snugly.</li>
                  </>
                )}
                {jewelryType === 'necklace' && (
                  <>
                    <li>• Consider your neck size and height when choosing a necklace length.</li>
                    <li>• Choker: Sits tightly around the neck (14-16").</li>
                    <li>• Princess: Rests on the collarbone (17-19").</li>
                    <li>• Matinee: Falls between the collarbone and bust (20-24").</li>
                    <li>• Opera: Rests on the bust (28-36").</li>
                    <li>• Rope: Falls below the bust (36" or longer).</li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveSizeGuide; 