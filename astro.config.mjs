// @ts-check

import cloudflare from "@astrojs/cloudflare";
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import mermaid from "astro-mermaid";
import viteLucidePreprocess from "vite-plugin-lucide-preprocess";

export default defineConfig({
	site: "https://alfanjauhari.com",
	adapter: cloudflare(),
	output: "static",
	integrations: [
		mermaid(),
		mdx({
			processor: unified({
				gfm: true,
			}),
		}),
		sitemap(),
		solidJs(),
	],
	vite: {
		plugins: [viteLucidePreprocess(), tailwindcss()],
		resolve: {
			alias: {
				"@": "/src",
			},
		},
	},
	image: {
		domains: ["res.cloudinary.com"],
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
		},
	},
});
