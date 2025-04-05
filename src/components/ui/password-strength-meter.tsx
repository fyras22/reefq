'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

export default function PasswordStrengthMeter({ 
  password,
  className = ''
}: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setFeedback('');
      return;
    }

    let currentStrength = 0;
    const feedbacks: string[] = [];

    // Check password length
    if (password.length >= 8) {
      currentStrength += 1;
    } else {
      feedbacks.push('Use 8+ characters');
    }

    // Check for numbers
    if (/\d/.test(password)) {
      currentStrength += 1;
    } else {
      feedbacks.push('Add numbers');
    }

    // Check for lowercase letters
    if (/[a-z]/.test(password)) {
      currentStrength += 1;
    } else {
      feedbacks.push('Add lowercase letters');
    }

    // Check for uppercase letters
    if (/[A-Z]/.test(password)) {
      currentStrength += 1;
    } else {
      feedbacks.push('Add uppercase letters');
    }

    // Check for special characters
    if (/[^A-Za-z0-9]/.test(password)) {
      currentStrength += 1;
    } else {
      feedbacks.push('Add special characters');
    }

    setStrength(currentStrength);
    
    // Set feedback based on strength
    if (currentStrength === 0) {
      setFeedback('Very weak');
    } else if (currentStrength === 1) {
      setFeedback('Weak');
    } else if (currentStrength === 2) {
      setFeedback('Fair');
    } else if (currentStrength === 3) {
      setFeedback('Good');
    } else if (currentStrength === 4) {
      setFeedback('Strong');
    } else {
      setFeedback('Very strong');
    }
  }, [password]);

  const getStrengthColor = () => {
    if (strength === 0) return 'bg-gray-200';
    if (strength === 1) return 'bg-red-500';
    if (strength === 2) return 'bg-orange-500';
    if (strength === 3) return 'bg-yellow-500';
    if (strength === 4) return 'bg-green-400';
    return 'bg-green-600';
  };

  const getFeedbackColor = () => {
    if (strength === 0) return 'text-gray-400';
    if (strength === 1) return 'text-red-500';
    if (strength === 2) return 'text-orange-500';
    if (strength === 3) return 'text-yellow-500';
    if (strength === 4) return 'text-green-500';
    return 'text-green-600';
  };

  return (
    <div className={`mt-1 ${className}`}>
      <div className="flex h-1 mb-1 overflow-hidden rounded-full bg-gray-100">
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ width: 0 }}
            animate={{
              width: index < strength ? `${100 / 5}%` : 0,
            }}
            transition={{ duration: 0.3 }}
            className={`h-full ${index < strength ? getStrengthColor() : 'bg-transparent'}`}
          />
        ))}
      </div>
      
      {password && (
        <div className="flex justify-between items-center mt-1 text-xs">
          <span className={`font-medium ${getFeedbackColor()}`}>
            {feedback}
          </span>
          {strength < 3 && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500"
            >
              {strength === 0 && 'Add more characters'}
              {strength === 1 && 'Try adding numbers or symbols'}
              {strength === 2 && 'Keep going, add uppercase letters'}
            </motion.span>
          )}
        </div>
      )}
    </div>
  );
} 