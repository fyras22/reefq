'use client';

import * as React from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { ButtonProps } from './button';

export interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  spinner?: React.ReactNode;
  disableOnLoading?: boolean;
}

/**
 * A Button component that shows a loading spinner and optional text when in loading state
 * Extends the base Button component with loading state functionality
 */
const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      children,
      className,
      variant,
      isLoading = false,
      loadingText,
      spinner,
      disabled,
      disableOnLoading = true,
      ...props
    },
    ref
  ) => {
    // Determine if the button should be disabled
    const isDisabled = disabled || (disableOnLoading && isLoading);
    
    return (
      <Button
        className={cn('relative', className)}
        variant={variant}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <span className={cn(
            "absolute left-0 top-0 flex h-full w-full items-center justify-center",
            // Hide content completely if there's loading text
            loadingText ? "opacity-100" : "opacity-80"
          )}>
            {spinner || <Loader2 className="h-4 w-4 animate-spin" />}
            {loadingText && (
              <span className="ml-2">{loadingText}</span>
            )}
          </span>
        )}
        
        {/* Original content - visually hidden during loading if loading text is provided */}
        <span className={cn(
          isLoading && loadingText ? "invisible" : "",
          isLoading && !loadingText ? "opacity-0" : "opacity-100",
          "flex items-center justify-center gap-2 transition-opacity duration-200"
        )}>
          {children}
        </span>
      </Button>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';

export { LoadingButton };

// Extended variants of LoadingButton with pre-configured settings
export function SubmitButton({ 
  children = "Submit", 
  loadingText = "Submitting...",
  ...props 
}: Omit<LoadingButtonProps, 'type'>) {
  return (
    <LoadingButton type="submit" loadingText={loadingText} {...props}>
      {children}
    </LoadingButton>
  );
}

export function SaveButton({ 
  children = "Save", 
  loadingText = "Saving...",
  ...props 
}: LoadingButtonProps) {
  return (
    <LoadingButton loadingText={loadingText} {...props}>
      {children}
    </LoadingButton>
  );
}

export function DeleteButton({ 
  children = "Delete", 
  loadingText = "Deleting...",
  variant = "destructive",
  ...props 
}: LoadingButtonProps) {
  return (
    <LoadingButton 
      variant={variant} 
      loadingText={loadingText}
      {...props}
    >
      {children}
    </LoadingButton>
  );
} 