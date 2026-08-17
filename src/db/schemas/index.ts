import { defineRelations } from "drizzle-orm";
import * as auth from "./auth";
import { comments } from "./comments";
import { likes } from "./likes";

export * from "./auth";
export * from "./comments";
export * from "./feeds";
export * from "./likes";

export const relations = defineRelations(
	{ users: auth.users, sessions: auth.sessions, accounts: auth.accounts, comments, likes },
	(r) => ({
		users: {
			sessions: r.many.sessions(),
			accounts: r.many.accounts(),
			comments: r.many.comments(),
			likes: r.many.likes(),
		},
		sessions: {
			users: r.one.users({
				from: r.sessions.userId,
				to: r.users.id,
			}),
		},
		accounts: {
			users: r.one.users({
				from: r.accounts.userId,
				to: r.users.id,
			}),
		},
		comments: {
			users: r.one.users({
				from: r.comments.userId,
				to: r.users.id,
			}),
			parent: r.one.comments({
				from: r.comments.parentId,
				to: r.comments.id,
			}),
			root: r.one.comments({
				from: r.comments.rootId,
				to: r.comments.id,
			}),
		},
		likes: {
			users: r.one.users({
				from: r.likes.userId,
				to: r.users.id,
			}),
		},
	})
);
