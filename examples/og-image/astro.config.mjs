import ogImages from "@alfanjauhari/astro-og-images";
import { defineConfig } from "astro/config";
import { renderOgImage } from "./src/integrations/og/render.ts";

export default defineConfig({
	site: "https://example.com",
	integrations: [
		ogImages({
			format: "webp",
			height: 630,
			render: renderOgImage,
			verbose: true,
			width: 1200,
		}),
	],
});
