'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

// This component maintains compatibility with the old API to avoid breaking existing code
export interface LegacyToastProps {
  message: string;
  type: 'success' | 'error';
  duration?: number;
  isVisible?: boolean;
  onClose?: () => void;
}

export function Toast({
  message,
  type = 'success',
  duration = 3000,
  isVisible = true,
  onClose
}: LegacyToastProps) {
  const [visible, setVisible] = useState(isVisible);

  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (visible && duration !== Infinity) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <div
      className={`max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${
        type === 'success' ? 'bg-green-50' : 'bg-red-50'
      }`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {type === 'success' ? (
              <CheckCircleIcon
                className="h-6 w-6 text-green-400"
                aria-hidden="true"
              />
            ) : (
              <ExclamationCircleIcon
                className="h-6 w-6 text-red-400"
                aria-hidden="true"
              />
            )}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p
              className={`text-sm font-medium ${
                type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              type="button"
              className={`bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                type === 'success'
                  ? 'focus:ring-green-500'
                  : 'focus:ring-red-500'
              }`}
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 