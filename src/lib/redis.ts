import IORedis from "ioredis";
import { serverEnv } from "@/env/server";

export const redis = new IORedis({
  host: serverEnv.REDIS_HOST,
  port: serverEnv.REDIS_PORT,
  password: serverEnv.REDIS_PASSWORD,
});
