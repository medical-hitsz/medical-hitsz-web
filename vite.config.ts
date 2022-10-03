import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 8080,
      open: true,
      proxy: {
        "/api": {
          target: "http://120.79.133.221:8000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/api/"),
        },
      },
    },
  };
});
