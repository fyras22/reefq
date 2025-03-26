/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'brand-teal': '#178086',
        'brand-gold': '#C4A265',
        'nile-teal': '#178086',
        'pharaonic-gold': '#C4A265',
        'dark-gray': '#333333',
        'medium-gray': '#666666',
        'light-gray': '#F5F3F0',
        'bg-light': '#F5F3F0',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
      },
    },
  },
  plugins: [],
} 