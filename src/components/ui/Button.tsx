"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-[--color-primary-teal] text-white hover:bg-opacity-90 focus-visible:ring-[--color-primary-teal]",
        secondary:
          "border border-[--color-primary-gold] text-[--color-primary-gold] hover:bg-[--color-primary-gold] hover:text-white dark:border-[--color-primary-gold] dark:text-[--color-primary-gold] dark:hover:bg-[--color-primary-gold] dark:hover:text-white",
        outline:
          "border border-neutral-700 text-neutral-700 hover:bg-neutral-700 hover:text-white dark:border-neutral-300 dark:text-neutral-300 dark:hover:bg-neutral-700",
        ghost:
          "hover:bg-neutral-200 hover:text-neutral-700 dark:hover:bg-neutral-700 dark:hover:text-neutral-200",
        link: "underline-offset-4 hover:underline text-[--color-primary-teal] dark:text-[--color-primary-teal]",
        destructive:
          "bg-[--color-error] text-white hover:bg-opacity-90 dark:hover:bg-opacity-80",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-lg",
        xl: "h-14 px-8 text-xl",
        icon: "h-10 w-10 p-0",
      },
      fullWidth: {
        true: "w-full",
      },
      rounded: {
        true: "rounded-full",
        false: "rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: false,
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth,
      rounded,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, fullWidth, rounded }),
          className
        )}
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {loading && (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent">
            <span className="sr-only">Loading...</span>
          </span>
        )}
        {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
