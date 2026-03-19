import { createFileRoute } from "@tanstack/react-router";
import { clientEnv } from "@/env/client";
import { getPublicFeedsInfiniteOptions } from "@/fns/polymorphic/feeds";
import { seoHead } from "@/lib/seo";
import { FeedContent } from "./-feed-content";

export const Route = createFileRoute("/feeds")({
  component: FeedContent,
  loader: async ({ context }) => {
    await context.queryClient.prefetchInfiniteQuery(
      getPublicFeedsInfiniteOptions,
    );
  },
  head: () =>
    seoHead({
      title: "Feeds",
      description:
        "Short-form life updates, OSS contributions, new features, discoveries, and whatever else is happening.",
      canonical: "/feeds",
      image: `${clientEnv.VITE_CLOUDINARY_URL}/og/feeds.webp`,
    }),
});
