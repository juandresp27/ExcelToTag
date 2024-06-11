/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {},
    fontFamily: {
      "DMSans": ["DM_serif", "sans-serif"],
      "amulya": ["amulya", "sans-serif"],
      "Synonym": ["Synonym", "sans-serif"]
    }
  },
  plugins: [],
}

