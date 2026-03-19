import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
} from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, lt } from "drizzle-orm";
import sanitizeHtml from "sanitize-html";
import z from "zod";
import { client } from "@/db/client";
import { feedsTable } from "@/db/schemas/feeds";
import { adminMiddleware } from "@/middleware/auth";

const FEEDS_PAGE_SIZE = 10;

const PaginatedFeedsSchema = z.object({
  cursor: z.string().optional(),
});

export const getPublicFeedsFn = createServerFn()
  .inputValidator(PaginatedFeedsSchema)
  .handler(async ({ data }) => {
    const conditions = [eq(feedsTable.draft, false)];

    if (data.cursor) {
      conditions.push(lt(feedsTable.id, data.cursor));
    }

    const feeds = await client
      .select()
      .from(feedsTable)
      .where(and(...conditions))
      .orderBy(desc(feedsTable.date))
      .limit(FEEDS_PAGE_SIZE + 1);

    const hasMore = feeds.length > FEEDS_PAGE_SIZE;
    const items = hasMore ? feeds.slice(0, FEEDS_PAGE_SIZE) : feeds;
    const nextCursor = hasMore ? items[items.length - 1].id : undefined;

    return {
      items: items.map((item) => ({
        ...item,
        content: sanitizeHtml(item.content, {
          allowedTags: ["p", "a", "bold", "em", "i"],
        }),
      })),
      nextCursor,
    };
  });

export const getPublicFeedsInfiniteOptions = infiniteQueryOptions({
  queryKey: ["public-feeds"],
  queryFn: ({ pageParam }) => getPublicFeedsFn({ data: { cursor: pageParam } }),
  initialPageParam: undefined as string | undefined,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});

export const getAdminFeedsFn = createServerFn()
  .middleware([adminMiddleware])
  .handler(async () => {
    return client.select().from(feedsTable).orderBy(desc(feedsTable.date));
  });

export const getAdminFeedsQueryOptions = queryOptions({
  queryKey: ["admin-feeds"],
  queryFn: getAdminFeedsFn,
});

const FeedInputSchema = z.object({
  date: z.string().min(1, "Date is required"),
  tag: z.string().min(1, "Tag is required"),
  content: z.string().min(1, "Content is required"),
  draft: z.boolean().default(false),
});

export const createFeedFn = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(FeedInputSchema)
  .handler(async ({ data }) => {
    const [feed] = await client
      .insert(feedsTable)
      .values({
        date: new Date(data.date),
        tag: data.tag,
        content: data.content,
        draft: data.draft,
      })
      .returning();

    return feed;
  });

export const createFeedMutationOptions = mutationOptions({
  mutationKey: ["create-feed"],
  mutationFn: createFeedFn,
});

const UpdateFeedSchema = FeedInputSchema.extend({
  id: z.string().min(1, "ID is required"),
});

export const updateFeedFn = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(UpdateFeedSchema)
  .handler(async ({ data }) => {
    const [feed] = await client
      .update(feedsTable)
      .set({
        date: new Date(data.date),
        tag: data.tag,
        content: data.content,
        draft: data.draft,
        updatedAt: new Date(),
      })
      .where(eq(feedsTable.id, data.id))
      .returning();

    return feed;
  });

export const updateFeedMutationOptions = mutationOptions({
  mutationKey: ["update-feed"],
  mutationFn: updateFeedFn,
});

const DeleteFeedSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export const deleteFeedFn = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(DeleteFeedSchema)
  .handler(async ({ data }) => {
    await client.delete(feedsTable).where(eq(feedsTable.id, data.id));
  });

export const deleteFeedMutationOptions = mutationOptions({
  mutationKey: ["delete-feed"],
  mutationFn: deleteFeedFn,
});
