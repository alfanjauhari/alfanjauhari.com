import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { allRestrictedUpdates } from "content-collections";
import { LockIcon } from "lucide-react";
import { ContentInteractions } from "@/components/content-interactions";
import { MDXContent } from "@/components/mdx-content";
import { Button } from "@/components/ui/button";
import { clientEnv } from "@/env/client";
import { getSessionFn } from "@/fns/polymorphic/auth";
import { getUpdateCommentsQueryOptions } from "@/fns/polymorphic/comments";
import { getUpdateLikesMetadataQueryOptions } from "@/fns/polymorphic/likes";
import { calculateReadingTime } from "@/lib/content";
import { seoHead } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/updates/r/$updateId")({
  component: UpdateId,
  beforeLoad: async () => {
    const session = await getSessionFn();

    return {
      session,
    };
  },
  loader: async ({ params, context }) => {
    const update = allRestrictedUpdates.find(
      (update) => update._meta.path === params.updateId,
    );

    if (!update) {
      throw notFound();
    }

    // Deferred queries
    context.queryClient.prefetchQuery(
      getUpdateLikesMetadataQueryOptions(params.updateId),
    );
    context.queryClient.prefetchQuery(
      getUpdateCommentsQueryOptions({
        slug: params.updateId,
      }),
    );

    return { update, userId: context.session?.user.id };
  },
  head: ({ loaderData, match, params }) =>
    seoHead({
      title: loaderData?.update?.title,
      description: loaderData?.update?.summary || "",
      canonical: match.pathname,
      image: `${clientEnv.VITE_CLOUDINARY_URL}/og/updates/r/${params.updateId}.webp`,
    }),
  ssr: "data-only",
});

function UpdateId() {
  const { update, userId } = Route.useLoaderData();

  return (
    <section className="min-h-screen mt-12 page-transition" data-lenis-prevent>
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-20">
          <div className="flex flex-wrap justify-center gap-4 text-xxs font-mono uppercase tracking-[0.2em] text-foreground/40 mb-8">
            <span>{formatDate(update.date)}</span>
            <span className="text-foreground/30">•</span>
            <span>{update.tag}</span>
            <span className="text-foreground/30">•</span>
            <span>
              {calculateReadingTime(update.content)} Minute Reading Time
            </span>
            <span className="text-foreground/30">•</span>
            <span className="text-yellow-600 font-bold flex items-center gap-1">
              <LockIcon className="size-2.5" /> Restricted
            </span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-none mb-8 tracking-tight">
            {update.title}
          </h1>
        </header>

        <article className="prose prose-primary prose-lg md:prose-xl max-w-full prose-headings:leading-tight prose-headings:font-serif motion-translate-y-in-[50px] motion-opacity-in-0 motion-duration-1000 motion-delay-500">
          <p className="text-xl md:text-2xl font-serif italic mb-12">
            {update.summary}
          </p>
          <hr />
          {!userId ? (
            <div className="p-12 text-center rounded-lg not-prose">
              <LockIcon className="size-12 mx-auto mb-6 opacity-50" />
              <h2 className="font-serif text-3xl mb-4">Members Only Update</h2>
              <p className="text-foreground/50 font-normal mb-8 max-w-md mx-auto">
                This piece is available exclusively to members. Join to access
                premium content, leave comments, and save your favorites.
              </p>
              <Button size="xl" asChild>
                <Link to="/auth/login">Login or Join</Link>
              </Button>
            </div>
          ) : (
            <MDXContent code={update.mdx} />
          )}
        </article>

        <ContentInteractions routeId="/updates/r/$updateId" />
      </div>
    </section>
  );
}
