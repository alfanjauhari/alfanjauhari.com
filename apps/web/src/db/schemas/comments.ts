import { foreignKey, index } from "drizzle-orm/sqlite-core";
import { buildSchemas } from "../utils";
import { users } from "./auth";

export const comments = buildSchemas(
	"comments",
	(t) => ({
		refTable: t.text("ref_table").notNull(),
		refId: t.text("ref_id").notNull(),
		userId: t.text("user_id").notNull(),
		content: t.text("content").notNull(),
		status: t
			.text("status", {
				enum: ["published", "deleted", "deleted_by_admin"],
			})
			.notNull()
			.default("published"),
		parentId: t.text("parent_id"),
		rootId: t.text("root_id"),
	}),
	(table) => [
		foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "comments_user_id_users_id_fk",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "comments_parent_id_comments_id_fk",
		}),
		foreignKey({
			columns: [table.rootId],
			foreignColumns: [table.id],
			name: "comments_root_id_comments_id_fk",
		}),
		index("comments_ref_idx").on(table.refTable, table.refId),
		index("comments_user_idx").on(table.userId),
	]
);
