import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { allUpdates } from "content-collections";
import { LockIcon } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";
import { MDXContent } from "@/components/mdx-content";
import { Button } from "@/components/ui/button";
import { PAGE_TRANSITIONS } from "@/constants";

export const Route = createFileRoute("/updates/$updateId")({
  component: UpdateId,
  loader: async ({ params }) => {
    const post = allUpdates.find(
      (update) => update._meta.path === params.updateId,
    );

    if (!post) {
      throw notFound();
    }

    return post;
  },
});

function UpdateId() {
  const article = Route.useLoaderData();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const isLocked = false;

  return (
    <motion.section {...PAGE_TRANSITIONS} className="min-h-screen mt-12">
      <motion.div
        className="fixed top-0 inset-x-0 h-2 bg-foreground origin-left z-50"
        style={{ scaleX }}
      />
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-20">
          <div className="flex flex-wrap justify-center gap-4 text-xxs font-mono uppercase tracking-[0.2em] text-foreground/40 mb-8">
            <span>{article.date.toISOString()}</span>
            <span className="text-foreground/30">•</span>
            <span>{article.tag}</span>
            <span className="text-foreground/30">•</span>
            <span>1 Minute Reading Time</span>
            <span className="text-foreground/30">•</span>
            {article.isMemberOnly && (
              <span className="text-yellow-600 font-bold flex items-center gap-1">
                <LockIcon className="size-2.5" /> Member Only
              </span>
            )}
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-none mb-8 tracking-tight">
            {article.title}
          </h1>
        </header>

        {isLocked ? (
          <div className="p-12 text-center rounded-lg">
            <LockIcon className="size-12 mx-auto mb-6 opacity-50" />
            <h2 className="font-serif text-3xl mb-4">Members Only Article</h2>
            <p className="text-foreground/50 font-normal mb-8 max-w-md mx-auto">
              This piece is available exclusively to community members. Join to
              access premium content, leave comments, and save your favorites.
            </p>
            <Button size="xl" asChild>
              <Link to="/login">Login or Join</Link>
            </Button>
          </div>
        ) : (
          <motion.article
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="prose prose-primary prose-lg md:prose-xl prose-headings:leading-tight"
          >
            <p className="text-xl md:text-2xl font-serif italic mb-12">
              {article.summary}
            </p>
            <MDXContent code={article.mdx} />
          </motion.article>
        )}
      </div>
    </motion.section>
  );
}
