import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { APIError } from "better-auth";
import {
  and,
  desc,
  eq,
  getTableColumns,
  type InferSelectModel,
  inArray,
  or,
  type SQL,
} from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import z from "zod";
import { client } from "@/db/client";
import { commentsTable } from "@/db/schemas/comments";
import { updatesTable } from "@/db/schemas/updates";
import { usersTable } from "@/db/schemas/users";
import { clientEnv } from "@/env/client";
import { sendEmail } from "@/lib/email";
import { handleCommonApiError, hasMiddlewareError } from "@/lib/error";
import { withPagination } from "@/lib/queries.server";
import { adminMiddleware, authMiddleware } from "@/middleware/auth";
import { rateLimitMiddleware } from "@/middleware/rate-limit";
import { getSessionFn } from "./auth";

const parent = alias(commentsTable, "parent");
const parentUser = alias(usersTable, "parent_user");

const CommentFnsSchema = z.object({
  slug: z.string(),
  page: z.number().default(1).optional(),
  size: z.number().default(10).optional(),
});

type CommentFnsSchema = z.infer<typeof CommentFnsSchema>;

export const getAllCommentsFn = createServerFn()
  .middleware([adminMiddleware])
  .handler(async () => {
    const comments = await client
      .select({
        ...getTableColumns(commentsTable),
        user: usersTable,
        parent: {
          ...getTableColumns(parent),
          user: getTableColumns(parentUser) as unknown as SQL<InferSelectModel<
            typeof usersTable
          > | null>,
        },
        update: updatesTable,
      })
      .from(commentsTable)
      .innerJoin(
        updatesTable,
        and(
          eq(commentsTable.refTable, "updates"),
          eq(commentsTable.refId, updatesTable.id),
        ),
      )
      .innerJoin(usersTable, eq(commentsTable.userId, usersTable.id))
      .leftJoin(parent, eq(commentsTable.parentId, parent.id))
      .leftJoin(parentUser, eq(parent.userId, parentUser.id));

    return comments;
  });

export const getAllCommentsQueryOptions = queryOptions({
  queryKey: ["comments"],
  queryFn: getAllCommentsFn,
});

const UserCommentsFnSchema = CommentFnsSchema.omit({ slug: true });
export const getUserCommentsFn = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(UserCommentsFnSchema)
  .handler(async ({ context }) => {
    const commentsQuery = client
      .select({
        ...getTableColumns(commentsTable),
        update: updatesTable,
      })
      .from(usersTable)
      .where(eq(usersTable.id, context.session.user.id))
      .innerJoin(commentsTable, eq(commentsTable.userId, usersTable.id))
      .innerJoin(updatesTable, eq(updatesTable.id, commentsTable.refId))
      .$dynamic();

    const { countQuery, dataQuery } = withPagination(commentsQuery, [
      desc(commentsTable.createdAt),
    ]);

    const comments = await dataQuery();
    const count = await countQuery();

    return {
      comments,
      count,
    };
  });

export const getUserCommentsQueryOptions = (
  data: z.infer<typeof UserCommentsFnSchema> = {},
) =>
  queryOptions({
    queryKey: ["user-comments", data],
    queryFn: () =>
      getUserCommentsFn({
        data,
      }),
  });

export const getUpdateCommentsFn = createServerFn()
  .inputValidator(CommentFnsSchema)
  .handler(async ({ data }) => {
    const session = await getSessionFn();

    const commentsQuery = client
      .select({
        ...getTableColumns(commentsTable),
        user: usersTable,
        parent: {
          ...getTableColumns(parent),
          user: getTableColumns(parentUser) as unknown as SQL<InferSelectModel<
            typeof usersTable
          > | null>,
        },
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
      .leftJoin(parent, eq(commentsTable.parentId, parent.id))
      .leftJoin(parentUser, eq(parent.userId, parentUser.id))
      .where(
        or(
          and(
            eq(updatesTable.slug, data.slug),
            eq(commentsTable.status, "published"),
          ),
          session
            ? and(
                eq(updatesTable.slug, data.slug),
                eq(commentsTable.userId, session.user.id),
                inArray(commentsTable.status, ["deleted", "deleted_by_admin"]),
              )
            : undefined,
        ),
      )
      .$dynamic();

    const { countQuery, dataQuery } = withPagination(
      commentsQuery,
      [desc(commentsTable.createdAt)],
      data.page,
      data.size,
    );

    const comments = await dataQuery();
    const count = await countQuery();

    return {
      comments,
      count,
      userId: session?.user.id,
    };
  });

export const getUpdateCommentsQueryOptions = (data: CommentFnsSchema) =>
  queryOptions({
    queryKey: ["update-comments", data],
    queryFn: () =>
      getUpdateCommentsFn({
        data,
      }),
  });

const NewCommentSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  parentId: z.string().optional(),
  content: z.string().min(1, "Content is required"),
});

export const addCommentToUpdate = createServerFn({ method: "POST" })
  .middleware([authMiddleware, rateLimitMiddleware("comment", 10)])
  .inputValidator(NewCommentSchema)
  .handler(async ({ data, context }) => {
    try {
      if (hasMiddlewareError(context)) {
        const { error } = context;

        throw new APIError(error.status, {
          message: error.message,
          code: error.code,
        });
      }

      const session = context.session;

      if (!session.user.emailVerified) {
        throw new APIError(403, {
          code: "UNVERIFIED_EMAIL",
          message: "Your email must've been verified to comment",
        });
      }

      const createdComment = await client.transaction(async (tx) => {
        const update = await tx
          .select()
          .from(updatesTable)
          .where(eq(updatesTable.slug, data.slug))
          .limit(1)
          .then((res) => res[0]);

        if (data.parentId) {
          const userParent = await tx
            .select({
              email: usersTable.email,
            })
            .from(commentsTable)
            .where(eq(commentsTable.id, data.parentId))
            .innerJoin(usersTable, eq(usersTable.id, commentsTable.userId))
            .then((res) => res[0]);

          await sendEmail({
            to: userParent.email,
            template: {
              id: "mention",
              variables: {
                name: session.user.name,
                update_title: update.title,
                reply_content: data.content,
                link: update.restricted
                  ? `${clientEnv.VITE_SITE_URL}/r/${data.slug}`
                  : `${clientEnv.VITE_SITE_URL}/${data.slug}`,
              },
            },
          });
        }

        return tx
          .insert(commentsTable)
          .values({
            ...data,
            refTable: "updates",
            refId: update.id,
            userId: session.user.id,
            status: "published",
          })
          .returning({
            id: commentsTable.id,
          })
          .execute();
      });

      return {
        id: createdComment[0].id,
      };
    } catch (error) {
      if (error instanceof APIError) {
        return {
          code: error.body?.code,
          message: handleCommonApiError(error, {
            "429": "Wow wow wow easyyyy!!! Try to chill out",
            "403": error.message,
          }),
        };
      }

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
