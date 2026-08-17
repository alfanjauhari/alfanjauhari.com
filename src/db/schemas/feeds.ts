import { buildSchemas } from "../utils";

export const feeds = buildSchemas("feeds", (t) => ({
	tag: t.text("tag").notNull(),
	content: t.text("content").notNull(),
	draft: t.integer("draft").default(0).notNull(),
}));
