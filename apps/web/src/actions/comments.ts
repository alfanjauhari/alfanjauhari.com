import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";
import { and, desc, eq, inArray, or } from "drizzle-orm";
import { SITE_URL } from "../constants";
import { client } from "../db/client";
import { users } from "../db/schemas/auth";
import { comments } from "../db/schemas/comments";
import { getUpdateBySlug } from "../lib/content";
import { getAllCommentsData, getUserCommentsData } from "../lib/dashboard";
import { requireAdmin, requireUser } from "../lib/authorization";
import { sendEmail } from "../lib/email";
import { verifyTurnstileToken } from "../lib/turnstile";
import { selectComments, serializeComment } from "../lib/comment-data";
const CommentFnsSchema = z.object({
	slug: z.string(),
	page: z.number().default(1),
	size: z.number().default(10),
});

const NewCommentSchema = z.object({
	slug: z.string().min(1, "Slug is required"),
	parentId: z.string().optional(),
	content: z.string().min(1, "Content is required"),
	turnstileToken: z.string().min(1, "Verification is required"),
});

export const commentsActions = {
	getUpdateComments: defineAction({
		input: CommentFnsSchema,
		handler: async ({ slug, page, size }, ctx) => {
			const sessionUser = ctx.locals.user;

			const baseQuery = selectComments().where(
				or(
					and(
						eq(comments.refTable, "updates"),
						eq(comments.refId, slug),
						eq(comments.status, "published"),
					),
					sessionUser
						? and(
								eq(comments.refTable, "updates"),
								eq(comments.refId, slug),
								eq(comments.userId, sessionUser.id),
								inArray(comments.status, ["deleted", "deleted_by_admin"]),
							)
						: undefined,
				),
			);

			const countResult = await client.$count(baseQuery);

			const rows = await baseQuery
				.orderBy(desc(comments.createdAt))
				.limit(size)
				.offset((page - 1) * size);

			const result = rows.map((row) => {
				const comment = serializeComment(row);
				return { ...comment, user: { ...comment.user, emailVerified: row.user.emailVerified } };
			});

			return {
				comments: result,
				count: countResult,
				userId: sessionUser?.id ?? null,
			};
		},
	}),

	addComment: defineAction({
		accept: "form",
		input: NewCommentSchema,
		handler: async ({ slug, parentId, content, turnstileToken }, ctx) => {
			const sessionUser = ctx.locals.user;

			if (!sessionUser) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: "You must be logged in to comment.",
				});
			}

			const turnstileValid = await verifyTurnstileToken(turnstileToken, ctx.clientAddress);

			if (!turnstileValid) {
				throw new ActionError({
					code: "FORBIDDEN",
					message: "Verification failed. Please try again.",
				});
			}

			try {
				let rootId: string | null = null;

				if (parentId) {
					const parent = await client
						.select({
							userId: comments.userId,
							rootId: comments.rootId,
						})
						.from(comments)
						.where(eq(comments.id, parentId))
						.get();

					if (parent) {
						rootId = parent.rootId ?? parentId;

						const parentAuthor = await client
							.select({ email: users.email })
							.from(users)
							.where(eq(users.id, parent.userId))
							.get();

						if (parentAuthor?.email) {
							const update = await getUpdateBySlug(slug);

							// TODO: Add a queue to send emails in the background instead of waiting for the email to be sent before returning the response
							await sendEmail({
								to: parentAuthor.email,
								template: {
									id: "mention",
									variables: {
										name: sessionUser.name,
										update_title: update?.data.title ?? slug,
										reply_content: content,
										link: `${SITE_URL}/updates/${slug}`,
									},
								},
							});
						}
					}
				}

				const inserted = await client
					.insert(comments)
					.values({
						id: crypto.randomUUID(),
						refTable: "updates",
						refId: slug,
						userId: sessionUser.id,
						content,
						status: "published",
						parentId: parentId ?? null,
						rootId,
					})
					.returning({ id: comments.id })
					.get();

				return { id: inserted.id };
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

	getUserComments: defineAction({
		handler: async (_input, ctx) => {
			const user = requireUser(ctx);

			return getUserCommentsData(user.id);
		},
	}),

	getAllComments: defineAction({
		handler: async (_input, ctx) => {
			requireAdmin(ctx);
			return getAllCommentsData();
		},
	}),
};
