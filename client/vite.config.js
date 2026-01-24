import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  // Vite loads .env from its own root (client/) by default, so the
  // repo-root .env - the single place every other secret lives, and the
  // one DEPLOY.md tells you to edit - was invisible to the build. That
  // silently compiled `apiKey: undefined` into firebase.js and broke
  // "Continue with Google" (auth/invalid-api-key) while leaving
  // email/password sign-in working, which is why it looked like a
  // backend problem. Point envDir at the repo root so there is exactly
  // one .env for the whole project. Only VITE_*-prefixed vars are
  // exposed to the client; MongoDB/JWT_SECRET stay server-side.
  envDir: "..",

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
