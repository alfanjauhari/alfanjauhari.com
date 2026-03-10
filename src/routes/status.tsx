import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { clientEnv } from "@/env/client";
import { getPublicStatusSnapshotQueryOptions } from "@/fns/polymorphic/status";
import { seoHead } from "@/lib/seo";
import { StatusContent, StatusFallback } from "./-status-content";

export const Route = createFileRoute("/status")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(getPublicStatusSnapshotQueryOptions);
  },
  head: () =>
    seoHead({
      title: "Status",
      description:
        "A compact live dashboard with current focus, weather, projects, reading progress, and stocks.",
      canonical: "/status",
      image: `${clientEnv.VITE_CLOUDINARY_URL}/og/home.webp`,
    }),
});

function RouteComponent() {
  return (
    <Suspense fallback={<StatusFallback />}>
      <StatusContent />
    </Suspense>
  );
}
