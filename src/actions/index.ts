import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";
import {
	and,
	count,
	desc,
	eq,
	getColumns,
	inArray,
	or,
	SQL,
	sql,
	type InferSelectModel,
} from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { SITE_URL } from "@/constants";
import { client } from "@/db/client";
import { users } from "@/db/schemas/auth";
import { comments } from "@/db/schemas/comments";
import { likes } from "@/db/schemas/likes";
import { auth } from "@/lib/auth";
import { getUpdateBySlug } from "@/lib/content";
import { sendEmail } from "@/lib/email";
import { redactEmail } from "@/utils/redact";

const parentComment = alias(comments, "parent");
const parentUser = alias(users, "parent_user");

const CommentFnsSchema = z.object({
	slug: z.string(),
	page: z.number().default(1),
	size: z.number().default(10),
});

const NewCommentSchema = z.object({
	slug: z.string().min(1, "Slug is required"),
	parentId: z.string().optional(),
	content: z.string().min(1, "Content is required"),
});

const LikeFnsSchema = z.object({
	slug: z.string(),
});

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

	getUpdateComments: defineAction({
		input: CommentFnsSchema,
		handler: async ({ slug, page, size }, ctx) => {
			const sessionUser = ctx.locals.user;

			const baseQuery = client
				.select({
					...getColumns(comments),
					user: users,
					parent: {
						...getColumns(parentComment),
						user: getColumns(parentUser) as unknown as SQL<InferSelectModel<typeof users> | null>,
					},
				})
				.from(comments)
				.innerJoin(users, eq(comments.userId, users.id))
				.leftJoin(parentComment, eq(comments.parentId, parentComment.id))
				.leftJoin(parentUser, eq(parentComment.userId, parentUser.id))
				.where(
					or(
						and(
							eq(comments.refTable, "updates"),
							eq(comments.refId, slug),
							eq(comments.status, "published")
						),
						sessionUser
							? and(
									eq(comments.refTable, "updates"),
									eq(comments.refId, slug),
									eq(comments.userId, sessionUser.id),
									inArray(comments.status, ["deleted", "deleted_by_admin"])
								)
							: undefined
					)
				);

			const countResult = await client.$count(baseQuery);

			const rows = await baseQuery
				.orderBy(desc(comments.createdAt))
				.limit(size)
				.offset((page - 1) * size);

			const result = rows.map((row) => ({
				id: row.id,
				refTable: row.refTable,
				refId: row.refId,
				userId: row.userId,
				content: row.content,
				status: row.status,
				parentId: row.parentId,
				rootId: row.rootId,
				createdAt: new Date(row.createdAt * 1000).toISOString(),
				updatedAt: new Date(row.updatedAt * 1000).toISOString(),
				user: {
					id: row.userId,
					name: row.user.name,
					email: redactEmail(row.user.email),
					image: row.user.image,
					emailVerified: row.user.emailVerified,
				},
				parent: row.parent?.id
					? {
							id: row.parent.id,
							content: row.parent.content ?? "",
							createdAt: new Date((row.parent.createdAt ?? 0) * 1000).toISOString(),
							user: row.parent.user
								? {
										id: row.parent.user.id ?? "",
										name: row.parent.user.name,
										email: redactEmail(row.parent.user.email ?? ""),
										image: row.parent.user.image ?? null,
									}
								: null,
						}
					: null,
			}));

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
		handler: async ({ slug, parentId, content }, ctx) => {
			const sessionUser = ctx.locals.user;

			if (!sessionUser) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: "You must be logged in to comment.",
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

			try {
				const deleted = await client
					.delete(likes)
					.where(
						and(
							eq(likes.refTable, "updates"),
							eq(likes.refId, slug),
							eq(likes.userId, sessionUser.id)
						)
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
};
