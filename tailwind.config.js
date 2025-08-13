/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: '#FF00FF',
      },
      fontFamily: {
        poppins: ['poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}