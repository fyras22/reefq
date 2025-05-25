/**
 * Central theme configuration for the ReefQ application
 * This file defines all design tokens used throughout the application
 */

export type ThemeMode = "light" | "dark";

// Base theme configuration
const baseTheme = {
  // Typography
  typography: {
    fontFamily: {
      sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      serif:
        'Playfair Display, Georgia, Cambria, "Times New Roman", Times, serif',
    },
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
      "6xl": "3.75rem", // 60px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },

  // Spacing
  spacing: {
    px: "1px",
    0: "0",
    0.5: "0.125rem",
    1: "0.25rem",
    1.5: "0.375rem",
    2: "0.5rem",
    2.5: "0.625rem",
    3: "0.75rem",
    3.5: "0.875rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    11: "2.75rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    28: "7rem",
    32: "8rem",
    36: "9rem",
    40: "10rem",
    44: "11rem",
    48: "12rem",
    52: "13rem",
    56: "14rem",
    60: "15rem",
    64: "16rem",
    72: "18rem",
    80: "20rem",
    96: "24rem",
  },

  // Breakpoints
  breakpoints: {
    xs: "480px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // Border radius
  borderRadius: {
    none: "0",
    sm: "0.125rem",
    DEFAULT: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },

  // Z-index
  zIndex: {
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
    auto: "auto",
  },

  // Transitions
  transitions: {
    duration: {
      75: "75ms",
      100: "100ms",
      150: "150ms",
      200: "200ms",
      300: "300ms",
      500: "500ms",
      700: "700ms",
      1000: "1000ms",
    },
    timing: {
      linear: "linear",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
};

// Light theme colors
export const lightTheme = {
  ...baseTheme,
  colors: {
    // Primary brand colors
    primary: {
      teal: "#178086", // Nile Teal
      gold: "#C4A265", // Pharaonic Gold
    },

    // Neutral colors
    neutral: {
      white: "#FFFFFF",
      background: "#F5F3F0",
      gray50: "#F9FAFB",
      gray100: "#F3F4F6",
      gray200: "#E5E7EB",
      gray300: "#D1D5DB",
      gray400: "#9CA3AF",
      gray500: "#6B7280",
      gray600: "#4B5563",
      gray700: "#374151",
      gray800: "#1F2937",
      gray900: "#111827",
      black: "#000000",
    },

    // Semantic colors
    semantic: {
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    },
  },

  // Light theme specific shadows
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    none: "none",
  },
};

// Dark theme colors
export const darkTheme = {
  ...baseTheme,
  colors: {
    // Primary brand colors - slight adjustments for dark mode
    primary: {
      teal: "#1a9da5", // Brighter Nile Teal for dark backgrounds
      gold: "#d4b275", // Brighter Pharaonic Gold for dark backgrounds
    },

    // Neutral colors inverted for dark mode
    neutral: {
      white: "#111827", // Inverted - using near black
      background: "#1F2937", // Dark bg
      gray50: "#111827",
      gray100: "#1F2937",
      gray200: "#374151",
      gray300: "#4B5563",
      gray400: "#6B7280",
      gray500: "#9CA3AF",
      gray600: "#D1D5DB",
      gray700: "#E5E7EB",
      gray800: "#F3F4F6",
      gray900: "#F9FAFB",
      black: "#FFFFFF", // Inverted to white
    },

    // Semantic colors - adjusted for dark mode
    semantic: {
      success: "#10B981", // Keep same
      warning: "#F59E0B", // Keep same
      error: "#EF4444", // Keep same
      info: "#3B82F6", // Keep same
    },
  },

  // Dark theme specific shadows
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.25)",
    DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.26)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.26)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.25)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.24)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.45)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.26)",
    none: "none",
  },
};

// Export light theme as default theme
export const theme = lightTheme;

/**
 * Get the appropriate theme based on mode
 */
export function getTheme(mode: ThemeMode) {
  return mode === "dark" ? darkTheme : lightTheme;
}

// Helper functions to use theme values
export const getColor = (path: string, mode: ThemeMode = "light"): string => {
  const currentTheme = getTheme(mode);
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

export default theme;
