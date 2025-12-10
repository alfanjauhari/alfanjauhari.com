import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z.url(),

    AWS_S3_ENDPOINT: z.string(),
    AWS_S3_ACCESS_KEY: z.string(),
    AWS_S3_SECRET_ACCESS_KEY: z.string(),
    AWS_S3_BUCKET: z.string(),
    AWS_S3_BUCKET_VERSION: z.string().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
