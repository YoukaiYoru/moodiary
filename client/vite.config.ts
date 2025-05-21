import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import svgSpritePlugin from "vite-plugin-svg-sprite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgSpritePlugin({ include: ["*.svg"] })],
  resolve: {
    alias: {
      "@": "/src",
      "@ui": "/src/components/ui",
      // '@components': path.resolve(__dirname, './src/components'),
    },
  },
  server: {
    host: false,
    // proxy: {
    //   "/api/v1": {
    //     target: "http://localhost:5001", // backend
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
});
