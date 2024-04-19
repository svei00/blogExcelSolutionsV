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
      github: "#6cc644",
      linkedin: "#0a66c2",
      xTwitter: "#14171a",
      instagram: "#E4405F",
      facebook: "#1877F2",
      tiktok: "#ff0050",
      dribbble: "#ea4c89",
    },
    extend: {},
  },
  plugins: [require("flowbite/plugin"), require("tailwind-scrollbar")],
};
