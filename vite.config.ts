import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    // Hot Module Replacement Einstellungen
    hmr: {
      overlay: true,
    },
    // Auto-Reload aktivieren
    watch: {
      usePolling: true,
      interval: 1000,
    },
    // Live-Reload aktivieren
    host: true,
    port: 5173,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
  coverage: {
    reporter: ["text", "html"],
    exclude: ["node_modules/", "src/test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
