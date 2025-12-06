import { createFileRoute, Link } from "@tanstack/react-router";
import { LockIcon } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";
import { Button } from "@/components/ui/button";
import { PAGE_TRANSITIONS } from "@/constants";

export const Route = createFileRoute("/updates/$updateId")({
  component: UpdateId,
});

const article = {
  date: "25/10/2025",
  category: "Engineering",
  readTime: "1 Minute",
  isPremium: true,
  title: "Typography in the Age of AI",
  summary:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce efficitur at risus ac tincidunt. Morbi viverra nisi eu libero pulvinar tincidunt.",
  content: `
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce efficitur at risus ac tincidunt. Morbi viverra nisi eu libero pulvinar tincidunt. Nam diam arcu, consectetur vitae nulla eu, ultrices porta nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur fringilla risus condimentum luctus condimentum.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce efficitur at risus ac tincidunt. Morbi viverra nisi eu libero pulvinar tincidunt. Nam diam arcu, consectetur vitae nulla eu, ultrices porta nunc. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur fringilla risus condimentum luctus condimentum.</p>
  `,
};

function UpdateId() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const isLocked = false;

  return (
    <motion.div {...PAGE_TRANSITIONS} className="min-h-screen">
      <motion.div
        className="fixed top-0 inset-x-0 h-2 bg-foreground origin-left z-50"
        style={{ scaleX }}
      />
      <section className="max-w-3xl mx-auto">
        <header className="text-center mb-20">
          <div className="flex flex-wrap justify-center gap-4 text-xxs font-mono uppercase tracking-[0.2em] text-foreground/40 mb-8">
            <span>{article.date}</span>
            <span className="text-foreground/30">•</span>
            <span>{article.category}</span>
            <span className="text-foreground/30">•</span>
            <span>{article.readTime} Read</span>
            <span className="text-foreground/30">•</span>
            {article.isPremium && (
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
            className="prose prose-lg md:prose-xl"
          >
            <p className="lead text-xl md:text-2xl font-serif italic/60 mb-12">
              {article.summary}
            </p>
            {/** biome-ignore lint/security/noDangerouslySetInnerHtml: It needed to render html content */}
            <div dangerouslySetInnerHTML={{ __html: article.content || "" }} />
          </motion.article>
        )}
      </section>
    </motion.div>
  );
}
