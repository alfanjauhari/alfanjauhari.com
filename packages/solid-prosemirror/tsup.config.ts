import { defineConfig } from "tsup";
import * as preset from "tsup-preset-solid";

const presetOptions: preset.PresetOptions = {
	entries: [
		{
			entry: "src/index.tsx",
			dev_entry: true,
			server_entry: true,
		},
		{
			name: "core",
			entry: "src/core.ts",
			dev_entry: true,
			server_entry: true,
		},
	],
	modify_esbuild_options(esbuildOptions, permutation) {
		if (permutation.type.jsx) return esbuildOptions;

		return {
			...esbuildOptions,
			conditions: permutation.type.server ? ["solid", "node"] : ["solid", "browser"],
		};
	},
};

export default defineConfig((config) => {
	const watching = !!config.watch;
	const parsedOptions = preset.parsePresetOptions(presetOptions, watching);

	if (!watching) {
		const packageFields = preset.generatePackageExports(parsedOptions);
		const packageExports = packageFields.exports as Record<string, unknown>;

		packageFields.main = "./dist/index/server.js";
		packageFields.module = "./dist/index/index.js";
		packageExports["./style.css"] = "./dist/index/index.css";

		preset.writePackageJson(packageFields);
	}

	return preset.generateTsupOptions(parsedOptions).map((options) => {
		if (!options.esbuildPlugins?.length) return options;

		return {
			...options,
			noExternal: ["@prosemirror-adapter/solid", "lucide-solid"],
			outExtension({ format }) {
				return format === "esm" ? { js: ".js" } : {};
			},
		};
	});
});
