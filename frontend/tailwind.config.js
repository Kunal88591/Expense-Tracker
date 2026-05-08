/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B1020',
        card: 'rgba(255,255,255,0.06)',
        surface: '#121826',
        accent: {
          blue: '#5B8CFF',
          purple: '#9B6DFF',
          cyan: '#4DE2FF',
          green: '#3EE089',
          red: '#FF5D73'
        },
        textPrimary: '#F8FAFC',
        textSecondary: '#A1A1AA'
      },
      fontFamily: {
        sans: ['Inter', 'Satoshi', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      backdropBlur: {
        glass: '16px',
      }
    },
  },
  plugins: [],
}
