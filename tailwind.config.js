/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: '#2D0A16',
        deep: '#1A0509',
        blush: '#F2C4CE',
        rose: '#D4809A',
        champagne: '#E8D5B7',
        gold: '#C9A84C',
        'gold-light': '#E4C97B',
        ivory: '#FAF6F0',
        'text-dim': '#C4A4AE',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Lato', 'sans-serif'],
      },
      borderRadius: {
        sm: '2px',
        md: '4px',
        lg: '8px',
      },
      transitionDuration: {
        DEFAULT: '0.2s',
      },
    },
  },
  plugins: [],
}
