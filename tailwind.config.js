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
        sage: 'var(--color-sage)',
        forest: {
          DEFAULT: 'var(--color-forest)',
          dark: 'var(--color-forest-dark)',
        },
        ink: 'var(--color-ink)',
        sky: 'var(--color-sky)',
        lavender: 'var(--color-lavender)',
      },
    },
  },
  plugins: [],
}
