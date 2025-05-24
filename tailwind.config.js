/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "select-arrow":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
      },
      backgroundPosition: {
        "right-center": "right 0.5rem center",
      },
      colors: {
        "brand-teal": "var(--brand-teal)",
        "brand-gold": "var(--brand-gold)",
        "nile-teal": "var(--nile-teal)",
        "pharaonic-gold": "var(--pharaonic-gold)",
        "dark-gray": "var(--dark-gray)",
        "medium-gray": "var(--medium-gray)",
        "light-gray": "var(--light-gray)",
        "bg-light": "var(--bg-light)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        info: "var(--color-info)",
      },
      fontFamily: {
        sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        serif: ["var(--font-playfair)", "serif"],
      },
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
      textColor: {
        skin: {
          base: "var(--dark-gray)",
        },
      },
      backgroundColor: {
        skin: {
          base: "var(--bg-light)",
          card: "var(--color-neutral-white)",
        },
      },
    },
  },
  plugins: [],
};
