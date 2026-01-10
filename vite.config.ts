import contentCollections from "@content-collections/vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { analyzer } from "vite-bundle-analyzer";
import viteTsConfigPaths from "vite-tsconfig-paths";

const nonPrerenderedRoutes = [
  "/resume.pdf",
  "/updates/r",
  "/dashboard",
  "/api",
  "/auth/",
];

const config = defineConfig({
  plugins: [
    devtools(),
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        filter: ({ path }) => {
          if (!nonPrerenderedRoutes.some((_path) => path.includes(_path))) {
            return true;
          }

          return false;
        },
      },
      sitemap: {
        host: "http://localhost:3000",
      },
      vite: {
        installDevServerMiddleware: true,
      },
    }),
    viteReact(),
    contentCollections(),
    analyzer({
      enabled: process.env.BUILD_ANALYZE === "true",
    }),
  ],
  optimizeDeps: {
    exclude: ["@takumi-rs/core"],
  },
});

export default config;
