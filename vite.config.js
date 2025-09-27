// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)), // "@/..." => project root
    },
  },
  // base: "/vault-app/" // ONLY set at deploy if you host under a subpath
});
