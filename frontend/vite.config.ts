import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv, type ProxyOptions } from "vite";

import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isDev = env.NODE_ENV === "development";

  const serverProxy: Record<string, string | ProxyOptions> | undefined = isDev
    ? {
        "/api": {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: {
            "*": "",
          },
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      }
    : undefined;

  return {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [react(), tailwindcss(), svgr()],
    server: {
      proxy: serverProxy,
      watch: { usePolling: true },
    },
  };
});
