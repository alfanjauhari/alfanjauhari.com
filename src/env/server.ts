import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const serverEnv = createEnv({
  server: {
    APP_DATABASE_URL: z.string(),

    BETTER_AUTH_URL: z.url(),

    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),

    ADMIN_EMAIL: z.string().transform((email) => email.split(",")),

    RESEND_API_TOKEN: z.string(),

    APP_REDIS_URL: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
