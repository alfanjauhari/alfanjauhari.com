import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { MessageSquareIcon } from "lucide-react";
import { getUserCommentsQueryOptions } from "@/fns/polymorphic/comments";
import { commentStatusMap } from "@/lib/content";
import { cn, formatDate } from "@/lib/utils";

export function CommentsList() {
  const { data } = useSuspenseQuery(getUserCommentsQueryOptions());

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquareIcon className="size-6" />
        <span>Comment History</span>
        <span className="size-6 rounded-full bg-foreground/10 text-xs flex items-center justify-center">
          {data.count}
        </span>
      </div>
      <hr />
      <div className="space-y-4">
        {data.comments.map((comment) => (
          <div
            className="px-4 border-l-2 border-l-foreground/30 space-y-4"
            key={comment.id}
          >
            <div className="flex justify-between items-center gap-4">
              <Link
                to={
                  comment.update.restricted
                    ? "/updates/r/$updateId"
                    : "/updates/$updateId"
                }
                params={{
                  updateId: comment.update.slug,
                }}
                className="font-serif"
              >
                {comment.update.title}
              </Link>
              <span
                className={cn(
                  "font-mono p-1 bg-foreground uppercase text-xxs text-accent",
                  {
                    "bg-red-600 text-foreground": comment.status === "deleted",
                  },
                )}
              >
                {commentStatusMap(comment.status)}
              </span>
            </div>
            <div className="italic text-foreground/70 line-clamp-3">
              "{comment.content}"
            </div>
            <p className="font-mono text-sm text-foreground/50">
              {formatDate(comment.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
