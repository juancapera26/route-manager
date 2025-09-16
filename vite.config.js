import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
// https://vite.dev/config/
export default defineConfig({
  define: {
    global: "window",
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  server: {
    allowedHosts: [
      ".ngrok-free.app", // 👈 acepta cualquier subdominio de ngrok
    ],
    port: 5174, // 🔹 puedes fijar un puerto para que siempre sea el mismo
    host: true, // 🔹 necesario para exponerlo fuera de localhost
  },
  build: {
    sourcemap: true, // 🔍 Habilita sourcemaps para depurar en Vercel
    // ❌ `manualChunks` desactivado para evitar errores de ejecución
    // Vite gestionará los chunks automáticamente
  },
});
