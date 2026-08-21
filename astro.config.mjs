// @ts-check

import { readFileSync } from "node:fs";
import cloudflare from "@astrojs/cloudflare";
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import mermaid from "astro-mermaid";
import viteLucidePreprocess from "vite-plugin-lucide-preprocess";
import ogImages from "./src/integrations/og/index.ts";
import { renderOgTemplate } from "./src/integrations/og/template.ts";

/**
 * @param {string} filename
 * @param {string} name
 * @param {"normal" | "italic"} [style]
 */
const font = (filename, name, style) => ({
	data: readFileSync(new URL(`./public/fonts/${filename}`, import.meta.url)),
	name,
	...(style ? { style } : {}),
});

export default defineConfig({
	site: "https://alfanjauhari.com",
	adapter: cloudflare(),
	output: "static",
	integrations: [
		ogImages({
			fontFamilies: ["Inter", "JetBrains Mono", "Playfair Display"],
			fonts: [
				font("Inter.woff2", "Inter"),
				font("JetBrains-Mono.woff2", "JetBrains Mono"),
				font("Playfair-Display.woff2", "Playfair Display"),
				font("Playfair-Display-Italic.woff2", "Playfair Display", "italic"),
			],
			height: 630,
			format: "webp",
			render: renderOgTemplate,
			verbose: true,
			width: 1200,
		}),
		mermaid(),
		mdx({
			processor: unified({
				gfm: true,
			}),
		}),
		sitemap({
			filter: (page) => !page.includes("/dashboard"),
		}),
		solidJs(),
	],
	vite: {
		plugins: [viteLucidePreprocess(), tailwindcss()],
		resolve: {
			alias: {
				"@": "/src",
			},
		},
		ssr: {
			external: ["takumi-js", "@takumi-rs/core", "@takumi-rs/helpers", "jsdom"],
		},
	},
	markdown: {
		shikiConfig: {
			themes: {
				light: "catppuccin-latte",
				dark: "catppuccin-mocha",
			},
			wrap: true,
			transformers: [
				{
					pre(node) {
						this.addClassToHast(node, this.options.lang);
					},
					code(node) {
						this.addClassToHast(node, this.options.lang);
					},
				},
			],
		},
	},
	env: {
		schema: {
			CLOUDFLARE_ACCOUNT_ID: envField.string({
				access: "secret",
				context: "server",
				optional: true,
			}),
			CLOUDFLARE_DATABASE_ID: envField.string({
				access: "secret",
				context: "server",
				optional: true,
			}),
			CLOUDFLARE_D1_TOKEN: envField.string({
				access: "secret",
				context: "server",
				optional: true,
			}),
			BETTER_AUTH_URL: envField.string({
				access: "public",
				context: "client",
				url: true,
			}),
			GOOGLE_CLIENT_ID: envField.string({
				access: "secret",
				context: "server",
			}),
			GOOGLE_CLIENT_SECRET: envField.string({
				access: "secret",
				context: "server",
			}),
			GITHUB_CLIENT_ID: envField.string({
				access: "secret",
				context: "server",
			}),
			GITHUB_CLIENT_SECRET: envField.string({
				access: "secret",
				context: "server",
			}),
			RESEND_API_TOKEN: envField.string({
				access: "secret",
				context: "server",
			}),
			ADMIN_EMAIL: envField.string({
				access: "secret",
				context: "server",
				optional: true,
			}),
			REDIS_URL: envField.string({
				access: "secret",
				context: "server",
				url: true,
				optional: true,
			}),
			CLOUDFLARE_TURNSTILE_SITE_KEY: envField.string({
				access: "public",
				context: "client",
			}),
			CLOUDFLARE_TURNSTILE_SECRET_KEY: envField.string({
				access: "secret",
				context: "server",
			}),
		},
	},
});
