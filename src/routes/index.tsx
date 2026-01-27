import { createFileRoute, Link } from "@tanstack/react-router";
import { allUpdates, allWorks } from "content-collections";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  MapPinIcon,
} from "lucide-react";
import type { CSSProperties } from "react";
import { InteractiveTitle } from "@/components/interactive-title";
import { Button } from "@/components/ui/button";
import { clientEnv } from "@/env/client";
import { calculateReadingTime } from "@/lib/content";
import { seoHead } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Home,
  head: () =>
    seoHead({
      description:
        "A passionate Product Engineer. I build pixel-perfect interfaces and scalable systems for the web.",
      canonical: "/",
      image: `${clientEnv.VITE_CLOUDINARY_URL}/og/home.webp`,
    }),
});

const process = [
  {
    id: "01",
    title: "Discovery",
    desc: "Understanding constraints, user needs, and business goals.",
  },
  {
    id: "02",
    title: "Strategy",
    desc: "Defining the architecture, tech stack, and design system.",
  },
  {
    id: "03",
    title: "Build",
    desc: "Iterative development with a focus on performance and accessibility.",
  },
  {
    id: "04",
    title: "Refine",
    desc: "Polishing interactions, optimizing assets, and ensuring quality.",
  },
];

function Home() {
  return (
    <div className="page-transition">
      <section
        id="hero"
        className="flex flex-col justify-center relative z-10 mb-40"
      >
        <div className="my-16 xl:mb-24">
          <InteractiveTitle />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12 motion-translate-y-in-[20px] motion-opacity-in-0 motion-delay-500">
          <div className="space-y-6">
            <p className="text-xl md:text-2xl leading-tight font-normal max-w-2xl">
              A passionate{" "}
              <span className="italic font-serif">Product Engineer</span>. I
              build <span className="font-serif italic">pixel-perfect</span>{" "}
              interfaces and scalable systems for everyone.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <Button size="xl" asChild>
                <a href="#works">View Works</a>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="mailto:hi@alfanjauhari.com">Contact Me</a>
              </Button>
            </div>
          </div>
          <div className="flex flex-col justify-between items-start md:items-end text-left md:text-right">
            <div className="space-y-1">
              <div className="flex items-center md:justify-end gap-2">
                <MapPinIcon className="size-4" />
                <span className="text-sm font-bold">Tulungagung, ID</span>
              </div>
              <span className="font-mono text-xs text-foreground/40 block">
                06° 12' S, 106° 49' E
              </span>
            </div>

            <div className="hidden md:block animate-bounce mt-12">
              <ArrowDownIcon className="size-5 text-foreground/40" />
            </div>
          </div>
        </div>
      </section>

      <section id="methodology" className="mb-40">
        <h2 className="font-serif text-5xl md:text-6xl mb-16">Methodology</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {process.map((step, i) => (
            <div
              className="relative flex flex-col group intersect:motion-translate-y-in-25 intersect:motion-opacity-in-0 intersect-once"
              key={step.id}
              style={
                {
                  "--motion-delay": `${0.1 * i}s`,
                } as CSSProperties
              }
            >
              <span className="font-mono text-sm text-foreground/40 mb-6 block">
                {step.id}
              </span>
              <div>
                <h3 className="text-3xl font-serif mb-4 group-hover:translate-x-2 transition-transform duration-300">
                  {step.title}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="works" className="mb-40 scroll-mt-36">
        <h2 className="font-serif text-5xl md:text-6xl mb-16">
          Featured Works
        </h2>
        <div className="flex flex-col gap-12 pb-24">
          {allWorks
            .sort((a, b) => b.year - a.year)
            .map((work) => (
              <div className="sticky top-30" key={work._meta.path}>
                <div className="bg-background border border-border rounded-lg overflow-hidden flex flex-col md:flex-row h-125 group relative intersect:motion-opacity-in-0 intersect:motion-translate-y-in-[50px] intersect-once">
                  <Link
                    to="/works/$workId"
                    params={{
                      workId: work._meta.path,
                    }}
                    className="absolute inset-0 z-40"
                    aria-label={`Learn more about ${work.title}...`}
                  />
                  <div className="w-full md:w-1/2 lg:w-7/12 relative overflow-hidden cursor-pointer">
                    <div
                      className="absolute inset-0 grayscale group-hover:grayscale-0 bg-no-repeat bg-cover bg-center group-hover:scale-105 duration-700 ease-in"
                      style={{
                        backgroundImage: `url(${work.thumbnail})`,
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                      <div className="bg-background text-foreground px-6 py-3 rounded-full opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 font-mono text-xs uppercase tracking-widest border border-border">
                        Learn More
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 lg:w-5/12 p-8 lg:p-12 flex flex-col justify-between relative z-30">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <span className="text-xs font-mono">{work.year}</span>
                        <ArrowUpRightIcon className="size-5" />
                      </div>
                      <h3 className="font-serif text-4xl mb-6 leading-tight">
                        {work.title}
                      </h3>
                      <p className="leading-relaxed mb-8 line-clamp-4">
                        {work.summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {work.techstack.map((tech) => (
                        <div
                          key={tech}
                          className="border border-border text-foreground/50 text-xxs px-4 py-2 tracking-widest uppercase"
                        >
                          {tech}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      <section id="updates">
        <div className="flex items-end justify-between mb-16">
          <h2 className="font-serif text-5xl md:text-6xl">Latest Updates</h2>
          <Link
            to="/updates"
            className="hidden md:flex items-center gap-2 text-xs font-mono uppercase tracking-widest hover:underline"
          >
            <span>Read All</span>
            <ArrowRightIcon className="size-3" />
          </Link>
        </div>

        <div className="space-y-16">
          {allUpdates
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .map((update, index) => (
              <Link
                to="/updates/$updateId"
                params={{
                  updateId: update._meta.path,
                }}
                key={update._meta.path}
                className="group block"
              >
                <article
                  className="flex flex-col md:flex-row md:items-baseline justify-between gap-8 intersect:motion-opacity-in-0 intersect:motion-translate-y-in-[50px] intersect-once"
                  style={
                    {
                      "--motion-delay": `${0.1 * index}s`,
                    } as CSSProperties
                  }
                >
                  <div className="md:w-3/4">
                    <h3 className="font-serif text-3xl md:text-4xl group-hover:opacity-60 transition-opacity duration-300 leading-tigh mb-4">
                      {update.title}
                    </h3>
                    <p className="font-normal leading-relaxed max-w-2xl text-foreground/70">
                      {update.summary}
                    </p>
                  </div>
                  <div className="md:w-1/4 md:text-right flex flex-row md:flex-col gap-4 md:gap-0 items-center md:items-end">
                    <span className="font-mono text-xs text-foreground/50 uppercase tracking-widest mb-2">
                      {formatDate(update.date)}
                    </span>
                    <span className="font-mono text-xxs text-foreground/50 uppercase tracking-widest">
                      {calculateReadingTime(update.content)} Minute Reading Time
                    </span>
                  </div>
                </article>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
