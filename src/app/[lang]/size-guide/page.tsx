'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function SizeGuidePage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <section className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Ring Size Guide
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Find your perfect ring size with our comprehensive sizing guide. Use any of these 
            methods to determine your ring size accurately.
          </p>
        </section>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Size Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Size Conversion Chart</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">US Size</th>
                    <th className="py-2 px-4 text-left">UK Size</th>
                    <th className="py-2 px-4 text-left">EU Size</th>
                    <th className="py-2 px-4 text-left">Diameter (mm)</th>
                    <th className="py-2 px-4 text-left">Circumference (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-200">
                    <td className="py-2 px-4">4</td>
                    <td className="py-2 px-4">H</td>
                    <td className="py-2 px-4">47</td>
                    <td className="py-2 px-4">14.8</td>
                    <td className="py-2 px-4">46.8</td>
                  </tr>
                  <tr className="border-t border-gray-200 bg-gray-50">
                    <td className="py-2 px-4">4.5</td>
                    <td className="py-2 px-4">I</td>
                    <td className="py-2 px-4">48</td>
                    <td className="py-2 px-4">15.3</td>
                    <td className="py-2 px-4">48.0</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="py-2 px-4">5</td>
                    <td className="py-2 px-4">J</td>
                    <td className="py-2 px-4">49</td>
                    <td className="py-2 px-4">15.7</td>
                    <td className="py-2 px-4">49.3</td>
                  </tr>
                  <tr className="border-t border-gray-200 bg-gray-50">
                    <td className="py-2 px-4">5.5</td>
                    <td className="py-2 px-4">K</td>
                    <td className="py-2 px-4">50</td>
                    <td className="py-2 px-4">16.1</td>
                    <td className="py-2 px-4">50.6</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="py-2 px-4">6</td>
                    <td className="py-2 px-4">L</td>
                    <td className="py-2 px-4">51</td>
                    <td className="py-2 px-4">16.5</td>
                    <td className="py-2 px-4">51.9</td>
                  </tr>
                  <tr className="border-t border-gray-200 bg-gray-50">
                    <td className="py-2 px-4">6.5</td>
                    <td className="py-2 px-4">M</td>
                    <td className="py-2 px-4">52</td>
                    <td className="py-2 px-4">16.9</td>
                    <td className="py-2 px-4">53.1</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="py-2 px-4">7</td>
                    <td className="py-2 px-4">N</td>
                    <td className="py-2 px-4">54</td>
                    <td className="py-2 px-4">17.3</td>
                    <td className="py-2 px-4">54.4</td>
                  </tr>
                  <tr className="border-t border-gray-200 bg-gray-50">
                    <td className="py-2 px-4">7.5</td>
                    <td className="py-2 px-4">O</td>
                    <td className="py-2 px-4">55</td>
                    <td className="py-2 px-4">17.7</td>
                    <td className="py-2 px-4">55.7</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="py-2 px-4">8</td>
                    <td className="py-2 px-4">P</td>
                    <td className="py-2 px-4">56</td>
                    <td className="py-2 px-4">18.2</td>
                    <td className="py-2 px-4">57.2</td>
                  </tr>
                  <tr className="border-t border-gray-200 bg-gray-50">
                    <td className="py-2 px-4">8.5</td>
                    <td className="py-2 px-4">Q</td>
                    <td className="py-2 px-4">57</td>
                    <td className="py-2 px-4">18.6</td>
                    <td className="py-2 px-4">58.5</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="py-2 px-4">9</td>
                    <td className="py-2 px-4">R</td>
                    <td className="py-2 px-4">59</td>
                    <td className="py-2 px-4">19.0</td>
                    <td className="py-2 px-4">59.7</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Measuring Methods */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Method 1: Measure an Existing Ring</h3>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1">
                  <p className="text-gray-600 mb-3">
                    Place one of your existing rings on a ruler and measure the inside diameter.
                    Use the conversion chart to find your size.
                  </p>
                  <ol className="list-decimal list-inside text-gray-600 space-y-1">
                    <li>Find a ring that fits the finger you plan to wear your new ring on</li>
                    <li>Measure the inside diameter in millimeters</li>
                    <li>Use our chart to determine your ring size</li>
                  </ol>
                </div>
                <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    <span>Ring Measurement Diagram</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Method 2: String or Paper Strip Method</h3>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1">
                  <p className="text-gray-600 mb-3">
                    Use a piece of string or paper strip to measure your finger's circumference.
                  </p>
                  <ol className="list-decimal list-inside text-gray-600 space-y-1">
                    <li>Wrap a string or paper strip around your finger</li>
                    <li>Mark where the string meets</li>
                    <li>Measure the length with a ruler in millimeters</li>
                    <li>Divide by π (3.14) to get the diameter</li>
                    <li>Use our chart to find your ring size</li>
                  </ol>
                </div>
                <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>String Method Diagram</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Tips for Accurate Measurement</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Measure at the end of the day when your fingers are at their largest</li>
                <li>Measure when your hands are at a normal temperature (cold hands may result in a smaller size)</li>
                <li>Measure 3-4 times to ensure accuracy</li>
                <li>If you're between sizes, we recommend choosing the larger size</li>
                <li>Your dominant hand may be slightly larger than your non-dominant hand</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-nile-teal/10 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-2 text-nile-teal">Need More Help?</h3>
          <p className="text-gray-600 mb-4">
            If you're still unsure about your ring size, we recommend visiting a local jeweler for professional sizing
            or order our free ring sizer kit.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/customize"
              className="bg-nile-teal hover:bg-nile-teal/90 text-white py-2 px-4 rounded-md text-sm"
            >
              Back to Customizer
            </Link>
            <button
              className="border border-nile-teal text-nile-teal py-2 px-4 rounded-md text-sm hover:bg-nile-teal/5"
            >
              Order Free Ring Sizer
            </button>
            <Link
              href="/contact"
              className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm hover:bg-gray-50"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
} 