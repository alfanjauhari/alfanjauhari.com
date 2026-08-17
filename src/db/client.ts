import { drizzle } from "drizzle-orm/d1";
import { env } from "cloudflare:workers";
import { relations } from "./schemas";

export const client = drizzle(env.DATABASE, {
	relations,
});
