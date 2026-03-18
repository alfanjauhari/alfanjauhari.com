import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { clientEnv } from "@/env/client";
import { getPublicFeedsQueryOptions } from "@/fns/polymorphic/feeds";
import { seoHead } from "@/lib/seo";
import { FeedContent } from "./-feed-content";

export const Route = createFileRoute("/feeds")({
  component: () => (
    <Suspense>
      <FeedContent />
    </Suspense>
  ),
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(getPublicFeedsQueryOptions);
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
