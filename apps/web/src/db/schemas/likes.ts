import { index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { buildSchemas } from "../utils";
import { users } from "./auth";

export const likes = buildSchemas(
	"likes",
	(t) => ({
		refTable: t.text("ref_table").notNull(),
		refId: t.text("ref_id").notNull(),
		userId: t
			.text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
	}),
	(table) => [
		uniqueIndex("likes_ref_user_unique").on(table.refTable, table.refId, table.userId),
		index("likes_ref_idx").on(table.refTable, table.refId),
	]
);
