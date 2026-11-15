import { defineConfig } from "oxlint";
import base from "./oxlint";

export default defineConfig({
	extends: [base],
	rules: {
		"no-unassigned-vars": "off",
	},
});
