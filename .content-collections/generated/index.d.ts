import configuration from "../../content-collections.ts";
import { GetTypeByName } from "@content-collections/core";

export type Update = GetTypeByName<typeof configuration, "updates">;
export declare const allUpdates: Array<Update>;

export type Page = GetTypeByName<typeof configuration, "pages">;
export declare const allPages: Array<Page>;

export type Snippet = GetTypeByName<typeof configuration, "snippets">;
export declare const allSnippets: Array<Snippet>;

export {};
