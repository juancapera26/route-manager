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
      ".ngrok-free.app", // ✅ permite cualquier subdominio de ngrok
    ],
    host: true, // ✅ necesario para exponer la app fuera de localhost
    port: 5174, // ✅ puerto fijo (así siempre usas el mismo en ngrok)
  },
  build: {
    sourcemap: true, // 🔍 Habilita sourcemaps para depurar en Vercel
    // ❌ `manualChunks` desactivado para evitar errores de ejecución
    // Vite gestionará los chunks automáticamente
  },
});
