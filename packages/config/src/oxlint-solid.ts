import { defineConfig } from "oxlint";

export default defineConfig({
	plugins: ["typescript", "unicorn", "oxc"],
	categories: {
		correctness: "error",
	},
	rules: {
		"no-unassigned-vars": "off",
	},
	env: {
		builtin: true,
	},
});
