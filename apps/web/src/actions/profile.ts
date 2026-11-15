import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";
import { eq } from "drizzle-orm";
import { client } from "../db/client";
import { users } from "../db/schemas/auth";
import { requireUser } from "../lib/authorization";

export const profileActions = {
	updateUserName: defineAction({
		accept: "form",
		input: z.object({
			name: z.string().min(1, "Name is required"),
		}),
		handler: async ({ name }, ctx) => {
			const user = requireUser(ctx);

			try {
				await client.update(users).set({ name }).where(eq(users.id, user.id));

				return true;
			} catch {
				throw new ActionError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Something went wrong when trying to update name. Must be the wind",
				});
			}
		},
	}),
};
