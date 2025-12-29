import { foreignKey, pgEnum } from "drizzle-orm/pg-core";
import { buildSchemas } from "../utils";
import { usersTable } from "./users";

export const commentStatus = pgEnum("comment_status_enum", [
  "published",
  "deleted",
  "deleted_by_admin",
]);

export const commentsTable = buildSchemas(
  "comments",
  (t) => ({
    refTable: t.varchar("ref_table", { length: 100 }).notNull(),
    refId: t.varchar("ref_id", { length: 255 }).notNull(),
    userId: t
      .varchar("user_id", { length: 255 })
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    content: t.text("content").notNull(),
    status: commentStatus("status").notNull(),
    parentId: t.varchar("parent_id", { length: 255 }),
    rootId: t.varchar("root_id", { length: 255 }),
  }),
  (table) => [
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
  ],
);
