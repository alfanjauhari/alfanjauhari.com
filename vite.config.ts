import contentCollections from "@content-collections/vite";
import tailwindcss from "@tailwindcss/vite";
import takumiPackageJson from "@takumi-rs/core/package.json" with {
  type: "json",
};
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
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
    nitro(),
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
  nitro: {
    externals: {
      external: ["@takumi-rs/core"],
      traceInclude: Object.keys(takumiPackageJson.optionalDependencies),
    },
    publicAssets: [
      {
        baseURL: "images",
        dir: "public/images",
        maxAge: 60 * 60 * 24 * 365, // 1 year,
      },
      {
        baseURL: "fonts",
        dir: "public/fonts",
        maxAge: 60 * 60 * 24 * 365, // 1 year,
      },
    ],
    compressPublicAssets: true,
  },
});

export default config;
