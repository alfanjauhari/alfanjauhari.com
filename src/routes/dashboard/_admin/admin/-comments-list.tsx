import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ReplyIcon } from "lucide-react";
import { getAllCommentsQueryOptions } from "@/fns/polymorphic/comments";
import { type CommentWithReplies, commentsTree } from "@/lib/content";
import { cn, formatDate } from "@/lib/utils";

function CommentRecord({ comment }: { comment: CommentWithReplies<true> }) {
  return (
    <div
      className={cn(
        "border border-border p-6 block hover:border-foreground duration-300 group target:outline scroll-mt-32",
        {
          "mt-4": comment.parentId,
        },
      )}
      id={`comment-${comment.id}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="font-serif">{comment.user.name}</div>
            {comment.parent?.user && (
              <a
                href={`#comment-${comment.parentId}`}
                className="text-foreground/50 flex items-center gap-2"
              >
                <ReplyIcon className="size-3 rotate-180" />
                <span className="uppercase font-mono text-xxs">
                  Replied to {comment.parent.user.name}
                </span>
              </a>
            )}
          </div>
          <div className="flex gap-4 text-xs font-mono text-foreground/40 mb-4">
            <span>{formatDate(comment.createdAt)}</span>
            <span>•</span>
            <Link
              to={
                comment.update.restricted
                  ? "/updates/r/$updateId"
                  : "/updates/$updateId"
              }
              params={{
                updateId: comment.update.slug,
              }}
            >
              {comment.update.title}
            </Link>
          </div>
          <blockquote className="pl-3 py-1 border-l-2 border-l-border text-sm italic">
            {comment.content}
          </blockquote>
        </div>
      </div>
      {comment.replies.map((reply) => (
        <CommentRecord comment={reply} key={reply.id} />
      ))}
    </div>
  );
}

export function CommentsList() {
  const { data } = useSuspenseQuery(getAllCommentsQueryOptions);

  return (
    <div className="space-y-4">
      {commentsTree<true>(data).map((comment) => (
        <CommentRecord key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
