import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";
import { auth } from "@/lib/auth";

export const server = {
	magicLinkSignIn: defineAction({
		accept: "form",
		input: z.object({
			email: z.email("Please enter a valid email address."),
			redirectTo: z.string().default("/"),
		}),
		handler: async ({ email, redirectTo }, ctx) => {
			const callbackURL = redirectTo.includes("http") ? "/" : redirectTo;

			const headers = new Headers(ctx.request.headers);
			headers.set("x-forwarded-for", ctx.clientAddress);

			try {
				await auth.api.signInMagicLink({
					body: {
						email,
						callbackURL,
						errorCallbackURL: "/auth/login",
						newUserCallbackURL: "/",
					},
					headers,
				});

				return { sent: true };
			} catch {
				throw new ActionError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Something went wrong. Please try again.",
				});
			}
		},
	}),
};
