import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, getTableColumns, inArray, or, sql } from "drizzle-orm";
import z from "zod";
import { client } from "@/db/client";
import { commentsTable } from "@/db/schemas/comments";
import { updatesTable } from "@/db/schemas/updates";
import { usersTable } from "@/db/schemas/users";
import { withPagination } from "@/lib/queries.server";
import { authMiddleware } from "@/middleware/auth";
import { getSessionFn } from "./auth";
import { LikeFnsSchema } from "./likes";

export const getUpdateCommentsFn = createServerFn()
  .inputValidator(LikeFnsSchema)
  .handler(async ({ data }) => {
    const session = await getSessionFn();

    const commentsQuery = client
      .select({
        ...getTableColumns(commentsTable),
        user: usersTable,
      })
      .from(updatesTable)
      .innerJoin(
        commentsTable,
        and(
          eq(commentsTable.refTable, "updates"),
          eq(commentsTable.refId, updatesTable.id),
        ),
      )
      .innerJoin(usersTable, eq(commentsTable.userId, usersTable.id))
      .where(
        or(
          and(
            eq(updatesTable.slug, data.slug),
            eq(commentsTable.status, "approved"),
          ),
          session
            ? and(
                eq(updatesTable.slug, data.slug),
                eq(commentsTable.userId, session.user.id),
                inArray(commentsTable.status, [
                  "approved",
                  "deleted",
                  "pending",
                  "deleted_by_admin",
                ]),
              )
            : undefined,
        ),
      )
      .$dynamic();

    const { countQuery, dataQuery } = withPagination(commentsQuery, [
      desc(commentsTable.createdAt),
      sql`${commentsTable.parentId} NULLS FIRST`,
    ]);

    const comments = await dataQuery();
    const count = await countQuery();

    return {
      comments,
      count,
      userId: session?.user.id,
    };
  });

export const getUpdateCommentsQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["update-comments", slug],
    queryFn: () =>
      getUpdateCommentsFn({
        data: {
          slug,
        },
      }),
  });

const NewCommentSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  parentId: z.string().optional(),
  content: z.string().min(1, "Content is required"),
});

export const addCommentToUpdate = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(NewCommentSchema)
  .handler(async ({ data, context }) => {
    try {
      const session = context.session;

      const updateSq = client.$with("update").as(
        client
          .select({
            id: updatesTable.id,
          })
          .from(updatesTable)
          .where(eq(updatesTable.slug, data.slug))
          .limit(1),
      );
      const createdComment = await client
        .with(updateSq)
        .insert(commentsTable)
        .values({
          ...data,
          refTable: "updates",
          refId: sql`(select * from ${updateSq})`,
          userId: session.user.id,
          status: "pending",
        })
        .returning({
          id: commentsTable.id,
        })
        .execute();

      return {
        id: createdComment[0].id,
      };
    } catch (_) {
      return {
        message: "Something went wrong. Probably the wind",
      };
    }
  });

export const addCommentToUpdateMutationOptions = (slug: string) =>
  mutationOptions({
    mutationFn: addCommentToUpdate,
    mutationKey: ["new-comment-update", slug],
  });
