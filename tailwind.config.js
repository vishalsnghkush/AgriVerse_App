/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          900: '#081C15',
          800: '#1B4332',
          700: '#2D6A4F',
          600: '#40916C',
          500: '#52B788',
          200: '#D8F3DC'
        },
        alert: {
          red: '#D62828',
          orange: '#F77F00',
          yellow: '#FCBF49',
          green: '#38B000'
        }
      }
    },
  },
  plugins: [],
}
