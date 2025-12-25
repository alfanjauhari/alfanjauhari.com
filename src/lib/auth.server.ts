import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { nanoid } from "nanoid";
import { client } from "@/db/client";
import { accountsTable } from "@/db/schemas/accounts";
import { sessionsTable } from "@/db/schemas/sessions";
import { usersTable } from "@/db/schemas/users";
import { verificationsTable } from "@/db/schemas/verifications";
import { serverEnv } from "@/env/server";

export const auth = betterAuth({
  database: drizzleAdapter(client, {
    provider: "pg",
    schema: {
      user: usersTable,
      account: accountsTable,
      session: sessionsTable,
      verification: verificationsTable,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: serverEnv.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: serverEnv.GITHUB_CLIENT_ID,
      clientSecret: serverEnv.GITHUB_CLIENT_SECRET,
    },
  },
  advanced: {
    database: {
      generateId: () => nanoid(),
    },
  },
  plugins: [openAPI(), tanstackStartCookies()],
});
