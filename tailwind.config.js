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
      fontFamily: {
        sans: ['var(--font-roboto)'],
        serif: ['var(--font-playfair)'],
      },
      colors: {
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#0B7D77',
          600: '#0e7490',
          700: '#155e75',
          800: '#164e63',
          900: '#083344',
          950: '#042f2e',
        },
        'brand-teal': '#178086',
        'brand-gold': '#C4A265',
        'nile-teal': 'rgb(var(--nile-teal))',
        'pharaonic-gold': 'rgb(var(--pharaonic-gold))',
        'dark-gray': '#333333',
        'medium-gray': '#666666',
        'light-gray': '#F5F3F0',
        'bg-light': '#F5F3F0',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
} 