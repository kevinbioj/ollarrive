import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  preview: {
    port: 4200
  },
  server: {
    proxy: {
      "/api": {
        rewrite: (path) => path.replace(/^\/api/, ""),
        target: "http://localhost:8080",
      },
    },
  },
});
