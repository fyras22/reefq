"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "elevated" | "filled";
  padding?: "none" | "sm" | "md" | "lg";
  bordered?: boolean;
  hoverable?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      padding = "md",
      bordered = false,
      hoverable = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg overflow-hidden transition-shadow duration-200",
          {
            "bg-white dark:bg-neutral-800": variant === "default",
            "border border-neutral-200 bg-white dark:bg-neutral-800 dark:border-neutral-700":
              variant === "outline" || bordered,
            "bg-white shadow-md dark:bg-neutral-800 dark:shadow-neutral-900/30":
              variant === "elevated",
            "bg-neutral-100 dark:bg-neutral-700": variant === "filled",
            "p-0": padding === "none",
            "p-3": padding === "sm",
            "p-5": padding === "md",
            "p-7": padding === "lg",
            "hover:shadow-md dark:hover:shadow-neutral-900/30": hoverable,
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 mb-4", className)}
    {...props}
  />
));

CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold text-neutral-800 dark:text-neutral-100",
      className
    )}
    {...props}
  />
));

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-neutral-600 dark:text-neutral-400", className)}
    {...props}
  />
));

CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));

CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-700",
      className
    )}
    {...props}
  />
));

CardFooter.displayName = "CardFooter";

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
