'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { MATERIALS } from '@/lib/assets/MediaAssets';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
type JewelryType = 'ring' | 'necklace' | 'earrings' | 'bracelet';
type MetalType = 'gold' | 'white-gold' | 'rose-gold' | 'platinum' | 'silver';
type GemstoneType = 'diamond' | 'ruby' | 'sapphire' | 'emerald' | 'amethyst';
type DiamondCut = 'round' | 'princess' | 'cushion' | 'oval' | 'emerald-cut';

interface CustomizerState {
  jewelryType: JewelryType;
  metalType: MetalType;
  gemstoneType: GemstoneType;
  caratSize: number;
  diamondCut: DiamondCut;
  engraving: string;
  ringSize: number;
}

export default function CustomDesignPage() {
  // State for customizer
  const [customizer, setCustomizer] = useState<CustomizerState>({
    jewelryType: 'ring',
    metalType: 'gold',
    gemstoneType: 'diamond',
    caratSize: 1.0,
    diamondCut: 'round',
    engraving: '',
    ringSize: 7
  });
  
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Placeholder for 3D preview component
  const [previewUrl, setPreviewUrl] = useState('/assets/images/thumbnails/rings/diamond-solitaire.jpg');
  
  // Calculate price based on selections
  useEffect(() => {
    // This would typically be a more complex calculation based on material costs,
    // labor, design complexity, etc.
    let basePrice = 0;
    
    // Base price by jewelry type
    switch (customizer.jewelryType) {
      case 'ring': basePrice = 500; break;
      case 'necklace': basePrice = 800; break;
      case 'earrings': basePrice = 600; break;
      case 'bracelet': basePrice = 700; break;
    }
    
    // Add metal cost
    const metalMultipliers: Record<MetalType, number> = {
      'gold': 1.5,
      'white-gold': 1.6,
      'rose-gold': 1.55,
      'platinum': 2.0,
      'silver': 0.8
    };
    
    basePrice *= metalMultipliers[customizer.metalType];
    
    // Add gemstone cost
    const gemstoneMultipliers: Record<GemstoneType, number> = {
      'diamond': 3.0,
      'ruby': 2.5,
      'sapphire': 2.2,
      'emerald': 2.4,
      'amethyst': 1.5
    };
    
    const gemstonePrice = 200 * gemstoneMultipliers[customizer.gemstoneType] * customizer.caratSize;
    
    // Calculate final price
    const finalPrice = basePrice + gemstonePrice + (customizer.engraving ? 50 : 0);
    setPrice(Math.round(finalPrice));
    
    // Update preview
    updatePreview();
  }, [customizer]);
  
  const updatePreview = () => {
    // In a real implementation, this would dynamically generate or select the correct
    // preview image or 3D model based on the current customizer state
    setLoading(true);
    
    // Simple mapping for demonstration purposes
    const imageMap = {
      'ring-diamond': '/assets/images/thumbnails/rings/diamond-solitaire.jpg',
      'ring-ruby': '/assets/images/thumbnails/rings/ruby-solitaire.jpg',
      'ring-sapphire': '/assets/images/thumbnails/rings/sapphire-solitaire.jpg',
      'necklace-diamond': '/assets/images/thumbnails/necklaces/diamond-pendant.jpg',
      'necklace-sapphire': '/assets/images/thumbnails/necklaces/sapphire-pendant.jpg',
      'earrings-diamond': '/assets/images/thumbnails/earrings/diamond-studs.jpg',
      'bracelet-diamond': '/assets/images/thumbnails/bracelets/diamond-tennis.jpg',
    };
    
    const key = `${customizer.jewelryType}-${customizer.gemstoneType}` as keyof typeof imageMap;
    const newPreviewUrl = imageMap[key] || '/assets/images/thumbnails/rings/diamond-solitaire.jpg';
    
    // Simulate loading
    setTimeout(() => {
      setPreviewUrl(newPreviewUrl);
      setLoading(false);
    }, 500);
  };
  
  const handleChange = (field: keyof CustomizerState, value: any) => {
    setCustomizer(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = () => {
    alert(`Design submitted! Your custom ${customizer.metalType} ${customizer.jewelryType} with ${customizer.caratSize} carat ${customizer.gemstoneType} would cost approximately $${price}.`);
  };
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Custom Jewelry Designer</h1>
          <Link 
            href="/demo/jewelry" 
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Back to Jewelry
          </Link>
        </div>
        <p className="text-gray-600 mt-2">
          Create your dream jewelry piece by customizing every detail
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Preview Section */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-4 h-min">
          <div className="aspect-square relative mb-4 bg-gray-50 rounded-md overflow-hidden">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <Image 
                src={previewUrl}
                alt={`${customizer.gemstoneType} ${customizer.jewelryType}`}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-contain"
                priority
              />
            )}
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Your Custom Design</h2>
            <p className="text-gray-700 mb-1">
              {customizer.caratSize} carat {customizer.gemstoneType} {customizer.jewelryType} in {customizer.metalType.replace('-', ' ')}
            </p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(price)}</p>
            
            <button 
              onClick={handleSubmit}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-200"
            >
              Request This Design
            </button>
          </div>
        </div>
        
        {/* Customizer Controls */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="type" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="type">Type</TabsTrigger>
              <TabsTrigger value="material">Material</TabsTrigger>
              <TabsTrigger value="gemstone">Gemstone</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            
            {/* Jewelry Type Tab */}
            <TabsContent value="type" className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Select Jewelry Type</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {(['ring', 'necklace', 'earrings', 'bracelet'] as const).map((type) => (
                  <div 
                    key={type}
                    className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all ${
                      customizer.jewelryType === type 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleChange('jewelryType', type)}
                  >
                    <div className="h-16 flex items-center justify-center mb-2">
                      <Image 
                        src={`/assets/images/icons/${type}-icon.svg`}
                        alt={type}
                        width={48}
                        height={48}
                      />
                    </div>
                    <span className="capitalize">{type}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Material Tab */}
            <TabsContent value="material" className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Select Metal Type</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {(['gold', 'white-gold', 'rose-gold', 'platinum', 'silver'] as const).map((metal) => (
                  <div 
                    key={metal}
                    className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all ${
                      customizer.metalType === metal 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleChange('metalType', metal)}
                  >
                    <div className="w-full aspect-square rounded-full mb-2 overflow-hidden">
                      <div 
                        className="w-full h-full"
                        style={{
                          backgroundColor: 
                            metal === 'gold' ? '#FFD700' :
                            metal === 'white-gold' ? '#F5F5F5' :
                            metal === 'rose-gold' ? '#B76E79' :
                            metal === 'platinum' ? '#E5E4E2' :
                            metal === 'silver' ? '#C0C0C0' : '#CCCCCC'
                        }}
                      />
                    </div>
                    <span className="capitalize">{metal.replace('-', ' ')}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Gemstone Tab */}
            <TabsContent value="gemstone" className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Select Gemstone</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
                {(['diamond', 'ruby', 'sapphire', 'emerald', 'amethyst'] as const).map((gemstone) => (
                  <div 
                    key={gemstone}
                    className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all ${
                      customizer.gemstoneType === gemstone 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleChange('gemstoneType', gemstone)}
                  >
                    <div className="w-full aspect-square rounded-full mb-2 overflow-hidden">
                      <div 
                        className="w-full h-full"
                        style={{
                          backgroundColor: 
                            gemstone === 'diamond' ? '#FFFFFF' :
                            gemstone === 'ruby' ? '#E0115F' :
                            gemstone === 'sapphire' ? '#0F52BA' :
                            gemstone === 'emerald' ? '#50C878' :
                            gemstone === 'amethyst' ? '#9966CC' : '#CCCCCC'
                        }}
                      />
                    </div>
                    <span className="capitalize">{gemstone}</span>
                  </div>
                ))}
              </div>
              
              {customizer.gemstoneType === 'diamond' && (
                <>
                  <h3 className="text-lg font-semibold mb-4">Select Diamond Cut</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
                    {(['round', 'princess', 'cushion', 'oval', 'emerald-cut'] as const).map((cut) => (
                      <div 
                        key={cut}
                        className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all ${
                          customizer.diamondCut === cut 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleChange('diamondCut', cut)}
                      >
                        <div className="h-12 flex items-center justify-center mb-2">
                          <Image 
                            src={`/assets/images/icons/${cut}-cut.svg`}
                            alt={cut}
                            width={40}
                            height={40}
                          />
                        </div>
                        <span className="capitalize">{cut.replace('-', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              <h3 className="text-lg font-semibold mb-4">Carat Size</h3>
              <div className="mb-6">
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={customizer.caratSize}
                  onChange={(e) => handleChange('caratSize', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">0.5ct</span>
                  <span className="text-sm font-medium">{customizer.caratSize}ct</span>
                  <span className="text-xs text-gray-500">5.0ct</span>
                </div>
              </div>
            </TabsContent>
            
            {/* Details Tab */}
            <TabsContent value="details" className="bg-white rounded-lg shadow-md p-6">
              {customizer.jewelryType === 'ring' && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Ring Size</h3>
                  <div className="grid grid-cols-8 gap-2">
                    {[5, 6, 7, 8, 9, 10, 11, 12].map((size) => (
                      <div 
                        key={size}
                        className={`cursor-pointer border rounded-md py-2 text-center transition-all ${
                          customizer.ringSize === size 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleChange('ringSize', size)}
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Add Engraving</h3>
                <input
                  type="text"
                  placeholder="Enter your engraving text"
                  value={customizer.engraving}
                  onChange={(e) => handleChange('engraving', e.target.value)}
                  maxLength={20}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {customizer.engraving.length}/20 characters
                  {customizer.engraving.length > 0 && <span> (+$50)</span>}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Special Requests</h3>
                <textarea
                  placeholder="Add any special instructions or requests for your custom design..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Educational Info */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6 border border-blue-100">
        <h2 className="text-2xl font-semibold mb-4">About Custom Jewelry Design</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">The Design Process</h3>
            <p className="text-gray-700">
              After submitting your design, our master craftsmen will review your selections and create a detailed design proposal within 48 hours. You'll receive a high-resolution render of your piece for approval before production begins.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Materials & Quality</h3>
            <p className="text-gray-700">
              We source only the highest quality metals and gemstones for your custom piece. All diamonds are ethically sourced and certified, while colored gemstones are selected for optimal color, clarity, and cut.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Delivery & Warranty</h3>
            <p className="text-gray-700">
              Custom pieces typically take 3-4 weeks to create. Each piece comes with a lifetime warranty on craftsmanship and a certificate of authenticity detailing the specifications of your design.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 