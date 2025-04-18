'use client';

import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-nile-teal text-white hover:bg-nile-teal/90 focus-visible:ring-nile-teal',
        primary: 'bg-pharaonic-gold text-white hover:bg-pharaonic-gold/90 focus-visible:ring-pharaonic-gold',
        secondary: 'bg-white text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50 focus-visible:ring-nile-teal',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 focus-visible:ring-nile-teal',
        ghost: 'bg-transparent hover:bg-gray-100 focus-visible:ring-nile-teal',
        destructive: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500',
      },
      size: {
        xs: 'h-8 px-2 text-xs',
        sm: 'h-9 px-3',
        md: 'h-10 px-4',
        lg: 'h-11 px-6',
        xl: 'h-12 px-8 text-base',
      },
      fullWidth: {
        true: 'w-full',
      },
      roundness: {
        square: 'rounded-none',
        default: 'rounded-md',
        pill: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      roundness: 'default',
    },
  }
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export interface ButtonProps extends 
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<'button'>>,
  ButtonVariantProps {
  children: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  motionProps?: Omit<HTMLMotionProps<'button'>, 'className' | 'children' | 'disabled' | 'onClick'>;
}

export function Button({
  children,
  className,
  variant,
  size,
  fullWidth,
  roundness,
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  disabled,
  onClick,
  type = 'button',
  motionProps = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
  },
  ...props
}: ButtonProps) {
  const buttonClassName = buttonVariants({ variant, size, fullWidth, roundness, className });
  const isDisabled = isLoading || disabled;

  // Combine onClick with motionProps if provided
  const combinedMotionProps = {
    ...motionProps,
    ...(onClick && { onClick }),
  };

  return (
    <motion.button
      className={buttonClassName}
      disabled={isDisabled}
      type={type}
      {...combinedMotionProps}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {isLoading && loadingText ? loadingText : children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  );
}

export default Button; 