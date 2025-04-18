'use client';

import { useState } from 'react';
import RingViewer from '@/components/demo/RingViewer';
import ImageUploader from '@/components/demo/ImageUploader';


// Preset gold colors with realistic hex values
const GOLD_COLORS = {
  yellow: '#FFD700', // Yellow gold
  white: '#E8E8E8',  // White gold
  pink: '#E0BFB8',   // Rose/pink gold
};

// Preset diamond colors with more realistic values
const DIAMOND_COLORS = {
  colorless: '#F0FFFF', // D-F color (colorless)
  nearColorless: '#F4FFFA', // G-J color (near colorless)
  champagne: '#F9F2E7', // Light champagne diamond
};

export default function DemoPage() {
  const [metalColor, setMetalColor] = useState(GOLD_COLORS.white);
  const [gemColor, setGemColor] = useState(DIAMOND_COLORS.champagne);
  const [useSketchfab, setUseSketchfab] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  // Setting a fixed size and enabling auto-rotate by default
  const size = 1;
  const autoRotate = true;

  const handleImagesSelected = (files: File[]) => {
    setSelectedImages(files);
    console.log('Selected images:', files);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">3D Reconstruction Demo</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Instructions */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Images</h2>
              <p className="text-gray-600 mb-6">
                Upload 5-7 images of your object from different angles. For best results:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>Ensure good lighting</li>
                <li>Capture from multiple angles (at least 30° apart)</li>
                <li>Keep the object centered in the frame</li>
                <li>Use a stable camera or tripod</li>
              </ul>

              <ImageUploader 
                onImagesSelected={handleImagesSelected}
                maxImages={7}
                maxFileSize={5 * 1024 * 1024} // 5MB
                supportedFormats={['image/jpeg', 'image/png', 'image/webp']}
              />
            </div>
            

          </div>

          {/* Right Column: 3D Viewer and Customization */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">3D Ring Preview</h2>
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">View Mode:</label>
                  <select
                    value={useSketchfab ? 'sketchfab' : 'custom'}
                    onChange={(e) => setUseSketchfab(e.target.value === 'sketchfab')}
                    className="px-3 py-1 rounded border border-gray-300 text-sm"
                  >
                    <option value="sketchfab">Sketchfab Model</option>
                    <option value="custom">Custom Model</option>
                  </select>
                </div>
              </div>
              
              <RingViewer
                metalColor={metalColor}
                gemColor={gemColor}
                size={size}
                initialRotation={[0, 0, 0]}
                useSketchfab={useSketchfab}
                sketchfabId="551b52524d4b4e7c889657cb741abe1e"
                autoRotate={autoRotate}
              />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Customize Ring</h2>
              
              {!useSketchfab && (
                <div className="space-y-6">
                  {/* Gold Color Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Gold Color
                    </label>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setMetalColor(GOLD_COLORS.yellow)}
                        className={`flex items-center justify-center w-24 h-10 rounded-md transition-all ${
                          metalColor === GOLD_COLORS.yellow 
                            ? 'ring-2 ring-brand-teal bg-yellow-50' 
                            : 'bg-gray-50 hover:bg-yellow-50'
                        }`}
                        aria-label="Yellow Gold"
                      >
                        <span className="w-5 h-5 rounded-full mr-2" style={{ backgroundColor: GOLD_COLORS.yellow }}></span>
                        <span>Yellow</span>
                      </button>
                      
                      <button
                        onClick={() => setMetalColor(GOLD_COLORS.white)}
                        className={`flex items-center justify-center w-24 h-10 rounded-md transition-all ${
                          metalColor === GOLD_COLORS.white 
                            ? 'ring-2 ring-brand-teal bg-gray-50' 
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        aria-label="White Gold"
                      >
                        <span className="w-5 h-5 rounded-full mr-2 border border-gray-200" style={{ backgroundColor: GOLD_COLORS.white }}></span>
                        <span>White</span>
                      </button>
                      
                      <button
                        onClick={() => setMetalColor(GOLD_COLORS.pink)}
                        className={`flex items-center justify-center w-24 h-10 rounded-md transition-all ${
                          metalColor === GOLD_COLORS.pink 
                            ? 'ring-2 ring-brand-teal bg-red-50' 
                            : 'bg-gray-50 hover:bg-red-50'
                        }`}
                        aria-label="Rose Gold"
                      >
                        <span className="w-5 h-5 rounded-full mr-2" style={{ backgroundColor: GOLD_COLORS.pink }}></span>
                        <span>Pink</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Diamond Color Selection with more realistic options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Diamond Color
                    </label>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setGemColor(DIAMOND_COLORS.colorless)}
                        className={`flex items-center justify-center w-full sm:w-auto px-4 h-10 rounded-md transition-all ${
                          gemColor === DIAMOND_COLORS.colorless 
                            ? 'ring-2 ring-brand-teal bg-blue-50' 
                            : 'bg-gray-50 hover:bg-blue-50'
                        }`}
                        aria-label="Colorless Diamond"
                      >
                        <span className="w-5 h-5 rounded-full mr-2 border border-gray-200 relative overflow-hidden" style={{ backgroundColor: DIAMOND_COLORS.colorless }}>
                          <span className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-white/40"></span>
                        </span>
                        <span>Colorless (D-F)</span>
                      </button>
                      
                      <button
                        onClick={() => setGemColor(DIAMOND_COLORS.nearColorless)}
                        className={`flex items-center justify-center w-full sm:w-auto px-4 h-10 rounded-md transition-all ${
                          gemColor === DIAMOND_COLORS.nearColorless 
                            ? 'ring-2 ring-brand-teal bg-blue-50' 
                            : 'bg-gray-50 hover:bg-blue-50'
                        }`}
                        aria-label="Near Colorless Diamond"
                      >
                        <span className="w-5 h-5 rounded-full mr-2 border border-gray-200 relative overflow-hidden" style={{ backgroundColor: DIAMOND_COLORS.nearColorless }}>
                          <span className="absolute inset-0 bg-gradient-to-br from-white/70 via-transparent to-white/30"></span>
                        </span>
                        <span>Near Colorless (G-J)</span>
                      </button>
                      
                      <button
                        onClick={() => setGemColor(DIAMOND_COLORS.champagne)}
                        className={`flex items-center justify-center w-full sm:w-auto px-4 h-10 rounded-md transition-all ${
                          gemColor === DIAMOND_COLORS.champagne 
                            ? 'ring-2 ring-brand-teal bg-amber-50' 
                            : 'bg-gray-50 hover:bg-amber-50'
                        }`}
                        aria-label="Champagne Diamond"
                      >
                        <span className="w-5 h-5 rounded-full mr-2 border border-gray-200 relative overflow-hidden" style={{ backgroundColor: DIAMOND_COLORS.champagne }}>
                          <span className="absolute inset-0 bg-gradient-to-br from-amber-50/70 via-transparent to-amber-100/30"></span>
                        </span>
                        <span>Champagne</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {useSketchfab && (
                <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                  Customization options are available in custom model view
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 