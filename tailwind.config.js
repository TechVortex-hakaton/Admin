/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfdf5',
          100: '#d1fae8',
          200: '#a3f3d1',
          300: '#6ee7b3',
          400: '#34d399',
          500: '#16b981',
          600: '#0d9c6c',
          700: '#0a7c58',
          800: '#0a6248',
          900: '#08503c',
        },
        accent: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)',
        card: '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 8px 24px -8px rgb(15 23 42 / 0.10)',
        glow: '0 0 0 1px rgb(13 156 108 / 0.05), 0 8px 24px -4px rgb(13 156 108 / 0.28)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(4px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(24px, -32px) scale(1.08)' },
          '66%': { transform: 'translate(-16px, 16px) scale(0.95)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out',
        blob: 'blob 12s infinite ease-in-out',
      },
    },
  },
  plugins: [],
};
