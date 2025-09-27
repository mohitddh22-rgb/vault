// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Use this ONLY if deploying under a subpath (e.g. https://example.com/vault-app/)
  base: "/"
});
