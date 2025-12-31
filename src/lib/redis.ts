import IORedis from "ioredis";
import { serverEnv } from "@/env/server";

export const redis = new IORedis(serverEnv.REDIS_URL);
