import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { APIError } from "better-auth";
import { and, count, desc, eq, getTableColumns, sql } from "drizzle-orm";
import z from "zod";
import { client } from "@/db/client";
import { likesTable } from "@/db/schemas/likes";
import { updatesTable } from "@/db/schemas/updates";
import { usersTable } from "@/db/schemas/users";
import { handleCommonApiError, hasMiddlewareError } from "@/lib/error";
import { withPagination } from "@/lib/queries.server";
import { authMiddleware } from "@/middleware/auth";
import { rateLimitMiddleware } from "@/middleware/rate-limit";
import { getSessionFn } from "./auth";

export const LikeFnsSchema = z.object({
  slug: z.string(),
});

const UserLikesFnSchema = z.object({
  page: z.number().default(1).optional(),
  size: z.number().default(10).optional(),
});

export const getUserLikesFn = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(UserLikesFnSchema)
  .handler(async ({ data, context }) => {
    const likesQuery = client
      .select({
        ...getTableColumns(likesTable),
        update: updatesTable,
      })
      .from(usersTable)
      .where(eq(usersTable.id, context.session.user.id))
      .innerJoin(likesTable, eq(likesTable.userId, usersTable.id))
      .innerJoin(updatesTable, eq(updatesTable.id, likesTable.refId))
      .$dynamic();

    const { countQuery, dataQuery } = withPagination(
      likesQuery,
      [desc(likesTable.createdAt)],
      data.page,
      data.size,
    );

    const likes = await dataQuery();
    const count = await countQuery();

    return {
      likes,
      count,
    };
  });

export const getUserLikesQueryOptions = (
  data: z.infer<typeof UserLikesFnSchema> = {},
) =>
  queryOptions({
    queryKey: ["user-likes", data],
    queryFn: () =>
      getUserLikesFn({
        data,
      }),
  });

export const getUpdateLikesMetadataFn = createServerFn()
  .middleware([rateLimitMiddleware("get-like", 10)])
  .inputValidator(LikeFnsSchema)
  .handler(async ({ data }) => {
    try {
      const session = await getSessionFn();

      const [{ count: totalCount, userLikeCount }] = await client
        .select({
          count: count(likesTable.id),
          ...(session?.user.id
            ? {
                userLikeCount:
                  sql`COUNT(CASE WHEN likes.user_id = ${session?.user.id} THEN 1 END)`.mapWith(
                    Number,
                  ),
              }
            : {}),
        })
        .from(updatesTable)
        .innerJoin(
          likesTable,
          and(
            eq(likesTable.refTable, "updates"),
            eq(likesTable.refId, updatesTable.id),
          ),
        )
        .where(eq(updatesTable.slug, data.slug));

      return {
        totalCount,
        isLiked: !!userLikeCount,
      };
    } catch (_error) {
      return {
        totalCount: 0,
        isLiked: false,
      };
    }
  });

export const getUpdateLikesMetadataQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["update-likes", slug],
    queryFn: () =>
      getUpdateLikesMetadataFn({
        data: {
          slug,
        },
      }),
  });

export const likeUpdateFn = createServerFn({ method: "POST" })
  .inputValidator(LikeFnsSchema)
  .middleware([authMiddleware, rateLimitMiddleware("like")])
  .handler(async ({ data, context }) => {
    const session = context.session;

    try {
      if (hasMiddlewareError(context)) {
        throw new APIError(context.error.status, {
          message: context.error.message,
          code: context.error.code,
        });
      }

      const updates = await client
        .select({
          id: updatesTable.id,
        })
        .from(updatesTable)
        .where(eq(updatesTable.slug, data.slug))
        .limit(1)
        .execute();

      if (!updates.length) {
        throw new APIError("NOT_FOUND");
      }

      const delSq = client.$with("deleted_likes").as(
        client
          .delete(likesTable)
          .where(
            and(
              eq(likesTable.userId, session.user.id),
              eq(likesTable.refId, updates[0].id),
            ),
          )
          .returning({
            deleted: sql`1`,
          }),
      );

      const toggleLikes = await client
        .with(delSq)
        .insert(likesTable)
        .select(
          () =>
            sql`SELECT generate_nanoid(), 'updates', ${updates[0].id}, ${session.user.id}, NOW(), NOW() WHERE NOT EXISTS (SELECT 1 FROM ${delSq})`,
        )
        .returning({
          id: likesTable.id,
        })
        .execute();

      return {
        id: toggleLikes.length ? toggleLikes[0].id : undefined,
        unliked: !toggleLikes.length,
      };
    } catch (error) {
      if (error instanceof APIError) {
        return { message: handleCommonApiError(error) };
      }

      return {
        message: "Something went wrong. Probably the wind",
      };
    }
  });
