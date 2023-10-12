const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'zvyezda-light': '#00ffa6', // Green
        'zvyezda-dark': '#00DF91', // Green
        // 'radiance-light': '#00fbff', // Blue
        // 'radiance-dark': '#02DADD', // Blue
        // background: '#262929',
        // 'background-light': '#2B2F2F',
        // 'background-dark': '#191919',
        // 'white-light': '#F0F0F0',
        // 'white-dark': '#ABABAB',

        'radiance-light': '#f43f5e',
        'radiance-dark': '#e11d48',
        background: '#1c1917',
        'background-light': '#292524',
        'background-dark': '#0c0a09',
        'white-light': '#F0F0F0',
        'white-dark': '#ABABAB',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
