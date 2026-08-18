import { getCollection } from "astro:content";
import { env } from "cloudflare:workers";
import { and, desc, eq, getColumns, SQL, type InferSelectModel } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { client } from "@/db/client";
import { users } from "@/db/schemas/auth";
import { comments } from "@/db/schemas/comments";
import { feeds } from "@/db/schemas/feeds";
import { likes } from "@/db/schemas/likes";
import { redactEmail } from "@/utils/security";
import type { CommentStatus } from "./comments";

const parentComment = alias(comments, "parent");
const parentUser = alias(users, "parent_user");

const toISO = (seconds: number) => new Date(seconds * 1000).toISOString();

export function isAdminEmail(email: string) {
	const admins = (env.ADMIN_EMAIL ?? "")
		.split(",")
		.map((entry) => entry.trim().toLowerCase())
		.filter(Boolean);

	return admins.includes(email.toLowerCase());
}

export interface UpdateRef {
	slug: string;
	title: string;
}

export interface FeedItem {
	id: string;
	tag: string;
	content: string;
	draft: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface UserLikeItem {
	id: string;
	createdAt: string;
	update: UpdateRef;
}

export interface UserCommentItem {
	id: string;
	content: string;
	status: CommentStatus;
	createdAt: string;
	update: UpdateRef;
}

export interface AdminCommentUser {
	id: string;
	name: string;
	email: string;
	image: string | null;
}

export interface AdminComment {
	id: string;
	refTable: string;
	refId: string;
	userId: string;
	content: string;
	status: CommentStatus;
	parentId: string | null;
	rootId: string | null;
	createdAt: string;
	updatedAt: string;
	user: AdminCommentUser;
	parent: {
		id: string;
		content: string;
		createdAt: string;
		user: AdminCommentUser | null;
	} | null;
	update: UpdateRef;
}

async function getUpdatesMap(): Promise<Map<string, UpdateRef>> {
	const updates = await getCollection("updates");

	return new Map(updates.map((u) => [u.id, { slug: u.id, title: u.data.title }]));
}

export async function getAdminFeedsData(): Promise<FeedItem[]> {
	const rows = await client.select().from(feeds).orderBy(desc(feeds.createdAt));

	return rows.map((feed) => ({
		id: feed.id,
		tag: feed.tag,
		content: feed.content,
		draft: !!feed.draft,
		createdAt: toISO(feed.createdAt),
		updatedAt: toISO(feed.updatedAt),
	}));
}

export async function getUpdatesListData() {
	const updates = await getCollection("updates");
	return updates
		.map((update) => ({
			slug: update.id,
			title: update.data.title,
			tag: update.data.tag,
			date: update.data.date,
		}))
		.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function getUserLikesData(userId: string) {
	const baseQuery = client
		.select({ id: likes.id, createdAt: likes.createdAt, refId: likes.refId })
		.from(likes)
		.where(and(eq(likes.userId, userId), eq(likes.refTable, "updates")));

	const count = await client.$count(baseQuery);
	const rows = await baseQuery.orderBy(desc(likes.createdAt)).limit(10);

	const updatesMap = await getUpdatesMap();

	const result: UserLikeItem[] = rows.map((like) => ({
		id: like.id,
		createdAt: toISO(like.createdAt),
		update: updatesMap.get(like.refId) ?? { slug: like.refId, title: like.refId },
	}));

	return { likes: result, count };
}

export async function getUserCommentsData(userId: string) {
	const baseQuery = client
		.select({
			id: comments.id,
			content: comments.content,
			status: comments.status,
			createdAt: comments.createdAt,
			refId: comments.refId,
		})
		.from(comments)
		.where(and(eq(comments.userId, userId), eq(comments.refTable, "updates")));

	const count = await client.$count(baseQuery);
	const rows = await baseQuery.orderBy(desc(comments.createdAt)).limit(10);

	const updatesMap = await getUpdatesMap();

	const result: UserCommentItem[] = rows.map((comment) => ({
		id: comment.id,
		content: comment.content,
		status: comment.status,
		createdAt: toISO(comment.createdAt),
		update: updatesMap.get(comment.refId) ?? { slug: comment.refId, title: comment.refId },
	}));

	return { comments: result, count };
}

export async function getAllCommentsData(): Promise<AdminComment[]> {
	const rows = await client
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
		.orderBy(desc(comments.createdAt));

	const updatesMap = await getUpdatesMap();

	return rows.map((row) => ({
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
		update: updatesMap.get(row.refId) ?? { slug: row.refId, title: row.refId },
	}));
}
