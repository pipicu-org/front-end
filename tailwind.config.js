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
        black: "var(--heroui-black)",
      },
      fontFamily: {
        // poppins: ['poppins', 'sans-serif'],
      },
    },
  },
  // plugins: [require('tailwind-scrollbar')],
}