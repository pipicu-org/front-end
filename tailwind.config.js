/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--heroui-primary)",
      },
      fontFamily: {
        // poppins: ['poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}