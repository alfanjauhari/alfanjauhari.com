import { buildSchemas } from "../utils";
import { usersTable } from "./users";

export const sessionsTable = buildSchemas("sessions", (t) => ({
  userId: t
    .varchar("user_id", { length: 255 })
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  token: t.varchar("token", { length: 255 }).notNull(),
  expiresAt: t.timestamp("expires_at").notNull(),
  ipAddress: t.varchar("ip_address", { length: 45 }),
  userAgent: t.text("user_agent"),
}));
