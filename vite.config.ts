import { defineConfig } from "vite";
import { resolve, join } from "path";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(join(process.cwd(), "src")),
      pages: resolve(join(process.cwd(), "src/pages")),
      hooks: resolve(join(process.cwd(), "src/components/hooks")),
      components: resolve(join(process.cwd(), "src/components")),
    },
  },
  plugins: [react()],
  clearScreen: false,
  server: {
    strictPort: true,
  },
  envPrefix: [
    "VITE_",
    "TAURI_PLATFORM",
    "TAURI_ARCH",
    "TAURI_FAMILY",
    "TAURI_PLATFORM_VERSION",
    "TAURI_PLATFORM_TYPE",
    "TAURI_DEBUG",
  ],
  build: {
    target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
  optimizeDeps: {
    force: true,
  },
});
