import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import z from "zod";
import { client } from "@/db/client";
import { feedsTable } from "@/db/schemas/feeds";
import { adminMiddleware } from "@/middleware/auth";

export const getPublicFeedsFn = createServerFn().handler(async () => {
  return client
    .select()
    .from(feedsTable)
    .where(eq(feedsTable.draft, false))
    .orderBy(desc(feedsTable.date));
});

export const getPublicFeedsQueryOptions = queryOptions({
  queryKey: ["public-feeds"],
  queryFn: getPublicFeedsFn,
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
