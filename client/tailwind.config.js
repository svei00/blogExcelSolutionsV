// tailwind.config.mjs

import flowbite from "flowbite/plugin"; // Import the flowbite plugin
import tailwindScrollbar from "tailwind-scrollbar"; // Import the tailwind scrollbar plugin
import theme from "./src/config/theme.js"; // 🎛️ single source of truth for brand colors

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js", // For React (flowbite-react)
  ],

  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        ...theme.colors,
      },
      boxShadow: {
        "elevation-sm": theme.elevation.sm,
        "elevation-md": theme.elevation.md,
        "elevation-lg": theme.elevation.lg,
      },
    },
  },
  plugins: [flowbite, tailwindScrollbar], // Correct plugin usage
};
