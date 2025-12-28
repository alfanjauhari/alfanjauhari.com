import { buildSchemas } from "../utils";

export const verificationsTable = buildSchemas("verifications", (t) => ({
  identifier: t.varchar("identifier", { length: 255 }).notNull(),
  value: t.text("value").notNull(),
  expiresAt: t.timestamp("expires_at").notNull(),
}));
