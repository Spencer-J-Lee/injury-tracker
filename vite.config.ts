import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // The package's "browser" field points to a UMD bundle whose default
      // export is the whole CJS exports object, not the Lottie component
      // itself. Force resolution to the real ESM build instead.
      "lottie-react": path.resolve(
        __dirname,
        "./node_modules/lottie-react/build/index.es.js",
      ),
    },
  },
});
