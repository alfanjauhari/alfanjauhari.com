import { drizzle } from "drizzle-orm/node-postgres";
import { serverEnv } from "@/env/server";

export const client = drizzle(serverEnv.APP_DATABASE_URL);
