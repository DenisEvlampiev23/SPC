/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '576px',
      'md': '960px',
      'lg': '1440px',
    },
    extend: {
      colors: {
        'brand': '#4355FF',
        'back': '#F6F7FB'
      }
    },
  },
  plugins: [],
}

