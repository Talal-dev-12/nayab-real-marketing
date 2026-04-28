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
      },
      fontFamily: {
        sans: ['Nunito Sans', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: false, // disable all themes so it doesn't override the custom app theme
    base: false, // disable base styling
  }
}
export default config
