import { createFileRoute, Link } from "@tanstack/react-router";
import { allUpdates } from "content-collections";
import { ArrowUpRightIcon } from "lucide-react";
import { motion } from "motion/react";
import { PAGE_TRANSITIONS } from "@/constants";
import { clientEnv } from "@/env/client";
import { calculateReadingTime } from "@/lib/content";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/updates/")({
  component: Updates,
  head: () =>
    seoHead({
      title: "Updates",
      description:
        "A collection of my thoughts on software engineering, design systems, and the intersection of humanity and technology.",
      canonical: "/updates",
      image: `${clientEnv.VITE_CLOUDINARY_URL}/og/updates.webp`,
    }),
});

function Updates() {
  return (
    <motion.section {...PAGE_TRANSITIONS} className="mt-12">
      <div className="max-w-2xl mb-24">
        <h1 className="font-serif text-6xl md:text-8xl mb-8 tracking-tight">
          Updates.
        </h1>
        <p className="text-lg md:text-xl text-foreground/60 font-normal leading-relaxed">
          A collection of thoughts on software engineering, design systems, and
          the intersection of humanity and technology.
        </p>
      </div>

      <div className="flex flex-col gap-y-12 lg:gap-y-24">
        {allUpdates
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .map((update, index) => (
            <Link
              to="/updates/$updateId"
              params={{
                updateId: update._meta.path,
              }}
              key={update._meta.path}
            >
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="flex flex-col md:flex-row justify-between gap-8 mb-4">
                  <h3 className="font-serif text-4xl md:text-6xl group-hover:opacity-70 transition-opacity duration-300 max-w-4xl">
                    {update.title}
                  </h3>
                  <ArrowUpRightIcon className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2 group-hover:-translate-y-2 size-12" />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mt-6 mb-8">
                  <div className="flex gap-4 text-xs font-mono uppercase tracking-widest text-foreground/50">
                    <span>
                      {new Intl.DateTimeFormat("id-ID").format(update.date)}
                    </span>
                    <span className="text-foreground/30">/</span>
                    <span>{update.tag}</span>
                    <span className="text-foreground/30">/</span>
                    <span>
                      {calculateReadingTime(update.content)} Minute Reading Time
                    </span>
                  </div>
                </div>
                <p className="text-foreground/60 font-normal max-w-2xl leading-relaxed">
                  {update.summary}
                </p>
              </motion.article>
            </Link>
          ))}
      </div>
    </motion.section>
  );
}
