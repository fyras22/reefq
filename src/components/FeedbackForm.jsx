'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaceSmileIcon, 
  FaceFrownIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function FeedbackForm({ onClose }) {
  const [step, setStep] = useState(1);
  const [rating, setRating] = useState(null);
  const [usedFeature, setUsedFeature] = useState(null);
  const [foundSizeAccurate, setFoundSizeAccurate] = useState(null);
  const [willPurchase, setWillPurchase] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare feedback data
    const feedbackData = {
      rating,
      usedFeature,
      foundSizeAccurate,
      willPurchase,
      feedback,
      timestamp: new Date().toISOString()
    };
    
    // In a real application, this would be sent to an API endpoint
    console.log('Feedback submitted:', feedbackData);
    
    // For demo, just show success state
    setSubmitted(true);
    
    // After a delay, close the form
    setTimeout(() => {
      onClose();
    }, 3000);
  };
  
  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };
  
  const canProceed = () => {
    if (step === 1 && rating === null) return false;
    if (step === 2 && usedFeature === null) return false;
    if (step === 3 && foundSizeAccurate === null) return false;
    if (step === 4 && willPurchase === null) return false;
    return true;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      {!submitted ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Help Us Improve</h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className={`w-12 h-1 rounded ${
                    i <= step ? 'bg-primary' : 'bg-gray-200'
                  }`}
                ></div>
              ))}
            </div>
            
            {/* Step 1: Overall Rating */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h4 className="text-lg font-medium text-gray-900 mb-4">How was your experience?</h4>
                <div className="flex justify-center space-x-6 mb-6">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className={`flex flex-col items-center p-3 rounded-lg ${
                        rating === value 
                          ? 'bg-primary/10 text-primary ring-2 ring-primary'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-2xl">{value === 1 ? '😞' : value === 2 ? '😕' : value === 3 ? '😐' : value === 4 ? '🙂' : '😀'}</span>
                      <span className="text-sm mt-1">{value}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Step 2: Feature Used */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h4 className="text-lg font-medium text-gray-900 mb-4">Which feature did you use?</h4>
                <div className="space-y-3">
                  {['AR Try-On', 'Size Calculator', 'Both', 'Neither'].map((feature) => (
                    <button
                      key={feature}
                      type="button"
                      onClick={() => setUsedFeature(feature)}
                      className={`w-full text-left px-4 py-3 rounded-lg border ${
                        usedFeature === feature 
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Step 3: Size Accuracy */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h4 className="text-lg font-medium text-gray-900 mb-4">Did you find the size recommendations accurate?</h4>
                <div className="space-y-3">
                  {['Yes, very accurate', 'Somewhat accurate', 'Not accurate', 'Did not get a recommendation'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFoundSizeAccurate(option)}
                      className={`w-full text-left px-4 py-3 rounded-lg border ${
                        foundSizeAccurate === option 
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Step 4: Purchase Intent */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h4 className="text-lg font-medium text-gray-900 mb-4">Will you make a purchase based on this experience?</h4>
                <div className="space-y-3">
                  {['Yes, today', 'Yes, in the near future', 'Maybe', 'No'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setWillPurchase(option)}
                      className={`w-full text-left px-4 py-3 rounded-lg border ${
                        willPurchase === option 
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Step 5: Additional Feedback */}
            {step === 5 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h4 className="text-lg font-medium text-gray-900 mb-4">Any additional feedback?</h4>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your thoughts to help us improve..."
                  className="w-full h-32 px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/50"
                ></textarea>
              </motion.div>
            )}
          </div>
          
          <div className="flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}
            
            <button
              type="button"
              onClick={step === 5 ? handleSubmit : handleNext}
              disabled={!canProceed()}
              className={`px-6 py-2 rounded-md font-medium ${
                canProceed() 
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {step === 5 ? 'Submit' : 'Next'}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <CheckIcon className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
          <p className="text-gray-600">Your feedback helps us improve our Try & Fit experience.</p>
        </div>
      )}
    </div>
  );
} 