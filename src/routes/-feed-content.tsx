import { useSuspenseQuery } from "@tanstack/react-query";
import type { CSSProperties } from "react";
import { getPublicFeedsQueryOptions } from "@/fns/polymorphic/feeds";
import { formatDate } from "@/lib/utils";

export function FeedContent() {
  const { data: feeds } = useSuspenseQuery(getPublicFeedsQueryOptions);

  return (
    <div className="page-transition py-12">
      <section className="mb-16 max-w-3xl">
        <h1 className="font-serif text-7xl mb-6">Feed.</h1>
        <p className="text-lg text-foreground/70">
          Short-form life updates, OSS contributions, new features, discoveries,
          and whatever else is happening.
        </p>
      </section>

      <section className="flex flex-col">
        {feeds.length === 0 ? (
          <div className="py-24 flex flex-col items-center text-center gap-3">
            <p className="font-serif text-4xl text-foreground/30">
              Quiet for now.
            </p>
            <p className="text-sm text-foreground/40 max-w-sm">
              Nothing has been posted yet. Check back soon.
            </p>
          </div>
        ) : (
          feeds.map((feed, index) => (
            <article
              key={feed.id}
              className="intersect:motion-translate-y-in-[50px] intersect:motion-opacity-in-0 intersect-once border-b border-border py-8 first:pt-0 last:border-b-0"
              style={{ "--motion-delay": `${index * 0.08}s` } as CSSProperties}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-foreground/50">
                  {formatDate(feed.date)}
                </span>
                <span className="font-mono text-xxs uppercase tracking-widest border border-border px-2 py-0.5 text-foreground/60">
                  {feed.tag}
                </span>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-2xl whitespace-pre-wrap">
                {feed.content}
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
