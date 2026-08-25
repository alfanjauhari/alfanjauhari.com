import { defineConfig } from "tsup";

export default defineConfig({
	clean: true,
	dts: true,
	entry: {
		oxfmt: "src/oxfmt.ts",
		oxlint: "src/oxlint.ts",
		"oxlint-solid": "src/oxlint-solid.ts",
		"tailwind-typography": "src/tailwind-typography.ts",
	},
	external: ["oxfmt", "oxlint"],
	format: ["esm"],
	platform: "node",
	sourcemap: true,
	target: "es2022",
	// for json files
	publicDir: "static",
});
