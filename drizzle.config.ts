import "dotenv/config";

import { defineConfig } from "drizzle-kit";
import {
	CLOUDFLARE_ACCOUNT_ID,
	CLOUDFLARE_DATABASE_ID,
	CLOUDFLARE_D1_TOKEN,
} from "astro:env/server";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schemas/index.ts",
	dialect: "sqlite",
	driver: "d1-http",
	dbCredentials: {
		accountId: CLOUDFLARE_ACCOUNT_ID,
		databaseId: CLOUDFLARE_DATABASE_ID,
		token: CLOUDFLARE_D1_TOKEN,
	},
});
