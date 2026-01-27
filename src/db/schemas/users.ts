import { buildSchemas } from "../utils";

export const usersTable = buildSchemas("users", (t) => ({
  email: t.varchar("email").unique().notNull(),
  name: t.varchar("name").notNull(),
  image: t.text("image"),
  isActive: t.boolean("is_active").default(true),
  lastLogin: t.timestamp("last_login"),
  emailVerified: t.boolean("email_verified").notNull().default(false),
}));
