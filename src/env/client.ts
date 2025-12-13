import { createEnv } from "@t3-oss/env-core";
import z from "zod";

export const clientEnv = createEnv({
  client: {
    VITE_SITE_URL: z.url(),
    VITE_CLOUDINARY_URL: z.url(),
  },
  clientPrefix: "VITE_",
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
