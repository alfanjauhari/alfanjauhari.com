import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { client } from "@/db/client";
import { sendEmail } from "./email";
import {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
} from "astro:env/server";
import * as schema from "@/db/schemas";

export const auth = betterAuth({
	database: drizzleAdapter(client, {
		provider: "sqlite",
		usePlural: true,
		schema,
	}),
	socialProviders: {
		google: {
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
		},
		github: {
			clientId: GITHUB_CLIENT_ID,
			clientSecret: GITHUB_CLIENT_SECRET,
		},
	},
	plugins: [
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
