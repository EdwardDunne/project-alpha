/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        brand: '#536de6',
        'brand-dark': '#4558c2',
      },
    },
    // Re-scale spacing so 1rem = 10px (62.5% root font-size).
    // Tailwind default: 1 unit = 0.25rem (4px at 16px root).
    // New:             1 unit = 0.4rem  (4px at 10px root).
    spacing: Object.fromEntries(
      [
        0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12,
        14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96,
      ].map(n => [String(n), `${n * 0.4}rem`])
    ),
  },
  plugins: [],
}
