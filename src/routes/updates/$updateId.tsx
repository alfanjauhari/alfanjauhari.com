import { createFileRoute, notFound } from "@tanstack/react-router";
import { allUpdates } from "content-collections";
import { motion, useScroll, useSpring } from "motion/react";
import { ContentInteractions } from "@/components/content-interactions";
import { MDXContent } from "@/components/mdx-content";
import { PAGE_TRANSITIONS } from "@/constants";
import { clientEnv } from "@/env/client";
import { calculateReadingTime } from "@/lib/content";
import { seoHead } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/updates/$updateId")({
  component: UpdateId,
  loader: async ({ params }) => {
    const update = allUpdates.find(
      (update) => update._meta.path === params.updateId,
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
          <MDXContent code={update.mdx} />
        </motion.article>

        <ContentInteractions routeId="/updates/$updateId" />
      </div>
    </motion.section>
  );
}
