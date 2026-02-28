/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red:     '#DC2626',
          redDark: '#B91C1C',
          redLight:'#FEE2E2',
          yellow:  '#FBBF24',
          yellowDark:'#D97706',
          cream:   '#FFF8F0',
          warm:    '#FFF3E0',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body:    ['"Nunito"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 16px rgba(220,38,38,0.08)',
        cardHover: '0 6px 24px rgba(220,38,38,0.18)',
      },
    },
  },
  plugins: [],
}
