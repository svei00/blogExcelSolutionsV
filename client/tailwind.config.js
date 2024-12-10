// tailwind.config.mjs

import flowbite from "flowbite/plugin"; // Import the flowbite plugin
import tailwindScrollbar from "tailwind-scrollbar"; // Import the tailwind scrollbar plugin

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
        blueEx: "#3182DF",
        greenEx: "#21B868",
        github: "#6cc644",
        linkedin: "#0a66c2",
        xTwitter: "#1DA1F2",
        instagram: "#E4405F",
        facebook: "#1877F2",
        tiktok: "#ff0050",
        dribbble: "#ea4c89",
      },
    },
  },
  plugins: [flowbite, tailwindScrollbar], // Correct plugin usage
};
