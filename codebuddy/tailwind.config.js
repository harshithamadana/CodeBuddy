/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Nebula surface stack
        neb: {
          0: '#060512',
          1: '#0D0B22',
          2: '#141230',
          3: '#1C193B',
          4: '#252249',
        },
        // Primary — Electric Violet
        primary: {
          DEFAULT: '#7C5CFC',
          bright: '#9B7FFF',
        },
        // Deep Dive mode — Sky Blue
        ocean: {
          DEFAULT: '#4EA8DE',
          bright: '#71BCEC',
        },
        // Debug mode
        amber: {
          DEFAULT: '#F59E0B',
          bright: '#FBB947',
        },
        // Fuchsia accent for gradient
        fuchsia: {
          accent: '#C761E0',
        },
        // Text scale
        ink: {
          primary: '#F2EFFF',
          secondary: '#9E9AC0',
          muted: '#4A4672',
        },
        // Semantic
        success: '#34D399',
        danger:  '#FB7185',
      },
      fontFamily: {
        sora:  ['Sora',            'sans-serif'],
        inter: ['Inter',           'sans-serif'],
        mono:  ['"JetBrains Mono"','monospace'],
      },
      borderRadius: {
        pill: '99px',
      },
      animation: {
        'fade-up':    'fadeUp 0.22s ease forwards',
        'dot-breathe':'dotBreathe 2.4s ease-in-out infinite',
        'dot-think':  'dotBreathe 0.65s ease-in-out infinite',
        'badge-pulse':'badgePulse 2.8s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        dotBreathe: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%':      { opacity: '1',   transform: 'scale(1.4)' },
        },
        badgePulse: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%':      { opacity: '1',   transform: 'scale(1.3)' },
        },
      },
    },
  },
  plugins: [],
};
