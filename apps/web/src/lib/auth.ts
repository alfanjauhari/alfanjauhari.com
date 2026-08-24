import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink, openAPI } from "better-auth/plugins";
import { client } from "../db/client";
import { sendEmail } from "./email";
import { env } from "cloudflare:workers";
import * as schema from "../db/schemas";

export const auth = betterAuth({
	database: drizzleAdapter(client, {
		provider: "sqlite",
		usePlural: true,
		schema,
	}),
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
		},
	},
	rateLimit: {
		enabled: true,
		max: 2,
		window: 60,
		storage: "database",
	},
	plugins: [
		openAPI(),
		magicLink({
			sendMagicLink: async ({ email, url }) => {
				await sendEmail({
					to: email,
					template: {
						id: "email-login",
						variables: {
							link: url,
						},
					},
					subject: "Login to Your Account",
				});
			},
		}),
	],
});
