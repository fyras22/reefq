"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const spinnerVariants = cva(
  "inline-block rounded-full border-current border-t-transparent animate-spin",
  {
    variants: {
      size: {
        xs: "h-3 w-3 border",
        sm: "h-4 w-4 border-2",
        md: "h-6 w-6 border-2",
        lg: "h-8 w-8 border-2",
        xl: "h-10 w-10 border-2",
        "2xl": "h-12 w-12 border-3",
      },
      variant: {
        default: "text-brand-teal",
        white: "text-white",
        gray: "text-gray-400",
        gold: "text-brand-gold",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size, variant, label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center justify-center", className)}
        role="status"
        aria-live="polite"
        {...props}
      >
        <div className={cn(spinnerVariants({ size, variant }))}>
          <span className="sr-only">Loading...</span>
        </div>
        {label && (
          <p className="mt-2 text-sm text-medium-gray dark:text-gray-300">
            {label}
          </p>
        )}
      </div>
    );
  }
);

LoadingSpinner.displayName = "LoadingSpinner";

export { LoadingSpinner, spinnerVariants };
