import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { HeartIcon } from "lucide-react";
import { getUserLikesQueryOptions } from "@/fns/polymorphic/likes";
import { formatDate } from "@/lib/utils";

export function LikesList() {
  const { data } = useSuspenseQuery(getUserLikesQueryOptions());

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <HeartIcon className="size-6" />
        <span>Like History</span>
        <span className="size-6 rounded-full bg-foreground/10 text-xs flex items-center justify-center">
          {data.count}
        </span>
      </div>
      <hr />
      <div className="space-y-4">
        {data.likes.map((like) => (
          <div className="p-4 bg-foreground/10 space-y-2" key={like.id}>
            <Link
              to={
                like.update.restricted
                  ? "/updates/r/$updateId"
                  : "/updates/$updateId"
              }
              params={{
                updateId: like.update.slug,
              }}
              className="font-serif text-lg inline-block"
            >
              {like.update.title}
            </Link>
            <p className="font-mono text-sm text-foreground/50">
              {formatDate(like.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
