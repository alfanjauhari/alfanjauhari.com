import { createFileRoute, notFound } from "@tanstack/react-router";
import { allSnippets } from "content-collections";
import { TerminalIcon } from "lucide-react";
import { MDXContent } from "@/components/mdx-content";
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
    <section className="min-h-screen mt-12 page-transition">
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

        <article className="prose prose-primary prose-lg md:prose-xl prose-headings:leading-tight prose-headings:font-serif motion-translate-y-in-[50px] motion-opacity-in-0 motion-duration-1000 motion-delay-500">
          <MDXContent code={snippet.mdx} />
        </article>
      </div>
    </section>
  );
}
