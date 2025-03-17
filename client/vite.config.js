import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["framer-motion"],
  },
  build: {
    rollupOptions: {
      external: ["framer-motion"],
    },
    commonjsOptions: {
      include: [/framer-motion/],
    },
  },
});
