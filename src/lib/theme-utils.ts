/**
 * Theme utility functions for consistent styling across the application
 */
import { ThemeMode, getTheme, theme } from "./theme";

/**
 * Get a color value from the theme by path
 * @param path - Dot notation path to the color (e.g., 'primary.teal')
 * @param mode - Optional theme mode (light or dark)
 * @returns The color value or empty string if not found
 */
export const getColor = (path: string, mode?: ThemeMode): string => {
  const currentTheme = mode ? getTheme(mode) : theme;
  const parts = path.split(".");
  let value: any = currentTheme.colors;

  for (const part of parts) {
    if (value && value[part] !== undefined) {
      value = value[part];
    } else {
      return "";
    }
  }

  return typeof value === "string" ? value : "";
};

/**
 * Get a spacing value from the theme
 * @param key - The spacing key (e.g., 4 for 1rem)
 * @param mode - Optional theme mode (light or dark)
 * @returns The spacing value or undefined if not found
 */
export const getSpacing = (
  key: number | string,
  mode?: ThemeMode
): string | undefined => {
  const currentTheme = mode ? getTheme(mode) : theme;
  return currentTheme.spacing[key as keyof typeof currentTheme.spacing];
};

/**
 * Get a breakpoint value from the theme
 * @param key - The breakpoint key (e.g., 'md')
 * @param mode - Optional theme mode (light or dark)
 * @returns The breakpoint value or undefined if not found
 */
export const getBreakpoint = (
  key: string,
  mode?: ThemeMode
): string | undefined => {
  const currentTheme = mode ? getTheme(mode) : theme;
  return currentTheme.breakpoints[key as keyof typeof currentTheme.breakpoints];
};

/**
 * Get a font size value from the theme
 * @param key - The font size key (e.g., 'lg')
 * @param mode - Optional theme mode (light or dark)
 * @returns The font size value or undefined if not found
 */
export const getFontSize = (
  key: string,
  mode?: ThemeMode
): string | undefined => {
  const currentTheme = mode ? getTheme(mode) : theme;
  return currentTheme.typography.fontSize[
    key as keyof typeof currentTheme.typography.fontSize
  ];
};

/**
 * Get a shadow value from the theme
 * @param key - The shadow key (e.g., 'md')
 * @param mode - Optional theme mode (light or dark)
 * @returns The shadow value or undefined if not found
 */
export const getShadow = (
  key: string,
  mode?: ThemeMode
): string | undefined => {
  const currentTheme = mode ? getTheme(mode) : theme;
  return currentTheme.shadows[key as keyof typeof currentTheme.shadows];
};

/**
 * Get CSS variables for the theme
 * @param mode - Optional theme mode (light or dark)
 * @returns Object with CSS variable definitions
 */
export const getThemeCssVars = (mode?: ThemeMode) => {
  const currentTheme = mode ? getTheme(mode) : theme;
  const cssVars: Record<string, string> = {};

  // Add color variables
  Object.entries(currentTheme.colors.primary).forEach(([key, value]) => {
    cssVars[`--color-primary-${key}`] = value;
  });

  Object.entries(currentTheme.colors.neutral).forEach(([key, value]) => {
    cssVars[`--color-neutral-${key}`] = value;
  });

  Object.entries(currentTheme.colors.semantic).forEach(([key, value]) => {
    cssVars[`--color-${key}`] = value;
  });

  // Add spacing variables
  Object.entries(currentTheme.spacing).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = value;
  });

  // Add shadow variables
  Object.entries(currentTheme.shadows).forEach(([key, value]) => {
    cssVars[`--shadow-${key}`] = value;
  });

  // Add brand color variables
  cssVars["--brand-teal"] = currentTheme.colors.primary.teal;
  cssVars["--brand-gold"] = currentTheme.colors.primary.gold;
  cssVars["--nile-teal"] = currentTheme.colors.primary.teal;
  cssVars["--pharaonic-gold"] = currentTheme.colors.primary.gold;

  // Add background and text colors
  cssVars["--bg-light"] = currentTheme.colors.neutral.background;
  cssVars["--dark-gray"] = currentTheme.colors.neutral.gray800;
  cssVars["--medium-gray"] = currentTheme.colors.neutral.gray500;
  cssVars["--light-gray"] = currentTheme.colors.neutral.gray200;

  return cssVars;
};

/**
 * Generate CSS variable style objects for use in components
 */
export const lightThemeCssVars = getThemeCssVars("light");
export const darkThemeCssVars = getThemeCssVars("dark");
export const themeCssVars = lightThemeCssVars;

/**
 * Get theme CSS variables based on theme mode
 */
export const getThemeCssVarsByMode = (mode: ThemeMode) => {
  return mode === "dark" ? darkThemeCssVars : lightThemeCssVars;
};
