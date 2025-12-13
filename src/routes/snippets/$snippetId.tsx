import { createFileRoute, notFound } from "@tanstack/react-router";
import { allSnippets } from "content-collections";
import { TerminalIcon } from "lucide-react";
import { motion } from "motion/react";
import { MDXContent } from "@/components/mdx-content";
import { PAGE_TRANSITIONS } from "@/constants";
import { clientEnv } from "@/env/client";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/snippets/$snippetId")({
  component: Snippet,
  loader: async ({ params }) => {
    const snippet = allSnippets.find(
      (snippet) => snippet._meta.path === params.snippetId,
    );

    if (!snippet) {
      throw notFound();
    }

    return snippet;
  },
  head: ({ loaderData, match, params }) =>
    seoHead({
      title: loaderData?.title,
      description: loaderData?.summary || "",
      canonical: match.pathname,
      image: `${clientEnv.VITE_CLOUDINARY_URL}/og/snippets/${params.snippetId}.webp`,
    }),
});

function Snippet() {
  const snippet = Route.useLoaderData();

  return (
    <motion.section {...PAGE_TRANSITIONS} className="min-h-screen mt-12">
      <div className="max-w-3xl mx-auto">
        <header className="mb-20">
          <div className="flex items-center gap-3 mb-6 text-xs font-mono uppercase tracking-widest text-foreground/40">
            <TerminalIcon className="size-3.5" />
            <span>{snippet.language}</span>
            <span className="text-foreground/30">•</span>
            {snippet.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <h1 className="font-serif text-4xl md:text-6xl leading-none mb-6">
            {snippet.title}
          </h1>

          <p className="text-xl mb-12 text-foreground/40">{snippet.summary}</p>
        </header>

        <motion.article
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="prose prose-primary prose-lg md:prose-xl prose-headings:leading-tight prose-headings:font-serif"
        >
          <MDXContent code={snippet.mdx} />
        </motion.article>
      </div>
    </motion.section>
  );
}
