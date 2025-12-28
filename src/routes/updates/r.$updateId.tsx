import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { allRestrictedUpdates } from "content-collections";
import { LockIcon } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";
import { ContentInteractions } from "@/components/content-interactions";
import { MDXContent } from "@/components/mdx-content";
import { Button } from "@/components/ui/button";
import { PAGE_TRANSITIONS } from "@/constants";
import { clientEnv } from "@/env/client";
import { getSessionFn } from "@/fns/polymorphic/auth";
import { getUpdateCommentsQueryOptions } from "@/fns/polymorphic/comments";
import { getUpdateLikesMetadataQueryOptions } from "@/fns/polymorphic/likes";
import { calculateReadingTime } from "@/lib/content";
import { seoHead } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/updates/r/$updateId")({
  component: UpdateId,
  loader: async ({ params, context }) => {
    const update = allRestrictedUpdates.find(
      (update) => update._meta.path === params.updateId,
    );

    if (!update) {
      throw notFound();
    }

    const session = await getSessionFn();

    // Deferred queries
    context.queryClient.prefetchQuery(
      getUpdateLikesMetadataQueryOptions(params.updateId),
    );
    context.queryClient.prefetchQuery(
      getUpdateCommentsQueryOptions(params.updateId),
    );

    return { update, userId: session?.user.id };
  },
  head: ({ loaderData, match, params }) =>
    seoHead({
      title: loaderData?.update?.title,
      description: loaderData?.update?.summary || "",
      canonical: match.pathname,
      image: `${clientEnv.VITE_CLOUDINARY_URL}/og/updates/r/${params.updateId}.webp`,
    }),
});

function UpdateId() {
  const { update, userId } = Route.useLoaderData();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.section {...PAGE_TRANSITIONS} className="min-h-screen mt-12">
      <motion.div
        className="fixed top-0 inset-x-0 h-2 bg-foreground origin-left z-50"
        style={{ scaleX }}
      />
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
            <span className="text-foreground/30">•</span>
            <span className="text-yellow-600 font-bold flex items-center gap-1">
              <LockIcon className="size-2.5" /> Restricted
            </span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-none mb-8 tracking-tight">
            {update.title}
          </h1>
        </header>

        <motion.article
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="prose prose-primary prose-lg md:prose-xl prose-headings:leading-tight prose-headings:font-serif"
        >
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
        </motion.article>

        <ContentInteractions routeId="/updates/r/$updateId" />
      </div>
    </motion.section>
  );
}
