import { nextui } from "@nextui-org/react";
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Incluye el archivo HTML principal
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",

  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        athletic: ['FTY Old Sport Athletic', 'sans-serif'],
      },
    },
  },
  plugins: [],
};