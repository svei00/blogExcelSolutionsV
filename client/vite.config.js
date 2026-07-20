import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        secure: false,
      },
    },
  },
  // Build to the local dist/, never straight to the nginx root. Vite wipes
  // outDir *before* it writes, so pointing it at the live site means any
  // build failure leaves visitors on a blank directory. The deploy workflow
  // rsyncs dist/ into place only after the build exits 0.
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  plugins: [react()],
});
