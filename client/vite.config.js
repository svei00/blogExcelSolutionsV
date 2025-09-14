import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";

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
  plugins: [
    react(),
    // Writes dist/stats.html after every build - a zoomable treemap of
    // what's actually in the bundle and how big each piece is
    // (REBUILD_PLAN 4.2). Doesn't affect the app or the deploy; nothing
    // reads this file at runtime, it's a local debugging artifact.
    visualizer({
      filename: "dist/stats.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
