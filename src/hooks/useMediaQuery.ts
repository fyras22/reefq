"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect media query matches (like dark mode preference)
 * @param query The media query to match (e.g. "(prefers-color-scheme: dark)")
 * @returns Whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Default to false for SSR
  const [matches, setMatches] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Safe check for browser environment
    if (typeof window === "undefined") return;

    // Create the media query
    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Listen for changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add event listener
    mediaQuery.addEventListener("change", listener);

    // Clean up
    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, [query]);

  // Return false during SSR, and actual value on client
  return isClient ? matches : false;
}

export default useMediaQuery;
