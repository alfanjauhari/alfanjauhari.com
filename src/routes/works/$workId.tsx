import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { allWorks } from "content-collections";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  ArrowUpRightIcon,
  CheckCircle2Icon,
  Code2Icon,
  CpuIcon,
  DatabaseIcon,
  GlobeIcon,
  LayersIcon,
  LayoutIcon,
  LightbulbIcon,
  TerminalIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { MDXContent } from "@/components/mdx-content";
import { Button } from "@/components/ui/button";
import { PAGE_TRANSITIONS } from "@/constants";
import { clientEnv } from "@/env/client";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/works/$workId")({
  component: WorkDetail,
  loader: async ({ params }) => {
    const work = allWorks.find((work) => work._meta.path === params.workId);

    if (!work) {
      throw notFound();
    }

    return work;
  },
  head: ({ loaderData, match, params }) =>
    seoHead({
      title: loaderData?.title,
      description: loaderData?.summary || "",
      canonical: match.pathname,
      image: `${clientEnv.VITE_CLOUDINARY_URL}/og/works/${params.workId}.webp`,
    }),
});

const getTechIcon = (tech: string) => {
  const lower = tech.toLowerCase();
  if (lower.includes("react") || lower.includes("next"))
    return <LayoutIcon className="size-4" />;
  if (lower.includes("typescript") || lower.includes("js"))
    return <Code2Icon className="size-4" />;
  if (lower.includes("data") || lower.includes("sql") || lower.includes("d3"))
    return <DatabaseIcon className="size-4" />;
  if (lower.includes("node") || lower.includes("api"))
    return <TerminalIcon className="size-4" />;
  if (lower.includes("shopify") || lower.includes("web"))
    return <GlobeIcon className="size-4" />;
  if (lower.includes("motion") || lower.includes("animation"))
    return <LayersIcon className="size-4" />;
  return <CpuIcon className="size-4" />;
};

function WorkDetail() {
  const work = Route.useLoaderData();

  return (
    <motion.div {...PAGE_TRANSITIONS} className="min-h-screen mt-12">
      <header className="mb-40">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-foreground/60 hover:text-foreground mb-12 transition-colors group"
        >
          <ArrowLeftIcon className="group-hover:-translate-x-1 transition-transform size-3.5" />
          Back to Home
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-6xl md:text-8xl mb-8 tracking-tight leading-[0.9]"
        >
          {work.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-xl md:text-2xl font-normal text-foreground/60 max-w-2xl leading-relaxed"
        >
          {work.summary}
        </motion.p>
      </header>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-3">
            <div className="sticky top-32 space-y-12">
              <div className="grid grid-cols-2 md:grid-cols-1 gap-8">
                <div>
                  <h3 className="text-xxs font-bold uppercase tracking-widest text-foreground/50 mb-2">
                    Client
                  </h3>
                  <p className="font-serif text-lg">{work.client}</p>
                </div>
                <div>
                  <h3 className="text-xxs font-bold uppercase tracking-widest text-foreground/50 mb-2">
                    Role
                  </h3>
                  <p className="font-serif text-lg">{work.role}</p>
                </div>
                <div>
                  <h3 className="text-xxs font-bold uppercase tracking-widest text-foreground/50 mb-2">
                    Year
                  </h3>
                  <p className="font-serif text-lg">{work.year}</p>
                </div>
              </div>

              {/* Technologies Used Section */}
              <div>
                <h3 className="text-xxs font-bold uppercase tracking-widest text-foreground/50 mb-4">
                  Technologies Used
                </h3>
                <div className="flex flex-col gap-2">
                  {work.techstack.map((tech) => (
                    <div
                      key={tech}
                      className="flex items-center gap-3 p-3 border border-border rounded-sm hover:border-foreground transition-colors group"
                    >
                      <span className="text-foreground/40 group-hover transition-colors">
                        {getTechIcon(tech)}
                      </span>
                      <span className="text-sm font-mono">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>

              {work.link && (
                <Button variant="ghost" asChild className="w-full" size="xl">
                  <a href={work.link} target="_blank" rel="noopener noreferrer">
                    Live Website <ArrowUpRightIcon className="size-3.5" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Main Narrative - 2 Column Layout */}
          <div className="md:col-span-9 md:pl-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24"
            >
              {/* Challenge Column */}
              <div className="border border-border p-8 rounded-sm">
                <div className="flex items-center gap-3 mb-6">
                  <AlertCircleIcon className="size-6 text-red-600" />
                  <h2 className="font-serif text-3xl">The Challenge</h2>
                </div>
                <div className="prose prose-lg prose-primary max-w-none text-foreground/60 font-normal leading-relaxed">
                  <p>{work.challenge}</p>
                </div>
              </div>

              {/* Solution Column */}
              <div className="border border-border p-8 rounded-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <LightbulbIcon className="size-32" />
                </div>
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <CheckCircle2Icon className="size-6 text-green-600" />
                  <h2 className="font-serif text-3xl">The Solution</h2>
                </div>
                <div className="prose prose-lg prose-primary max-w-none text-foreground/60 font-normal leading-relaxed relative z-10">
                  <p>{work.solution}</p>
                </div>
              </div>
            </motion.div>

            <motion.article
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="prose prose-primary prose-lg md:prose-xl prose-headings:leading-tight prose-headings:font-serif"
            >
              <MDXContent code={work.mdx} />
            </motion.article>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
