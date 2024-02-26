/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      blueEx: "#3182DF",
      greenEx: "#21B868",
    },
    extend: {
      // Override The active
      // active: {
      //   textColor: "blue",
      //   backgroundColor: "#21B868",
      // },
    },
  },
  plugins: [import("flowbite/plugin")],
};
