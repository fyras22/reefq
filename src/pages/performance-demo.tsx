import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { performanceMonitor } from '../utils/performanceMetrics';
import EnhancedJewelryViewer from '../components/EnhancedJewelryViewer';
import Link from 'next/link';

const DEMO_MODELS = [
  { name: 'Simple Ring', path: '/models/ring_simple.glb', triangles: '10k', complexity: 'Low' },
  { name: 'Diamond Ring', path: '/models/ring_diamond.glb', triangles: '50k', complexity: 'Medium' },
  { name: 'Complex Necklace', path: '/models/necklace.glb', triangles: '120k', complexity: 'High' },
  { name: 'Crown Jewels', path: '/models/crown.glb', triangles: '250k', complexity: 'Very High' },
];

// Define valid metal and gem types as per the EnhancedJewelryViewer component props
type MetalType = 'gold' | 'silver' | 'platinum' | 'rosegold' | 'whitegold';
type GemType = 'diamond' | 'ruby' | 'sapphire' | 'emerald' | 'amethyst' | 'topaz' | 'pearl';

const METAL_OPTIONS = [
  { id: 'gold' as MetalType, name: 'Gold', color: '#FFD700' },
  { id: 'silver' as MetalType, name: 'Silver', color: '#C0C0C0' },
  { id: 'platinum' as MetalType, name: 'Platinum', color: '#E5E4E2' },
  { id: 'rosegold' as MetalType, name: 'Rose Gold', color: '#B76E79' },
];

const GEM_OPTIONS = [
  { id: 'diamond' as GemType, name: 'Diamond', color: '#FFFFFF' },
  { id: 'ruby' as GemType, name: 'Ruby', color: '#E0115F' },
  { id: 'emerald' as GemType, name: 'Emerald', color: '#50C878' },
  { id: 'sapphire' as GemType, name: 'Sapphire', color: '#0F52BA' },
];

const QUALITY_OPTIONS = [
  { id: 'auto', name: 'Auto (Adaptive)', description: 'Automatically adjusts based on performance' },
  { id: 'ultra', name: 'Ultra', description: 'Maximum quality with ray tracing and bloom effects' },
  { id: 'high', name: 'High', description: 'Balanced quality with good shadows and effects' },
  { id: 'medium', name: 'Medium', description: 'Reduced quality with simplified lighting' },
  { id: 'low', name: 'Low', description: 'Minimal quality for low-end devices' },
];

type QualityOption = 'auto' | 'ultra' | 'high' | 'medium' | 'low';

const PerformanceDemoPage: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState(DEMO_MODELS[0]);
  const [selectedMetal, setSelectedMetal] = useState<MetalType>(METAL_OPTIONS[0].id);
  const [selectedGem, setSelectedGem] = useState<GemType>(GEM_OPTIONS[0].id);
  const [selectedQuality, setSelectedQuality] = useState<QualityOption>('auto');
  const [showPerformanceMetrics, setShowPerformanceMetrics] = useState(true);
  const [enableBloom, setEnableBloom] = useState(true);
  const [performanceStats, setPerformanceStats] = useState({
    fps: 0,
    score: 0,
    grade: 'N/A',
    quality: 'auto' as QualityOption
  });
  
  // Update performance stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const metrics = performanceMonitor.getMetrics();
      const score = performanceMonitor.getPerformanceScore();
      const grade = performanceMonitor.getPerformanceGrade();
      
      setPerformanceStats({
        fps: metrics.fps,
        score,
        grade,
        quality: metrics.quality as QualityOption
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Event handlers
  const handleModelChange = (model: typeof DEMO_MODELS[0]) => {
    setSelectedModel(model);
  };
  
  const handleQualityChange = (quality: QualityOption) => {
    setSelectedQuality(quality);
  };
  
  const handleMetalChange = (metalId: MetalType) => {
    setSelectedMetal(metalId);
  };
  
  const handleGemChange = (gemId: GemType) => {
    setSelectedGem(gemId);
  };
  
  return (
    <>
      <Head>
        <title>Performance Optimization Demo | Reefq</title>
        <meta name="description" content="Explore the performance optimization features of the Reefq 3D jewelry visualization platform" />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0 md:space-x-8">
          {/* Main content */}
          <div className="w-full md:w-2/3">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Performance Optimization Demo</h1>
              <p className="text-gray-600">
                Explore how Reefq automatically optimizes 3D rendering performance across different devices and models
              </p>
              <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 text-blue-700">
                <p className="text-sm">
                  Press <kbd className="px-2 py-1 bg-gray-100 rounded">F</kbd> to toggle the performance overlay, 
                  or try different models and quality settings to see how performance adapts.
                </p>
              </div>
            </div>
            
            {/* 3D Viewer */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <EnhancedJewelryViewer
                modelPath={selectedModel.path}
                selectedMetal={selectedMetal}
                selectedGem={selectedGem}
                environmentPreset="jewelry_store"
                quality={selectedQuality}
                enableBloom={enableBloom}
                showPerformanceMetrics={showPerformanceMetrics}
              />
            </div>
            
            {/* Performance Card */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Current Performance</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm">FPS</div>
                  <div className={`text-2xl font-mono ${performanceStats.fps < 30 ? 'text-red-500' : 'text-green-600'}`}>
                    {performanceStats.fps}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm">Score</div>
                  <div className="text-2xl font-mono">{performanceStats.score}/100</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm">Grade</div>
                  <div className={`text-2xl font-mono ${
                    performanceStats.grade === 'A' ? 'text-green-500' : 
                    performanceStats.grade === 'B' ? 'text-green-400' : 
                    performanceStats.grade === 'C' ? 'text-yellow-500' : 
                    performanceStats.grade === 'D' ? 'text-orange-500' : 
                    'text-red-500'
                  }`}>
                    {performanceStats.grade}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm">Active Quality</div>
                  <div className="text-2xl font-mono capitalize">
                    {performanceStats.quality}
                  </div>
                </div>
              </div>
            </div>
            
            {/* About LOD */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Level of Detail (LOD)</h2>
              <p className="mb-4">
                Reefq dynamically adjusts model complexity based on camera distance. Try zooming in and out to see the system 
                in action. Each model has 3 detail levels that are automatically switched based on distance and complexity.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-lg">High Detail</h3>
                  <p className="text-sm text-gray-600">Close viewing distance with full geometry and detailed materials</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-lg">Medium Detail</h3>
                  <p className="text-sm text-gray-600">Medium distance with 66% of original triangles</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-lg">Low Detail</h3>
                  <p className="text-sm text-gray-600">Far distance with 33% of original triangles, no shadows</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar controls */}
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Controls</h2>
            
            {/* Model selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Select Model</h3>
              <div className="space-y-2">
                {DEMO_MODELS.map(model => (
                  <button
                    key={model.path}
                    className={`w-full text-left px-4 py-2 rounded border ${selectedModel.path === model.path ? 'bg-blue-100 border-blue-300' : 'border-gray-200 hover:bg-gray-50'}`}
                    onClick={() => handleModelChange(model)}
                  >
                    <div className="flex justify-between items-center">
                      <span>{model.name}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {model.complexity} ({model.triangles})
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quality settings */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Quality Setting</h3>
              <div className="space-y-2">
                {QUALITY_OPTIONS.map(quality => (
                  <button
                    key={quality.id}
                    className={`w-full text-left px-4 py-2 rounded border ${selectedQuality === quality.id ? 'bg-blue-100 border-blue-300' : 'border-gray-200 hover:bg-gray-50'}`}
                    onClick={() => handleQualityChange(quality.id as QualityOption)}
                  >
                    <div>
                      <div className="font-medium">{quality.name}</div>
                      <div className="text-xs text-gray-500">{quality.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Metal selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Metal</h3>
              <div className="grid grid-cols-2 gap-2">
                {METAL_OPTIONS.map(metal => (
                  <button
                    key={metal.id}
                    className={`px-4 py-2 rounded border flex items-center ${selectedMetal === metal.id ? 'bg-blue-100 border-blue-300' : 'border-gray-200 hover:bg-gray-50'}`}
                    onClick={() => handleMetalChange(metal.id)}
                  >
                    <span className="w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: metal.color }}></span>
                    <span>{metal.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Gem selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Gemstone</h3>
              <div className="grid grid-cols-2 gap-2">
                {GEM_OPTIONS.map(gem => (
                  <button
                    key={gem.id}
                    className={`px-4 py-2 rounded border flex items-center ${selectedGem === gem.id ? 'bg-blue-100 border-blue-300' : 'border-gray-200 hover:bg-gray-50'}`}
                    onClick={() => handleGemChange(gem.id)}
                  >
                    <span className="w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: gem.color }}></span>
                    <span>{gem.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Additional options */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Additional Options</h3>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={showPerformanceMetrics}
                      onChange={() => setShowPerformanceMetrics(!showPerformanceMetrics)}
                    />
                    <div className="block bg-gray-300 w-10 h-5 rounded-full"></div>
                    <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition ${showPerformanceMetrics ? 'translate-x-5' : ''}`}></div>
                  </div>
                  <div className="ml-3">Show Performance Metrics</div>
                </label>
                
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={enableBloom}
                      onChange={() => setEnableBloom(!enableBloom)}
                    />
                    <div className="block bg-gray-300 w-10 h-5 rounded-full"></div>
                    <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition ${enableBloom ? 'translate-x-5' : ''}`}></div>
                  </div>
                  <div className="ml-3">Enable Bloom Effect</div>
                </label>
              </div>
            </div>
            
            {/* Documentation link */}
            <div className="mt-8 pt-4 border-t border-gray-200">
              <Link 
                href="/docs/performance"
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
                </svg>
                View Performance Documentation
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default PerformanceDemoPage; 