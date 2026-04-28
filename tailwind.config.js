/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#05050a',
          900: '#0a0a12',
          800: '#10101c',
          700: '#181828',
          600: '#1e1e34',
        },
        cyan: {
          400: '#00e5ff',
          500: '#00d4ee',
          600: '#00b8d4',
        },
        danger: {
          400: '#ff3366',
          500: '#e6294d',
          600: '#cc1f3f',
        },
        warn: {
          400: '#ffaa00',
          500: '#e69900',
        },
        success: {
          400: '#00e676',
          500: '#00c853',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'scan-line': 'scan-line 2.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        'scan-line': {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
