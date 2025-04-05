'use client';

import { useState, InputHTMLAttributes, useId, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FloatingLabelInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string;
  error?: string;
  icon?: ReactNode;
  endIcon?: ReactNode;
  className?: string;
}

export default function FloatingLabelInput({
  label,
  error,
  icon,
  endIcon,
  id: providedId,
  value,
  onChange,
  onFocus,
  onBlur,
  required,
  disabled,
  type = 'text',
  className = '',
  ...rest
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');
  const generatedId = useId();
  const id = providedId || generatedId;
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    onChange?.(e);
  };
  
  const isFloating = isFocused || String(localValue).length > 0;
  
  return (
    <div className={`relative ${className}`}>
      <div className={`
        relative flex items-center overflow-hidden rounded-md border transition-all
        ${disabled ? 'bg-gray-100' : 'bg-white'}
        ${error ? 'border-red-300 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200' : 
          'border-gray-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100'}
      `}>
        {/* Start icon */}
        {icon && (
          <div className={`absolute left-3 flex items-center justify-center text-gray-400 transition-all ${isFloating ? 'transform translate-y-0' : 'transform translate-y-0'}`}>
            {icon}
          </div>
        )}
        
        <input
          id={id}
          type={type}
          value={value}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            peer w-full py-3 px-3 outline-none bg-transparent placeholder-transparent transition-all disabled:text-gray-400 disabled:cursor-not-allowed
            ${icon ? 'pl-9' : 'pl-3'} 
            ${endIcon ? 'pr-9' : 'pr-3'}
          `}
          placeholder={label}
          aria-invalid={error ? 'true' : 'false'}
          {...rest}
        />
        
        {/* Floating label */}
        <label
          htmlFor={id}
          className={`
            absolute left-0 pointer-events-none origin-left transition-all duration-200 
            ${icon ? 'left-9' : 'left-3'} 
            ${isFloating ? 'transform -translate-y-5 scale-75 text-indigo-600' : 'transform translate-y-0 text-gray-500'}
            ${error && isFloating ? 'text-red-500' : ''}
            ${disabled ? 'text-gray-400' : ''}
          `}
        >
          {label}
          {required && !disabled && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {/* End icon */}
        {endIcon && (
          <div className="absolute right-3 flex items-center justify-center text-gray-400">
            {endIcon}
          </div>
        )}
      </div>
      
      {/* Error message */}
      <AnimatedErrorMessage error={error} />
    </div>
  );
}

function AnimatedErrorMessage({ error }: { error?: string }) {
  return (
    <div className="min-h-[20px] mt-1">
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

interface FloatingLabelTextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  label: string;
  error?: string;
  className?: string;
}

export function FloatingLabelTextArea({
  label,
  error,
  id: providedId,
  value,
  onChange,
  onFocus,
  onBlur,
  required,
  disabled,
  className = '',
  rows = 4,
  ...rest
}: FloatingLabelTextAreaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');
  const generatedId = useId();
  const id = providedId || generatedId;
  
  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);
    onChange?.(e);
  };
  
  const isFloating = isFocused || String(localValue).length > 0;
  
  return (
    <div className={`relative ${className}`}>
      <div className={`
        relative overflow-hidden rounded-md border transition-all
        ${disabled ? 'bg-gray-100' : 'bg-white'}
        ${error ? 'border-red-300 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200' : 
          'border-gray-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100'}
      `}>
        <textarea
          id={id}
          value={value}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          rows={rows}
          className="peer w-full py-3 px-3 outline-none bg-transparent placeholder-transparent transition-all disabled:text-gray-400 disabled:cursor-not-allowed resize-y"
          placeholder={label}
          aria-invalid={error ? 'true' : 'false'}
          {...rest}
        />
        
        {/* Floating label */}
        <label
          htmlFor={id}
          className={`
            absolute left-3 pointer-events-none origin-left transition-all duration-200 
            ${isFloating ? 'transform -translate-y-5 scale-75 text-indigo-600' : 'transform translate-y-0 text-gray-500'}
            ${error && isFloating ? 'text-red-500' : ''}
            ${disabled ? 'text-gray-400' : ''}
          `}
        >
          {label}
          {required && !disabled && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      
      {/* Error message */}
      <AnimatedErrorMessage error={error} />
    </div>
  );
} 