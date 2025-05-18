"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ThemeMode } from "@/lib/theme";
import { darkThemeCssVars, lightThemeCssVars } from "@/lib/theme-utils";
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  enableSystem?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isThemeLoaded: boolean;
  resolvedTheme: ThemeMode;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  isThemeLoaded: false,
  resolvedTheme: "light",
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Add fallback for SSR
const getThemeFromStorage = (): Theme => {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem("theme") as Theme) || "system";
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
}: ThemeProviderProps) {
  // Use getThemeFromStorage directly for the initial state to avoid flash
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ThemeMode>("light");
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Only client side
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // Set mounting state on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get stored theme on initial mount
  useEffect(() => {
    if (!isMounted) return;

    try {
      // Get stored theme preference or detect from system
      const storedTheme = localStorage.getItem("theme") as Theme | null;
      if (storedTheme) {
        setTheme(storedTheme);
      }

      // Mark theme as loaded immediately to avoid flash
      setIsThemeLoaded(true);
    } catch (e) {
      // If localStorage is not available, fall back to default
      setIsThemeLoaded(true);
      console.error("Could not access localStorage:", e);
    }
  }, [isMounted]);

  // Apply theme and resolve actual theme mode (light/dark)
  useEffect(() => {
    if (!isMounted) return;

    const root = window.document.documentElement;

    // Remove previous theme classes
    root.classList.remove("light", "dark");

    // Store new theme preference
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      console.error("Could not store theme preference:", e);
    }

    // Determine the actual theme mode
    let actualTheme: ThemeMode = "light";

    if (theme === "system") {
      actualTheme = prefersDarkMode ? "dark" : "light";
      root.classList.add(actualTheme);
    } else {
      actualTheme = theme as ThemeMode;
      root.classList.add(theme);
    }

    setResolvedTheme(actualTheme);

    // Apply CSS variables for the selected theme
    const themeVars =
      actualTheme === "dark" ? darkThemeCssVars : lightThemeCssVars;

    // Apply CSS variables from theme
    Object.entries(themeVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Ensure Tailwind dark mode class is properly applied
    if (actualTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Add a data attribute to document for easier theme debugging
    root.dataset.theme = actualTheme;

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        actualTheme === "dark" ? "#1F2937" : "#F5F3F0"
      );
    }

    // Log theme change to help with debugging
    console.log(`Theme changed to: ${actualTheme}`);
  }, [theme, prefersDarkMode, isMounted]);

  // To prevent flash of incorrect theme during SSR/hydration
  const value = {
    theme,
    setTheme,
    isThemeLoaded,
    resolvedTheme,
  };

  // Render without any SSR flashing by using a mounting check
  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
