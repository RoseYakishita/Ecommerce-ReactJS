/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8b5a2b", // wood tone
        secondary: "#e8e4d9", // beige
        background: "#f5f5f0", // soft white/beige
        textMain: "#333333",
        textLight: "#666666",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
