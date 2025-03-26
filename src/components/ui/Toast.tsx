'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
  isVisible: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  duration = 5000,
  onClose,
  isVisible
}) => {
  const [visible, setVisible] = useState(isVisible);

  useEffect(() => {
    setVisible(isVisible);
    
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!visible) return null;

  const typeClasses = {
    success: 'bg-green-50 text-green-800 border-green-400',
    error: 'bg-red-50 text-red-800 border-red-400',
    info: 'bg-brand-teal/10 text-brand-teal border-brand-teal/30'
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-in fade-in slide-in-from-top-3 duration-300">
      <div className={`rounded-lg border p-4 shadow-md ${typeClasses[type]}`}>
        <div className="flex items-start">
          <div className="flex-1 mr-2">
            {message}
          </div>
          <button 
            onClick={() => {
              setVisible(false);
              if (onClose) onClose();
            }}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}; 