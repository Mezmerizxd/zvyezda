const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'zvyezda-light': '#00ffa6', // Green
        'zvyezda-dark': '#00DF91', // Green
        'radiance-light': '#00fbff', // Blue
        'radiance-dark': '#02DADD', // Blue
        background: '#262929',
        'background-light': '#2B2F2F',
        'background-dark': '#191919',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
