import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig, type PluginOption } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

/**
 * jsxLocPlugin en vitePluginManusRuntime zijn bouwgereedschap voor de
 * Manus-editor en horen niet in de uitgeleverde site.
 *
 * vitePluginManusRuntime zette een inline script van ~359 kB als eerste
 * element in de <body> van elke gebouwde pagina, met een eigen kopie van
 * React erin. Dat maakte index.html 374 kB (107 kB gzip) en blokkeerde het
 * renderen tot het script was uitgevoerd. jsxLocPlugin voegde 3.009
 * data-loc-attributen met bronpaden en regelnummers toe.
 *
 * Terugzetten in productie? Verplaats de twee plugins terug naar de vaste
 * lijst hieronder. Let op dat de site er dan weer 107 kB gzip per
 * paginaweergave bij krijgt.
 *
 * LET OP: server/_core/vite.ts importeert deze config en moet hem als
 * functie aanroepen. Maak er geen kaal object meer van zonder dat mee te
 * veranderen; een spread van een functie levert een lege config op.
 */
export default defineConfig(({ command }) => {
  const isDev = command === "serve";
  const plugins: PluginOption[] = [react(), tailwindcss()];

  if (isDev) {
    plugins.push(jsxLocPlugin(), vitePluginManusRuntime());
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    envDir: path.resolve(import.meta.dirname),
    root: path.resolve(import.meta.dirname, "client"),
    publicDir: path.resolve(import.meta.dirname, "client", "public"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
      cssMinify: true,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // React core - loaded on every page
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'react-vendor';
            }
            // Radix UI components
            if (id.includes('node_modules/@radix-ui/')) {
              return 'ui-vendor';
            }
            // tRPC and data fetching
            if (id.includes('node_modules/@trpc/') || id.includes('node_modules/@tanstack/')) {
              return 'trpc-vendor';
            }
            // Icons
            if (id.includes('node_modules/lucide-react/')) {
              return 'icons-vendor';
            }
            // Utilities
            if (id.includes('node_modules/clsx/') || 
                id.includes('node_modules/tailwind-merge/') || 
                id.includes('node_modules/class-variance-authority/') ||
                id.includes('node_modules/date-fns/')) {
              return 'utils-vendor';
            }
          },
        },
      },
    },
    server: {
      host: true,
      allowedHosts: [
        ".manuspre.computer",
        ".manus.computer",
        ".manus-asia.computer",
        ".manuscomputer.ai",
        ".manusvm.computer",
        "localhost",
        "127.0.0.1",
      ],
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
