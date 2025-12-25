import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath, URL } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  root: "src-modern",
  publicDir: "../public-assets",
  base: "./",

  build: {
    outDir: "../dist-modern",
    emptyOutDir: true,
  },

  server: {
    port: 3000,
    open: true,
    cors: true,
    proxy: {
      "/auth": {
        target: "http://localhost:8000/api/",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  preview: {
    port: 4173,
    open: true,
  },

  css: {
    // Enable CSS source maps in development
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        silenceDeprecations: [
          "legacy-js-api",
          "import",
          "global-builtin",
          "color-functions",
        ],
      },
    },
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "src-modern"),
      "~bootstrap": resolve(__dirname, "node_modules/bootstrap"),
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      "bootstrap",
      "alpinejs",
      "chart.js",
      "apexcharts",
      "sweetalert2",
      "dayjs",
    ],
  },
});
