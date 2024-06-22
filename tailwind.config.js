/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
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
  plugins: [nextui()]
}

