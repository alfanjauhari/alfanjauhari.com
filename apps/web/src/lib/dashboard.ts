import { getCollection } from "astro:content";
import { and, desc, eq } from "drizzle-orm";
import { client } from "../db/client";
import { comments } from "../db/schemas/comments";
import { feeds } from "../db/schemas/feeds";
import { likes } from "../db/schemas/likes";
import type { CommentStatus, CommentRecord } from "./comments";
import type { FeedItem } from "./feed-model";
import { selectComments, serializeComment } from "./comment-data";

const toISO = (seconds: number) => new Date(seconds * 1000).toISOString();

export interface UpdateRef {
	slug: string;
	title: string;
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

export interface AdminComment extends CommentRecord {
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
	const rows = await selectComments().orderBy(desc(comments.createdAt));

	const updatesMap = await getUpdatesMap();

	return rows.map((row) => ({
		...serializeComment(row),
		update: updatesMap.get(row.refId) ?? { slug: row.refId, title: row.refId },
	}));
}
