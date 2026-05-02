/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        bone: '#ebe6db',
        paper: '#f4f0e6',
        ink: {
          950: '#050506',
          900: '#08080a',
          850: '#0b0b0e',
          800: '#111114',
          700: '#17171c',
          600: '#22222a',
          500: '#2d2d38',
        },
        neo: {
          red: '#ff2447',
          'red-2': '#ff4a5e',
          blue: '#2c5bff',
          'blue-2': '#4a76ff',
          yellow: '#ffe23e',
        },
      },
      animation: {
        'marquee': 'marquee 80s linear infinite',
        'marquee-slow': 'marquee 120s linear infinite',
        'marquee-fast': 'marquee 40s linear infinite',
        'flicker': 'flicker 3.5s infinite',
        'scan': 'scan 6s linear infinite',
        'blink': 'blink 1s steps(1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.85' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        blink: {
          '50%': { opacity: '0' },
        },
      },
      letterSpacing: {
        tightest: '-0.055em',
      },
    },
  },
  plugins: [],
}
