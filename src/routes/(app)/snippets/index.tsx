import { createFileRoute, Link } from "@tanstack/react-router";
import { allSnippets } from "content-collections";
import { ChevronRightIcon, CodeIcon, HashIcon } from "lucide-react";
import { motion } from "motion/react";
import { PAGE_TRANSITIONS } from "@/constants";
import { clientEnv } from "@/env/client";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/(app)/snippets/")({
  component: Snippets,
  head: () =>
    seoHead({
      title: "Snippets",
      description:
        "A collection of copy-pasteable code blocks, utility functions, and hooks I use across my projects.",
      canonical: "/snippets",
      image: `${clientEnv.VITE_CLOUDINARY_URL}/og/snippets.webp`,
    }),
});

function Snippets() {
  return (
    <motion.section {...PAGE_TRANSITIONS} className="mt-12">
      <div className="max-w-2xl mb-24">
        <h1 className="font-serif text-6xl md:text-8xl mb-8 tracking-tight">
          Snippets.
        </h1>
        <p className="text-lg md:text-xl text-foreground/60 font-normal leading-relaxed">
          A collection of copy-pasteable code blocks, utility functions, and
          hooks I use across my projects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border border-border">
        {allSnippets.map((snippet, idx) => (
          <Link
            to="/snippets/$snippetId"
            params={{
              snippetId: snippet._meta.path,
            }}
            key={snippet._meta.path}
            className="block h-full"
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group p-8 h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-primary/20 p-3 rounded-sm">
                    <CodeIcon className="size-5" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-widest text-foreground/40">
                    {snippet.language}
                  </span>
                </div>

                <h3 className="font-serif text-2xl mb-3 group-hover:underline decoration-1 underline-offset-4">
                  {snippet.title}
                </h3>
                <p className="text-sm text-foreground/60 font-light leading-relaxed mb-6">
                  {snippet.summary}
                </p>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-foreground/80">
                <div className="flex gap-2">
                  {snippet.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center text-xxs font-mono uppercase text-foreground/50"
                    >
                      <HashIcon className="mr-0.5 size-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>
                <ChevronRightIcon className="text-foreground/40 group-hover:translate-x-1 transition-transform size-4" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
