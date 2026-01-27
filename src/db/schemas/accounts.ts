import { buildSchemas } from "../utils";
import { usersTable } from "./users";

export const accountsTable = buildSchemas("accounts", (t) => ({
  userId: t
    .varchar("user_id", { length: 30 })
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  accountId: t.varchar("account_id", { length: 255 }).notNull(),
  providerId: t.varchar("provider_id", { length: 255 }).notNull(),
  accessToken: t.text("access_token"),
  refreshToken: t.text("refresh_token"),
  accessTokenExpiresAt: t.timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: t.timestamp("refresh_token_expires_at"),
  scope: t.text("scope"),
  idToken: t.text("id_token"),
  password: t.text("password"),
}));
