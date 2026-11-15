import { defineAction } from "astro:actions";
import { z } from "astro/zod";
import { eq } from "drizzle-orm";
import { client } from "../db/client";
import { feeds } from "../db/schemas/feeds";
import { getAdminFeedsData } from "../lib/dashboard";
import { getPublicFeedsData } from "../lib/feeds";
import { requireAdmin } from "../lib/authorization";
const FeedInputSchema = z.object({
	tag: z.string().min(1, "Tag is required"),
	content: z.string().min(1, "Content is required"),
	draft: z.boolean().default(false),
});

const UpdateFeedSchema = FeedInputSchema.extend({
	id: z.string().min(1, "ID is required"),
});

const DeleteFeedSchema = z.object({
	id: z.string().min(1, "ID is required"),
});

export const feedsActions = {
	getAdminFeeds: defineAction({
		handler: async (_input, ctx) => {
			requireAdmin(ctx);
			return getAdminFeedsData();
		},
	}),

	createFeed: defineAction({
		accept: "form",
		input: FeedInputSchema,
		handler: async ({ tag, content, draft }, ctx) => {
			requireAdmin(ctx);

			const inserted = await client
				.insert(feeds)
				.values({
					id: crypto.randomUUID(),
					tag,
					content,
					draft: draft ? 1 : 0,
				})
				.returning({ id: feeds.id })
				.get();

			return { id: inserted.id };
		},
	}),

	updateFeed: defineAction({
		accept: "form",
		input: UpdateFeedSchema,
		handler: async ({ id, tag, content, draft }, ctx) => {
			requireAdmin(ctx);

			await client
				.update(feeds)
				.set({
					tag,
					content,
					draft: draft ? 1 : 0,
					updatedAt: Math.floor(Date.now() / 1000),
				})
				.where(eq(feeds.id, id));

			return { id };
		},
	}),

	deleteFeed: defineAction({
		accept: "form",
		input: DeleteFeedSchema,
		handler: async ({ id }, ctx) => {
			requireAdmin(ctx);

			await client.delete(feeds).where(eq(feeds.id, id));

			return { id };
		},
	}),

	getPublicFeeds: defineAction({
		input: z.object({
			page: z.number().default(0),
			search: z.string().default(""),
			tag: z.string().default(""),
			sort: z.enum(["newest", "oldest"]).default("newest"),
		}),
		handler: async ({ page, search, tag, sort }) => {
			return getPublicFeedsData(page, {
				search,
				tag,
				sort,
			});
		},
	}),
};
