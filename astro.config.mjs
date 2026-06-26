// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import remarkGfm from "remark-gfm";
import viteLucidePreprocess from 'vite-plugin-lucide-preprocess';

export default defineConfig({
    site: "https://alfanjauhari.com",
    adapter: cloudflare(),
    output: "static",
    integrations: [mdx({ remarkPlugins: [remarkGfm] }), sitemap(), solidJs()],
    vite: {
        plugins: [viteLucidePreprocess(), tailwindcss()],
        resolve: {
            alias: {
                "@": "/src",
            },
        },
    },
    markdown: {
        shikiConfig: {
            themes: {
                light: "catppuccin-latte",
                dark: "catppuccin-mocha",
            },
            wrap: true,
        },
    },
    env: {
        schema: {
            // Secret, server-only — used in later phases
            DATABASE_URL: envField.string({
                access: "secret",
                context: "server",
                optional: true,
                url: true,
            }),
            BETTER_AUTH_URL: envField.string({
                access: "secret",
                context: "server",
                optional: true,
                url: true,
            }),
            GOOGLE_CLIENT_ID: envField.string({
                access: "secret",
                context: "server",
                optional: true,
            }),
            GOOGLE_CLIENT_SECRET: envField.string({
                access: "secret",
                context: "server",
                optional: true,
            }),
            GITHUB_CLIENT_ID: envField.string({
                access: "secret",
                context: "server",
                optional: true,
            }),
            GITHUB_CLIENT_SECRET: envField.string({
                access: "secret",
                context: "server",
                optional: true,
            }),
            RESEND_API_TOKEN: envField.string({
                access: "secret",
                context: "server",
                optional: true,
            }),
            REDIS_URL: envField.string({
                access: "secret",
                context: "server",
                optional: true,
                url: true,
            }),
        },
    },
});