// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    react({
      // Allow the plugin to transform JSX in .js files too
      include: [/\.jsx?$/, /\.tsx?$/],
    }),
  ],
  resolve: {
    // Keep @ pointing to project root (so "@/pages/..." etc. work)
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  optimizeDeps: {
    esbuildOptions: {
      // During dep pre-bundle, parse .js as JSX
      loader: { ".js": "jsx" },
    },
  },
});
