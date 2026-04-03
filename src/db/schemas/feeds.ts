import { buildSchemas } from "../utils";

export const feedsTable = buildSchemas("feeds", (t) => ({
  tag: t.varchar("tag", { length: 100 }).notNull(),
  content: t.text("content").notNull(),
  draft: t.boolean("draft").default(false).notNull(),
}));
