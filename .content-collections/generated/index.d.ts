import configuration from "../../content-collections.ts";
import { GetTypeByName } from "@content-collections/core";

export type Update = GetTypeByName<typeof configuration, "updates">;
export declare const allUpdates: Array<Update>;

export {};
