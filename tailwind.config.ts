import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#c0392b',
          dark: '#a93226',
          light: '#e74c3c',
        },
        navy: {
          DEFAULT: '#1a2e5a',
          dark: '#0f1e3d',
          light: '#2c4a8a',
        },
        secondary: {
          DEFAULT: '#1a2e5a',
          dark: '#0f1e3d',
          light: '#2c4a8a',
        },
      },
      fontFamily: {
        sans: ['Nunito Sans', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: false,
    base: false,
  }
}
export default config
