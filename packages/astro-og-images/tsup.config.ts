import { defineConfig } from "tsup";

export default defineConfig({
	clean: true,
	dts: true,
	entry: {
		index: "src/index.ts",
		path: "src/path.ts",
	},
	external: ["astro", "@takumi-rs/core", "jsdom", "takumi-js"],
	format: ["esm"],
	platform: "node",
	sourcemap: true,
	target: "es2022",
});
