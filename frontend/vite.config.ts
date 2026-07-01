import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react(), tailwindcss(), svgr()],
  server: {
    watch: { usePolling: true },
  },
});
