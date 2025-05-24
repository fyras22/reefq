"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({
  className = "",
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, setTheme, isThemeLoaded } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isThemeLoaded) {
    return <div className={`w-10 h-10 ${className}`} />;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center space-x-1 bg-neutral-700 dark:bg-neutral-800 p-1 rounded-lg">
        <button
          onClick={() => setTheme("light")}
          className={`p-2 rounded-md ${
            theme === "light"
              ? "bg-white text-neutral-900"
              : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-600/50"
          }`}
          aria-label="Light mode"
          title="Light mode"
        >
          <Sun size={18} />
          {showLabel && theme === "light" && (
            <span className="ml-2 text-sm">Light</span>
          )}
        </button>

        <button
          onClick={() => setTheme("dark")}
          className={`p-2 rounded-md ${
            theme === "dark"
              ? "bg-neutral-900 text-white"
              : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-600/50"
          }`}
          aria-label="Dark mode"
          title="Dark mode"
        >
          <Moon size={18} />
          {showLabel && theme === "dark" && (
            <span className="ml-2 text-sm">Dark</span>
          )}
        </button>

        <button
          onClick={() => setTheme("system")}
          className={`p-2 rounded-md ${
            theme === "system"
              ? "bg-neutral-800 text-white dark:bg-neutral-700"
              : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-600/50"
          }`}
          aria-label="System preference"
          title="System preference"
        >
          <Monitor size={18} />
          {showLabel && theme === "system" && (
            <span className="ml-2 text-sm">System</span>
          )}
        </button>
      </div>
    </div>
  );
}
