import { buildSchemas } from "../utils";

export const verificationsTable = buildSchemas("verifications", (t) => ({
  identifier: t.varchar("identifier", { length: 255 }).notNull(),
  value: t.varchar("value", { length: 255 }).notNull(),
  expiresAt: t.timestamp("expires_at").notNull(),
}));
