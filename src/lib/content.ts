import type { InferSelectModel } from "drizzle-orm";
import type { commentsTable } from "@/db/schemas/comments";
import type { updatesTable } from "@/db/schemas/updates";
import type { usersTable } from "@/db/schemas/users";

export function calculateReadingTime(text: string) {
  const wpm = 225;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);

  return time;
}

export type Comment<Update extends boolean = false> = InferSelectModel<
  typeof commentsTable
> & {
  user: InferSelectModel<typeof usersTable>;
  parent:
    | (InferSelectModel<typeof commentsTable> & {
        user: InferSelectModel<typeof usersTable> | null;
      })
    | null;
} & (Update extends true
    ? {
        update: InferSelectModel<typeof updatesTable>;
      }
    : unknown);

export type CommentWithReplies<Update extends boolean = false> =
  Comment<Update> & {
    replies: CommentWithReplies<Update>[];
  };

export function commentsTree<Update extends boolean>(
  comments: Comment<Update>[],
): CommentWithReplies<Update>[] {
  const roots = new Map<string, CommentWithReplies<Update>>();

  for (const c of comments) {
    if (c.rootId === null) {
      roots.set(c.id, { ...c, replies: [] });
    }
  }

  for (const c of comments) {
    if (c.rootId) {
      roots.get(c.rootId)?.replies.push({
        ...c,
        replies: [],
      });
    }
  }

  return [...roots.values()];
}
