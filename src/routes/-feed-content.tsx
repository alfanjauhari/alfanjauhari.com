import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { getPublicFeedsInfiniteOptions } from "@/fns/polymorphic/feeds";
import { formatDate } from "@/lib/utils";

export function FeedContent() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(getPublicFeedsInfiniteOptions);

  const feeds = data.pages.flatMap((page) => page.items);

  const sentinelRefCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        { rootMargin: "200px" },
      );

      observer.observe(node);
      return () => observer.disconnect();
    },
    [hasNextPage, fetchNextPage, isFetchingNextPage],
  );

  return (
    <section className="page-transition mt-12">
      <div className="max-w-2xl mb-24">
        <h1 className="font-serif text-6xl md:text-8xl mb-8 tracking-tight">
          Feeds
        </h1>
        <p className="text-lg md:text-xl text-foreground/60 font-normal leading-relaxed">
          Short-form life updates, OSS contributions, new features, discoveries,
          and whatever else is happening.
        </p>
      </div>

      <section className="flex flex-col">
        {feeds.length === 0 ? (
          <div className="py-24 flex flex-col items-center text-center gap-3">
            <p className="font-serif text-4xl text-foreground">
              Quiet for now.
            </p>
            <p className="text-foreground/80 max-w-sm">
              Nothing has been posted yet. Check back soon.
            </p>
          </div>
        ) : (
          <>
            {feeds.map((feed) => (
              <article
                key={feed.id}
                className="border-b border-border py-8 first:pt-0 last:border-b-0"
              >
                <div className="flex items-center gap-4 mb-3">
                  <span className="font-mono text-xs uppercase tracking-widest text-foreground/50">
                    {formatDate(feed.date)}
                  </span>
                  <span className="font-mono text-xxs uppercase tracking-widest border border-border px-2 py-0.5 text-foreground/60">
                    {feed.tag}
                  </span>
                </div>
                <div
                  className="prose prose-sm dark:prose-invert max-w-2xl"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: admin-authored HTML content
                  dangerouslySetInnerHTML={{ __html: feed.content }}
                />
              </article>
            ))}
            <div ref={sentinelRefCallback} className="py-8 flex justify-center">
              {isFetchingNextPage && (
                <span className="font-mono text-xs uppercase tracking-widest text-foreground/40">
                  Loading...
                </span>
              )}
            </div>
          </>
        )}
      </section>
    </section>
  );
}
