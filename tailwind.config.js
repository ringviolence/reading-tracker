/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: '#D7E4B4',
        forest: {
          DEFAULT: '#5B7553',
          dark: '#4a6044',
        },
        ink: '#0A210F',
        sky: '#C5EAFB',
        lavender: '#CFBAE1',
      },
    },
  },
  plugins: [],
}
