import { createFileRoute, notFound } from "@tanstack/react-router";
import { allUpdates } from "content-collections";
import { ContentInteractions } from "@/components/content-interactions";
import { MDXContent } from "@/components/mdx-content";
import { clientEnv } from "@/env/client";
import { getUpdateCommentsQueryOptions } from "@/fns/polymorphic/comments";
import { getUpdateLikesMetadataQueryOptions } from "@/fns/polymorphic/likes";
import { calculateReadingTime } from "@/lib/content";
import { seoHead } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/updates/$updateId")({
  component: UpdateId,
  loader: async ({ params, context }) => {
    const update = allUpdates.find(
      (update) => update._meta.path === params.updateId,
    );

    context.queryClient.prefetchQuery(
      getUpdateLikesMetadataQueryOptions(params.updateId),
    );
    context.queryClient.prefetchQuery(
      getUpdateCommentsQueryOptions({
        slug: params.updateId,
      }),
    );

    if (!update) {
      throw notFound();
    }

    return update;
  },
  head: ({ loaderData, match, params }) =>
    seoHead({
      title: loaderData?.title,
      description: loaderData?.summary || "",
      canonical: match.pathname,
      image: `${clientEnv.VITE_CLOUDINARY_URL}/og/updates/${params.updateId}.webp`,
    }),
});

function UpdateId() {
  const update = Route.useLoaderData();

  return (
    <section className="min-h-screen mt-12 page-transition" data-lenis-prevent>
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-20">
          <div className="flex flex-wrap justify-center gap-4 text-xxs font-mono uppercase tracking-[0.2em] text-foreground/40 mb-8">
            <span>{formatDate(update.date)}</span>
            <span className="text-foreground/30">•</span>
            <span>{update.tag}</span>
            <span className="text-foreground/30">•</span>
            <span>
              {calculateReadingTime(update.content)} Minute Reading Time
            </span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-none mb-8 tracking-tight">
            {update.title}
          </h1>
        </header>

        <article className="prose prose-primary prose-lg md:prose-xl prose-headings:leading-tight prose-headings:font-serif motion-translate-y-in-[50px] motion-opacity-in-0 motion-duration-1000 motion-delay-500">
          <p className="text-xl md:text-2xl font-serif italic mb-12">
            {update.summary}
          </p>
          <hr />
          <MDXContent code={update.mdx} />
        </article>

        <ContentInteractions routeId="/updates/$updateId" />
      </div>
    </section>
  );
}
