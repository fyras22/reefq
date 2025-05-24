"use client";

import { cn } from "@/lib/utils";
import React from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  error?: boolean;
  helperText?: string;
  label?: string;
  containerClassName?: string;
  placeholderOption?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      options,
      error,
      helperText,
      label,
      required,
      containerClassName,
      id,
      placeholderOption,
      ...props
    },
    ref
  ) => {
    const selectId =
      id || `select-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
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
          <select
            id={selectId}
            className={cn(
              "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm",
              "ring-offset-white focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[--color-primary-teal] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              "appearance-none bg-select-arrow bg-no-repeat bg-right-center pr-10",
              error
                ? "border-[--color-error] focus-visible:ring-[--color-error]"
                : "border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white",
              className
            )}
            ref={ref}
            {...props}
          >
            {placeholderOption && (
              <option value="" disabled>
                {placeholderOption}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500 dark:text-neutral-400">
            <svg
              className="w-4 h-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M10 14l-5-5h10l-5 5z" />
            </svg>
          </div>
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

Select.displayName = "Select";

export { Select };
