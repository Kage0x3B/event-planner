/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/routes/**/*.{html,mjs}', './src/app.html'],
  theme: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/typography'), require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        light: {
          'primary': '#49A4D9',
          'secondary': '#c4b5fd',
          'accent': '#f87171',
          'neutral': '#999EA1',
          'base-100': '#fcfcfc',
          'info': '#49A4D9',
          'success': '#0FA378',
          'warning': '#FBBD23',
          'error': '#f87171'
        }
      }
    ],
    darkTheme: false
  }
};
