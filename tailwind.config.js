/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        },
        pulse: {
          '0%, 100%': { opacity: '0.05' },
          '50%': { opacity: '0.1' }
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        pulse: 'pulse 4s ease-in-out infinite'
      }
    },
  },
  plugins: [],
} 