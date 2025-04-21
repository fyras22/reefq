import React, { useState, Fragment } from 'react';
import Image from 'next/image';
import { Tab } from '@headlessui/react';
import { AlertCircle, Ruler, ChevronsLeftRight } from 'lucide-react';
import SizeComparisonToolNew from './SizeComparisonToolNew';
import { twMerge } from 'tailwind-merge';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type MeasurementMethod = {
  title: string;
  description: string;
  steps: string[];
  tips: string[];
  image: string;
};

export const MeasurementGuide = () => {
  const [selectedJewelry, setSelectedJewelry] = useState<'ring' | 'bracelet' | 'necklace' | 'earring'>('ring');

  const ringMethods: MeasurementMethod[] = [
    {
      title: "String Method",
      description: "The most common way to measure your ring size at home",
      steps: [
        "Wrap a piece of string or paper around the base of your finger",
        "Mark where the string meets and measure the length in millimeters",
        "Use our conversion chart to find your ring size",
        "If you're between sizes, we recommend sizing up"
      ],
      tips: [
        "Measure when your hands are warm (cold hands may be smaller)",
        "Measure at the end of the day when fingers may be larger",
        "Measure 3-4 times for accuracy",
        "Consider wider bands need a slightly larger size"
      ],
      image: "/images/measurement/ring-string-method.jpg"
    },
    {
      title: "Existing Ring Method",
      description: "Measure a ring that already fits you well",
      steps: [
        "Find a ring that fits the intended finger properly",
        "Measure the inner diameter of the ring in millimeters",
        "Use our size chart to convert the diameter to your ring size",
        "Double-check by placing the ring on our size chart image"
      ],
      tips: [
        "Make sure the ring is a simple band for the most accurate measurement",
        "Measure several times for best results",
        "Different fingers may require different sizes",
        "Remember that your dominant hand is typically larger"
      ],
      image: "/images/measurement/ring-existing-method.jpg"
    }
  ];

  const braceletMethods: MeasurementMethod[] = [
    {
      title: "Wrist Measurement",
      description: "Measure your wrist to find your perfect bracelet size",
      steps: [
        "Wrap a flexible measuring tape around your wrist where you'd wear a bracelet",
        "Make sure it's snug but not tight",
        "Note the measurement in centimeters or inches",
        "Add 1.5-2cm (0.6-0.8 inches) for comfort"
      ],
      tips: [
        "Measure on the wrist where you'll wear the bracelet",
        "For a looser fit, add more to your measurement",
        "For a tighter fit, add less to your measurement",
        "Chain bracelets typically need less added length than rigid bangles"
      ],
      image: "/images/measurement/bracelet-measuring.jpg"
    },
    {
      title: "Existing Bracelet Method",
      description: "Use a well-fitting bracelet to find your size",
      steps: [
        "Find a bracelet that fits you comfortably",
        "Measure its length from end to end",
        "For bracelets with clasps, include the clasp in your measurement",
        "Use this length as your bracelet size"
      ],
      tips: [
        "Different styles of bracelets may require different fits",
        "Flexible bracelets can be worn tighter than rigid ones",
        "Consider the width of the bracelet - wider bracelets need more room",
        "Remember that your wrist size may fluctuate with temperature and time of day"
      ],
      image: "/images/measurement/bracelet-existing.jpg"
    }
  ];

  const necklaceMethods: MeasurementMethod[] = [
    {
      title: "Neck Measurement",
      description: "Find your perfect necklace length",
      steps: [
        "Use a soft measuring tape to measure around your neck",
        "Add 5-10cm (2-4 inches) to this measurement for comfort",
        "This will give you the minimum recommended necklace length",
        "Consider desired style and where you want the necklace to sit"
      ],
      tips: [
        "Choker: sits tightly around the neck (14-16 inches)",
        "Princess: sits at or just below the collarbone (18 inches)",
        "Matinee: sits between the collarbone and bust (20-24 inches)",
        "Opera/Rope: longer styles that hang below the bust (28-36+ inches)"
      ],
      image: "/images/measurement/necklace-measuring.jpg"
    },
    {
      title: "Existing Necklace Method",
      description: "Use a necklace you already have",
      steps: [
        "Lay a necklace that fits you well on a flat surface",
        "Measure its length from end to end, including the clasp",
        "This is your preferred necklace length",
        "Consider different styles may need different lengths"
      ],
      tips: [
        "Shorter necklaces (14-18 inches) work well with open necklines",
        "Medium lengths (18-24 inches) are versatile for most outfits",
        "Longer necklaces (24+ inches) work well over high necklines or for layering",
        "Consider your height when choosing length - taller individuals may prefer longer necklaces"
      ],
      image: "/images/measurement/necklace-existing.jpg"
    }
  ];

  const earringMethods: MeasurementMethod[] = [
    {
      title: "Earring Weight Considerations",
      description: "How to choose earrings based on comfort and ear lobe strength",
      steps: [
        "Consider your comfort with different weights of earrings",
        "For sensitive ears, choose lightweight options under 5 grams",
        "Medium weight earrings range from 5-10 grams",
        "Heavy statement earrings can weigh 10+ grams"
      ],
      tips: [
        "If your earlobes are thin or have been stretched, opt for lighter earrings",
        "Earring support patches can help distribute weight for heavier styles",
        "Clip-on options can be an alternative for heavy designs",
        "Consider the earring back style for security and comfort"
      ],
      image: "/images/measurement/earring-weight.jpg"
    },
    {
      title: "Earring Length Guide",
      description: "Choose the right earring length for different occasions and face shapes",
      steps: [
        "Measure from your earlobe to your shoulder in centimeters",
        "Short earrings (studs to 2cm) are great for everyday wear",
        "Medium earrings (2-5cm) suit most occasions",
        "Long earrings (5cm+) make a statement for special events"
      ],
      tips: [
        "Round faces: Long, linear earrings create a slimming effect",
        "Square faces: Round or teardrop shapes soften angular features",
        "Heart-shaped faces: Wider at the bottom earrings balance the face",
        "Oval faces: Most styles work well - choose based on personal preference"
      ],
      image: "/images/measurement/earring-length.jpg"
    }
  ];

  const getMethods = () => {
    switch (selectedJewelry) {
      case 'ring': return ringMethods;
      case 'bracelet': return braceletMethods;
      case 'necklace': return necklaceMethods;
      case 'earring': return earringMethods;
      default: return ringMethods;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Jewelry Measurement Guide</h1>
      
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                className={classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 flex items-center justify-center',
                  'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow text-blue-700'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )}
              >
                <Ruler className="mr-2 h-4 w-4" /> Measurement Guide
              </button>
            )}
          </Tab>
          <Tab as={Fragment}>
            {({ selected }) => (
              <button
                className={classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 flex items-center justify-center',
                  'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow text-blue-700'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )}
              >
                <ChevronsLeftRight className="mr-2 h-4 w-4" /> Size Comparison
              </button>
            )}
          </Tab>
        </Tab.List>
        
        <Tab.Panels className="mt-6">
          <Tab.Panel>
            <div className="mb-6">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Choose Jewelry Type</h3>
                  <p className="mt-1 text-sm text-gray-500">Select the type of jewelry you want to measure</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedJewelry('ring')}
                      className={`px-4 py-2 rounded-md flex items-center ${
                        selectedJewelry === 'ring' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                      }`}
                    >
                      Ring
                    </button>
                    <button
                      onClick={() => setSelectedJewelry('bracelet')}
                      className={`px-4 py-2 rounded-md flex items-center ${
                        selectedJewelry === 'bracelet' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                      }`}
                    >
                      Bracelet
                    </button>
                    <button
                      onClick={() => setSelectedJewelry('necklace')}
                      className={`px-4 py-2 rounded-md flex items-center ${
                        selectedJewelry === 'necklace' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                      }`}
                    >
                      Necklace
                    </button>
                    <button
                      onClick={() => setSelectedJewelry('earring')}
                      className={`px-4 py-2 rounded-md flex items-center ${
                        selectedJewelry === 'earring' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                      }`}
                    >
                      Earring
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Important</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        For the most accurate measurements, please use a flexible measuring tape or a piece of string and a ruler.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getMethods().map((method, index) => (
                <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{method.title}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{method.description}</p>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <div className="mb-4">
                      <Image
                        src={method.image}
                        alt={method.title}
                        width={400}
                        height={300}
                        className="rounded-md w-full h-auto"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-lg mb-2">Steps</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {method.steps.map((step, i) => (
                          <li key={i} className="text-gray-700">{step}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-lg mb-2">Tips</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {method.tips.map((tip, i) => (
                          <li key={i} className="text-gray-700">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Tab.Panel>
          
          <Tab.Panel>
            <div className="mt-6">
              <SizeComparisonToolNew jewelryType={selectedJewelry === 'earring' ? 'earrings' : selectedJewelry} />
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default MeasurementGuide; 