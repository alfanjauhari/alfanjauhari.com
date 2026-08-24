import type { ActionReturnType } from "astro/actions/runtime/entrypoints/server.js";
import { actions } from "astro:actions";

export type CommentStatus = "published" | "deleted" | "deleted_by_admin";

export type Comment = Exclude<
	ActionReturnType<typeof actions.getUpdateComments>["data"],
	undefined
>["comments"][number];

export interface CommentNode {
	id: string;
	rootId: string | null;
}

export type TreeNode<T extends CommentNode> = T & {
	replies: TreeNode<T>[];
};

export type CommentWithReplies = TreeNode<Comment>;

export function commentsTree<T extends CommentNode>(comments: T[]): TreeNode<T>[] {
	const roots = new Map<string, TreeNode<T>>();

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
