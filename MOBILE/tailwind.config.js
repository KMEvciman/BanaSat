/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Web ile birebir aynı marka rengi ve nötr koyu tema paleti.
        primary: "#5BB678",
        "background-light": "#f6f6f8",
        "background-dark": "#000000",
        gray: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#2e2e2e",
          800: "#1a1a1a",
          900: "#000000",
          950: "#000000",
        },
      },
    },
  },
  plugins: [],
};
