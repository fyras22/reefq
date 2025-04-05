'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from "next/link";

// Diamond cut types
const diamondCuts = [
  { id: 'round', name: 'Round', description: 'The most popular cut, known for maximum brilliance.' },
  { id: 'princess', name: 'Princess', description: 'Square or rectangular shape with pointed corners.' },
  { id: 'cushion', name: 'Cushion', description: 'Square with rounded corners, resembling a pillow.' },
  { id: 'oval', name: 'Oval', description: 'Elongated shape that can make fingers appear longer.' },
  { id: 'emerald', name: 'Emerald', description: 'Rectangular with stepped facets and trimmed corners.' },
  { id: 'pear', name: 'Pear', description: 'Teardrop shape combining round and marquise cuts.' },
  { id: 'radiant', name: 'Radiant', description: 'Square or rectangular with cut corners, very brilliant.' },
  { id: 'marquise', name: 'Marquise', description: 'Elongated shape with pointed ends, maximizes carat weight.' },
];

// Diamond clarity types
const diamondClarities = [
  { id: 'fl', name: 'FL', description: 'Flawless - No inclusions or blemishes visible under 10x magnification' },
  { id: 'if', name: 'IF', description: 'Internally Flawless - No inclusions, only tiny blemishes visible under 10x magnification' },
  { id: 'vvs1', name: 'VVS1', description: 'Very, Very Slightly Included (1) - Inclusions difficult to see under 10x magnification' },
  { id: 'vvs2', name: 'VVS2', description: 'Very, Very Slightly Included (2) - Inclusions barely visible under 10x magnification' },
  { id: 'vs1', name: 'VS1', description: 'Very Slightly Included (1) - Minor inclusions visible under 10x magnification' },
  { id: 'vs2', name: 'VS2', description: 'Very Slightly Included (2) - Minor inclusions somewhat easily visible under 10x magnification' },
  { id: 'si1', name: 'SI1', description: 'Slightly Included (1) - Noticeable inclusions under 10x magnification' },
  { id: 'si2', name: 'SI2', description: 'Slightly Included (2) - Easily noticeable inclusions under 10x magnification' },
];

// Diamond color types
const diamondColors = [
  { id: 'd', name: 'D', description: 'Colorless - Highest color grade, completely colorless' },
  { id: 'e', name: 'E', description: 'Colorless - Minute traces of color, invisible except to expert gemologist' },
  { id: 'f', name: 'F', description: 'Colorless - Slight color detected by expert gemologist, but still considered colorless' },
  { id: 'g', name: 'G', description: 'Near Colorless - Color difficult to detect unless compared to higher grade diamonds' },
  { id: 'h', name: 'H', description: 'Near Colorless - Slight detectable color visible when compared to higher grade diamonds' },
  { id: 'i', name: 'I', description: 'Near Colorless - Slightly detectable color in face-up position' },
  { id: 'j', name: 'J', description: 'Near Colorless - Barely noticeable color visible to the unaided eye' },
  { id: 'k', name: 'K', description: 'Faint Color - Noticeable color visible to the unaided eye' },
];

interface Diamond {
  id: string;
  cut: string;
  color: string;
  clarity: string;
  carat: number;
  price: number;
  image: string;
}

export default function DiamondVisualizerPage() {
  const [selectedCut, setSelectedCut] = useState('round');
  const [selectedColor, setSelectedColor] = useState('d');
  const [selectedClarity, setSelectedClarity] = useState('vvs1');
  const [caratSize, setCaratSize] = useState(1.0);
  const [rotating, setRotating] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showCertificate, setShowCertificate] = useState(false);
  
  // Mock data for a specific diamond
  const [selectedDiamond, setSelectedDiamond] = useState<Diamond>({
    id: 'dia-001',
    cut: 'round',
    color: 'd',
    clarity: 'vvs1',
    carat: 1.0,
    price: 5499,
    image: '/assets/images/thumbnails/diamonds/round-diamond.jpg'
  });
  
  useEffect(() => {
    // In a real app, this would fetch matching diamonds from an API
    // Here we just update our dummy diamond
    setSelectedDiamond({
      id: `dia-${Math.floor(Math.random() * 1000)}`,
      cut: selectedCut,
      color: selectedColor,
      clarity: selectedClarity,
      carat: caratSize,
      price: calculatePrice(selectedCut, selectedColor, selectedClarity, caratSize),
      image: `/assets/images/thumbnails/diamonds/${selectedCut}-diamond.jpg`
    });
  }, [selectedCut, selectedColor, selectedClarity, caratSize]);
  
  const calculatePrice = (cut: string, color: string, clarity: string, carat: number): number => {
    // This would be a complex calculation in a real app based on market rates
    // Simplified version for demo
    const basePrice = 2500;
    
    // Cut multiplier
    const cutMultiplier = 
      cut === 'round' ? 1.2 :
      cut === 'princess' ? 1.1 :
      cut === 'cushion' ? 1.05 :
      cut === 'oval' ? 1.1 :
      cut === 'emerald' ? 0.95 :
      cut === 'pear' ? 1.0 :
      cut === 'radiant' ? 1.05 :
      cut === 'marquise' ? 0.9 : 1.0;
    
    // Color multiplier (D is the best)
    const colorMultiplier = 
      color === 'd' ? 1.5 :
      color === 'e' ? 1.4 :
      color === 'f' ? 1.3 :
      color === 'g' ? 1.2 :
      color === 'h' ? 1.1 :
      color === 'i' ? 1.0 :
      color === 'j' ? 0.9 :
      color === 'k' ? 0.8 : 1.0;
    
    // Clarity multiplier (FL is the best)
    const clarityMultiplier = 
      clarity === 'fl' ? 1.8 :
      clarity === 'if' ? 1.7 :
      clarity === 'vvs1' ? 1.6 :
      clarity === 'vvs2' ? 1.5 :
      clarity === 'vs1' ? 1.4 :
      clarity === 'vs2' ? 1.3 :
      clarity === 'si1' ? 1.2 :
      clarity === 'si2' ? 1.1 : 1.0;
    
    // Carat has exponential impact on price
    const caratMultiplier = Math.pow(carat, 2) * 1.5;
    
    const finalPrice = basePrice * cutMultiplier * colorMultiplier * clarityMultiplier * caratMultiplier;
    return Math.round(finalPrice);
  };
  
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  const toggleRotation = () => {
    setRotating(!rotating);
  };
  
  const handleZoom = (direction: 'in' | 'out') => {
    if (direction === 'in' && zoomLevel < 3) {
      setZoomLevel(prev => prev + 0.5);
    } else if (direction === 'out' && zoomLevel > 1) {
      setZoomLevel(prev => prev - 0.5);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Diamond Education Center</h1>
          <Link 
            href="/demo/jewelry" 
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Back to Jewelry
          </Link>
        </div>
        <p className="text-gray-600 mt-2">
          Explore diamond quality factors and learn how they affect appearance and value
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-square relative bg-gray-50 rounded-md overflow-hidden mb-4 border border-gray-200">
            {/* Diamond Image */}
            <div 
              className={`w-full h-full relative transition-transform duration-300 ${
                rotating ? 'animate-spin-slow' : ''
              }`}
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <Image 
                src={selectedDiamond.image}
                alt={`${selectedDiamond.carat} carat ${selectedDiamond.cut} diamond`}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-contain"
                priority
              />
            </div>
            
            {/* Controls overlay */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <button 
                onClick={() => handleZoom('in')} 
                className="bg-white p-2 rounded-full shadow-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={zoomLevel >= 3}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                onClick={() => handleZoom('out')} 
                className="bg-white p-2 rounded-full shadow-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={zoomLevel <= 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                onClick={toggleRotation} 
                className={`p-2 rounded-full shadow-md ${
                  rotating ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {selectedDiamond.carat} Carat {diamondCuts.find(c => c.id === selectedDiamond.cut)?.name} Diamond
            </h2>
            <span className="text-2xl font-bold text-blue-600">{formatPrice(selectedDiamond.price)}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-gray-900 mb-2">Specifications</h3>
              <dl className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
                <dt className="text-gray-500">Cut:</dt>
                <dd className="text-gray-900 col-span-2 capitalize">{selectedDiamond.cut}</dd>
                
                <dt className="text-gray-500">Color:</dt>
                <dd className="text-gray-900 col-span-2 uppercase">{selectedDiamond.color}</dd>
                
                <dt className="text-gray-500">Clarity:</dt>
                <dd className="text-gray-900 col-span-2 uppercase">{selectedDiamond.clarity}</dd>
                
                <dt className="text-gray-500">Carat:</dt>
                <dd className="text-gray-900 col-span-2">{selectedDiamond.carat}</dd>
              </dl>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-gray-900 mb-2">Certificate</h3>
              <p className="text-sm text-gray-600 mb-3">All our diamonds come with a GIA certification ensuring authenticity and quality.</p>
              <button 
                onClick={() => setShowCertificate(true)} 
                className="text-sm text-blue-600 font-medium flex items-center hover:text-blue-800 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                View Certificate
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-200">
              Add Diamond to My Selection
            </button>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">The 4 C's of Diamonds</h2>
            
            <div className="space-y-4">
              <div className="p-4 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold text-lg">Cut</h3>
                <p className="text-gray-600 text-sm">
                  Cut is the most important factor in a diamond's brilliance. 
                  It refers to the quality of the diamond's angles, proportions, 
                  symmetrical facets, and ability to reflect light.
                </p>
              </div>
              
              <div className="p-4 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold text-lg">Color</h3>
                <p className="text-gray-600 text-sm">
                  Diamond color is graded on a scale from D (colorless) to Z (light yellow).
                  Colorless diamonds are the rarest and most valuable.
                </p>
              </div>
              
              <div className="p-4 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold text-lg">Clarity</h3>
                <p className="text-gray-600 text-sm">
                  Clarity measures the absence of inclusions and blemishes.
                  The fewer the imperfections, the higher the clarity grade and value.
                </p>
              </div>
              
              <div className="p-4 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold text-lg">Carat</h3>
                <p className="text-gray-600 text-sm">
                  Carat refers to a diamond's weight, not its size.
                  One carat equals 200 milligrams. Larger diamonds are rarer and more valuable.
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">Expert Advice</h3>
              <p className="text-sm text-blue-700 mt-2">
                If your budget is limited, prioritize cut quality over carat weight. 
                A smaller, well-cut diamond will appear more brilliant and beautiful 
                than a larger diamond with poor cut quality.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Diamond Shape Guide</h2>
            <p className="text-gray-600 text-sm mb-4">
              Diamond shape is often confused with cut, but shape refers to the outline of the diamond.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="w-full aspect-square bg-gray-100 rounded-full mb-2 flex items-center justify-center text-3xl text-gray-300">
                  ◯
                </div>
                <p className="text-sm font-medium">Round</p>
                <p className="text-xs text-gray-500">Most brilliant</p>
              </div>
              
              <div className="text-center">
                <div className="w-full aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center text-3xl text-gray-300">
                  ◻
                </div>
                <p className="text-sm font-medium">Princess</p>
                <p className="text-xs text-gray-500">Contemporary</p>
              </div>
              
              <div className="text-center">
                <div className="w-full aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center text-3xl text-gray-300">
                  ◆
                </div>
                <p className="text-sm font-medium">Cushion</p>
                <p className="text-xs text-gray-500">Classic look</p>
              </div>
              
              <div className="text-center">
                <div className="w-full aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center text-3xl text-gray-300">
                  ❤
                </div>
                <p className="text-sm font-medium">Heart</p>
                <p className="text-xs text-gray-500">Romantic</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Certificate of Authenticity</h2>
                <button 
                  onClick={() => setShowCertificate(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="border-t border-b border-gray-200 py-4 mb-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">GIA Diamond Report</h3>
                  <p className="text-sm text-gray-600">Certificate No: {selectedDiamond.id.toUpperCase()}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">SHAPE AND CUTTING STYLE</h4>
                      <p className="text-lg capitalize">{selectedDiamond.cut}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">MEASUREMENTS</h4>
                      <p className="text-lg">
                        {selectedDiamond.cut === 'round' 
                          ? `${(6.5 * Math.sqrt(selectedDiamond.carat)).toFixed(2)} x ${(6.5 * Math.sqrt(selectedDiamond.carat)).toFixed(2)} x ${(4.0 * Math.sqrt(selectedDiamond.carat)).toFixed(2)} mm`
                          : `${(7.0 * Math.sqrt(selectedDiamond.carat)).toFixed(2)} x ${(5.0 * Math.sqrt(selectedDiamond.carat)).toFixed(2)} x ${(3.5 * Math.sqrt(selectedDiamond.carat)).toFixed(2)} mm`
                        }
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">CARAT WEIGHT</h4>
                      <p className="text-lg">{selectedDiamond.carat} carats</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">COLOR GRADE</h4>
                      <p className="text-lg uppercase">{selectedDiamond.color}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">CLARITY GRADE</h4>
                      <p className="text-lg uppercase">{selectedDiamond.clarity}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">CUT GRADE</h4>
                      <p className="text-lg">Excellent</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">POLISH</h4>
                      <p className="text-lg">Excellent</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">SYMMETRY</h4>
                      <p className="text-lg">Excellent</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <button 
                  onClick={() => setShowCertificate(false)} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded"
                >
                  Close Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 