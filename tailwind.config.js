const typography = require('@tailwindcss/typography');
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{tsx,ts}'],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.900'),
            'max-width': '100%',
            a: {
              color: theme('colors.blue.600'),
              'text-decoration': 'none',
              '&:hover': {
                color: theme('colors.blue.500'),
              },
            },
            'h2, h3, h4': {
              'scroll-margin-top': '5rem',
            },
            pre: {
              'background-color': theme('colors.gray.50'),
              'border-radius': '.025rem',
              color: theme('colors.gray.900'),
            },
          },
        },
      }),
      fontFamily: {
        sans: ['Poppins', ...fontFamily.sans],
        mono: ['"Jetbrains Mono"', ...fontFamily.mono],
      },
    },
  },
  plugins: [typography],
};
