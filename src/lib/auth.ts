import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { client } from "@/db/client";

export const auth = betterAuth({
	database: drizzleAdapter(client, {
		provider: "sqlite",
		usePlural: true,
	}),
});
