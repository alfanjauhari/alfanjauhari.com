import { buildSchemas } from "../utils";
import { usersTable } from "./users";

export const likesTable = buildSchemas("likes", (t) => ({
  refTable: t.varchar("ref_table", { length: 100 }).notNull(),
  refId: t.varchar("ref_id", { length: 255 }).notNull(),
  userId: t
    .varchar("user_id", { length: 255 })
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
}));
