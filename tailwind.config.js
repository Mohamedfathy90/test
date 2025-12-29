/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        almarai: ["Almarai", "sans-serif"],
      },
      fontWeight: {
        // أوزان Almarai
        light: 300,
        normal: 400,
        bold: 700,
        extrabold: 800,
      },
    },
  },
  plugins: [],
};
