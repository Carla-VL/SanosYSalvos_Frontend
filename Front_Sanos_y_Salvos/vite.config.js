import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",

      includeAssets: [
        "favicon.png",
        "pwa-192x192.png",
        "pwa-512x512.png",
        "pwa-maskable-512x512.png",
      ],

      manifest: {
        id: "/",
        name: "Sanos y Salvos",
        short_name: "Sanos y Salvos",

        description:
          "Plataforma para reportar, localizar y ayudar a mascotas perdidas, encontradas y en adopción.",

        start_url: "/",
        scope: "/",

        display: "standalone",
        orientation: "portrait-primary",

        theme_color: "#2563eb",
        background_color: "#ffffff",

        lang: "es",
        categories: ["pets", "social", "utilities"],

        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff,woff2}",
        ],
        cleanupOutdatedCaches: true,
      },
    }),
  ],

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.js",
  },
});