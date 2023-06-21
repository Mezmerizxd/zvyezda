/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{tsx, ts}'],
  theme: {
    extend: {
      colors: {
        background: '#262929',
        'light-background': '#2B2F2F',
        'light-blue': '#00fbff',
        'dark-blue': '#02DADD',
        'light-green': '#00ffa6',
        'dark-green': '#00DF91',
      },
    },
  },
  plugins: [],
};
