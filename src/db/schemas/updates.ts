import { buildSchemas } from "../utils";

export const updatesTable = buildSchemas("updates", (t) => ({
  title: t.varchar("title", { length: 255 }).notNull(),
  slug: t.varchar("slug", { length: 255 }).unique().notNull(),
  summary: t.text("summary").notNull(),
  date: t.timestamp("date").notNull(),
  restricted: t.boolean("restricted"),
}));
