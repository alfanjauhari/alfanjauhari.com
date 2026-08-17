import type { ActionReturnType } from "astro/actions/runtime/entrypoints/server.js";
import { actions } from "astro:actions";

export type CommentStatus = "published" | "deleted" | "deleted_by_admin";

export type Comment = Exclude<
	ActionReturnType<typeof actions.getUpdateComments>["data"],
	undefined
>["comments"][number];

export interface CommentWithReplies extends Comment {
	replies: CommentWithReplies[];
}

export function commentsTree(comments: Comment[]): CommentWithReplies[] {
	const roots = new Map<string, CommentWithReplies>();

	for (const c of comments) {
		if (c.rootId === null) {
			roots.set(c.id, { ...c, replies: [] });
		}
	}

	for (const c of comments) {
		if (c.rootId) {
			roots.get(c.rootId)?.replies.push({
				...c,
				replies: [],
			});
		}
	}

	return [...roots.values()];
}

export function commentStatusMap(status: CommentStatus) {
	switch (status) {
		case "published":
			return "Published";
		case "deleted":
			return "Deleted";
		case "deleted_by_admin":
			return "Deleted by Admin";
	}
}
