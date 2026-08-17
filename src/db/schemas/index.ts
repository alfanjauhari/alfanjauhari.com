import { defineRelations } from "drizzle-orm";
import * as auth from "./auth";

export * from "./auth";
export * from "./feeds";

export const relations = defineRelations(
	{ users: auth.users, sessions: auth.sessions, accounts: auth.accounts },
	(r) => ({
		users: {
			sessions: r.many.sessions(),
			accounts: r.many.accounts(),
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
	}),
);
