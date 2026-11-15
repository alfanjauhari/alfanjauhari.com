import { eq, getColumns, SQL, type InferSelectModel } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { client } from "../db/client";
import { users } from "../db/schemas/auth";
import { comments } from "../db/schemas/comments";
import { redactEmail } from "../utils/security";
import type { CommentRecord } from "./comments";

const parentComment = alias(comments, "parent");
const parentUser = alias(users, "parent_user");
const toISO = (seconds: number) => new Date(seconds * 1000).toISOString();

export function selectComments() {
	return client
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
		.leftJoin(parentUser, eq(parentComment.userId, parentUser.id));
}

type CommentRow = Awaited<ReturnType<typeof selectComments>>[number];

export function serializeComment(row: CommentRow): CommentRecord {
	return {
		id: row.id,
		refTable: row.refTable,
		refId: row.refId,
		userId: row.userId,
		content: row.content,
		status: row.status,
		parentId: row.parentId,
		rootId: row.rootId,
		createdAt: toISO(row.createdAt),
		updatedAt: toISO(row.updatedAt),
		user: {
			id: row.userId,
			name: row.user.name,
			email: redactEmail(row.user.email),
			image: row.user.image,
		},
		parent: row.parent
			? {
					id: row.parent.id,
					content: row.parent.content,
					createdAt: toISO(row.parent.createdAt),
					user: row.parent.user
						? {
								id: row.parent.user.id,
								name: row.parent.user.name,
								email: redactEmail(row.parent.user.email),
								image: row.parent.user.image,
							}
						: null,
				}
			: null,
	};
}
