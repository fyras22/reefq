"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

interface ThemeSwitchProps {
  className?: string;
}

export function ThemeSwitch({ className = "" }: ThemeSwitchProps) {
  const { resolvedTheme, setTheme, isThemeLoaded } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // If not yet mounted or theme not loaded, render a placeholder with the same dimensions
  // to prevent layout shift
  if (!mounted || !isThemeLoaded) {
    return <div className={`w-9 h-9 ${className}`} />;
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={`p-2 rounded-full bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors ${className}`}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-300" />
      ) : (
        <Moon className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
      )}
    </button>
  );
}
