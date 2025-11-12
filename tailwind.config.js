/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme palette inspired by Claude
        dark: {
          50: '#e8e8e8',
          100: '#b8b8b8',
          200: '#888888',
          300: '#585858',
          400: '#383838',
          500: '#2c2c2c',
          600: '#232323',
          700: '#1a1a1a',
          800: '#121212',
          850: '#0f0f0f',
          900: '#0a0a0a',
          950: '#000000',
        },
        accent: {
          50: '#f5f3f0',
          100: '#e6e1d9',
          200: '#d4ccc0',
          300: '#c2b6a7',
          400: '#b0a08e',
          500: '#9e8b75',
          600: '#8c765c',
          700: '#705e49',
          800: '#544636',
          900: '#382e23',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}
