import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";
import { and, count, eq, sql } from "drizzle-orm";
import { client } from "../db/client";
import { likes } from "../db/schemas/likes";
import { getUserLikesData } from "../lib/dashboard";
import { requireUser } from "../lib/authorization";
import { env } from "cloudflare:workers";
const LikeFnsSchema = z.object({
	slug: z.string(),
});

export const likesActions = {
	getUpdateLikes: defineAction({
		input: LikeFnsSchema,
		handler: async ({ slug }, ctx) => {
			const sessionUser = ctx.locals.user;

			const [row] = await client
				.select({
					totalCount: count(likes.id),
					...(sessionUser
						? {
								userLikeCount: sql<number>`COUNT(CASE WHEN ${likes.userId} = ${sessionUser.id} THEN 1 END)`,
							}
						: {}),
				})
				.from(likes)
				.where(and(eq(likes.refTable, "updates"), eq(likes.refId, slug)));

			return {
				totalCount: row?.totalCount ?? 0,
				isLiked: (row?.userLikeCount ?? 0) > 0,
			};
		},
	}),

	toggleUpdateLike: defineAction({
		accept: "form",
		input: LikeFnsSchema,
		handler: async ({ slug }, ctx) => {
			const sessionUser = ctx.locals.user;

			if (!sessionUser) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: "You must be logged in to like.",
				});
			}

			const { success } = await env.LIKE_RATE_LIMITER.limit({
				key: sessionUser.id,
			});

			if (!success) {
				throw new ActionError({
					code: "TOO_MANY_REQUESTS",
					message: "You are liking too fast. Please slow down.",
				});
			}

			try {
				const deleted = await client
					.delete(likes)
					.where(
						and(
							eq(likes.refTable, "updates"),
							eq(likes.refId, slug),
							eq(likes.userId, sessionUser.id),
						),
					)
					.returning({ id: likes.id });

				if (deleted.length === 0) {
					const inserted = await client
						.insert(likes)
						.values({
							id: crypto.randomUUID(),
							refTable: "updates",
							refId: slug,
							userId: sessionUser.id,
						})
						.returning({ id: likes.id })
						.get();

					return { id: inserted.id, unliked: false };
				}

				return { id: undefined, unliked: true };
			} catch (error) {
				if (error instanceof ActionError) {
					throw error;
				}

				throw new ActionError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Something went wrong. Probably the wind",
				});
			}
		},
	}),

	getUserLikes: defineAction({
		handler: async (_input, ctx) => {
			const user = requireUser(ctx);

			return getUserLikesData(user.id);
		},
	}),
};
