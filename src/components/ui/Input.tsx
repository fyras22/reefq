"use client";

import { cn } from "@/lib/utils";
import React, { forwardRef, useState } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
  label?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      error,
      helperText,
      label,
      iconLeft,
      iconRight,
      containerClassName,
      required,
      id,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block mb-2 text-sm font-medium",
              error
                ? "text-[--color-error]"
                : "text-neutral-800 dark:text-neutral-200"
            )}
          >
            {label}
            {required && <span className="text-[--color-error] ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {iconLeft && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 dark:text-neutral-400">
              {iconLeft}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm transition-colors",
              "ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[--color-primary-teal] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              iconLeft && "pl-10",
              iconRight && "pr-10",
              error
                ? "border-[--color-error] focus-visible:ring-[--color-error]"
                : "border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400",
              className
            )}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 dark:text-neutral-400">
              {iconRight}
            </div>
          )}
        </div>
        {helperText && (
          <p
            className={cn(
              "mt-1 text-xs",
              error
                ? "text-[--color-error]"
                : "text-neutral-500 dark:text-neutral-400"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
