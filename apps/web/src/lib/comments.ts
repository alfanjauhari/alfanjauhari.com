export type CommentStatus = "published" | "deleted" | "deleted_by_admin";

export interface CommentUser {
	id: string;
	name: string;
	email: string;
	image: string | null;
}

export interface CommentRecord {
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
	user: CommentUser;
	parent: { id: string; content: string; createdAt: string; user: CommentUser | null } | null;
}

export interface Comment extends CommentRecord {
	user: CommentUser & { emailVerified: boolean };
}

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
