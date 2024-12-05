/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          honey: {
            light: '#fdf6e3',
            DEFAULT: '#f6e05e',
            dark: '#d97706',
          },
        },
      },
    },
    plugins: [],
  };