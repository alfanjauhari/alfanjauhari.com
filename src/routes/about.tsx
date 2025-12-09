import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRightIcon } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { PAGE_TRANSITIONS } from "@/constants";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  component: About,
  head: () =>
    seoHead({
      title: "About",
      description:
        "Aboute me, a passionate Product Engineer building pixel-perfect interfaces and scalable systems for everyone",
      canonical: "/about",
      image: "/images/og/about.webp",
    }),
});

function ExperienceItem({
  role,
  company,
  period,
  description,
}: {
  role: string;
  company: string;
  period: string;
  description: string;
}) {
  return (
    <div className="group py-8 border-t border-border first:border-0">
      <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
        <h3 className="font-serif text-2xl">
          {role}{" "}
          <span className="text-foreground/50 italic text-lg">
            at {company}
          </span>
        </h3>
        <span className="font-mono text-xs text-foreground/50 uppercase tracking-widest mt-1 md:mt-0">
          {period}
        </span>
      </div>
      <p className="text-sm text-foreground/50 leading-relaxed max-w-xl font-normal">
        {description}
      </p>
    </div>
  );
}

function TechItem({ category, items }: { category: string; items: string[] }) {
  return (
    <div className="py-6">
      <h3 className="font-mono text-xs uppercase tracking-widest mb-4">
        {category}
      </h3>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {items.map((item) => (
          <span key={item} className="text-lg font-serif">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function About() {
  return (
    <motion.div {...PAGE_TRANSITIONS}>
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32">
        <div className="lg:col-span-8">
          <h1 className="font-serif text-7xl md:text-9xl mb-12 tracking-tight">
            Who <br />
            <span className="italic text-foreground/50">am I?</span>
          </h1>

          <div className="max-w-2xl">
            <p className="text-xl md:text-2xl font-normal leading-normal">
              <span className="float-left text-7xl font-serif pr-4">I</span>
              am a Product Engineer based in Indonesia. I sit at the
              intersection of design and engineering, believing that the best
              digital products must be feel{" "}
              <span className="italic">unique</span>, not only functional.
            </p>
            <p className="text-foreground/60 font-normal mt-2 leading-normal">
              With over four years in web development, I’ve crafted and refined
              modern interfaces, elevated developer experience, and built tools
              that make engineering smoother and more reliable. I believe great
              software isn’t just about shipping features but it’s about
              understanding the craft, improving the process, and leaving things
              better than you found them.
            </p>
          </div>
        </div>

        <div className="lg:col-span-4 relative h-[400px] lg:h-auto bg-surface rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
          <div className="absolute inset-0 bg-[url(/images/about/profile.avif)] bg-cover bg-center opacity-80 hover:scale-105 transition-transform duration-1000"></div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-32">
        <div className="lg:col-span-4">
          <div className="sticky top-32">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-foreground"></span>
              Experience
            </h2>
            <p className="text-foreground/50 font-mono text-xs leading-relaxed max-w-xs">
              A timeline of my professional career, highlighting key roles and
              contributions in the tech industry.
            </p>

            <a
              href="/resume.pdf"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest mt-8 border-b border-ink pb-1 hover:opacity-60 transition-opacity"
            >
              Download Resume <ArrowUpRightIcon className="size-3" />
            </a>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ExperienceItem
            role="Product Engineer"
            company="Zero One Group"
            period="2022 — Present"
            description="Delivered multiple projects by maximizing client resources and applying a strong user-centric approach. Expanded from frontend into full-stack responsibilities, strengthening capabilities in both logic and system implementation. Improved skills in areas like animation and complex operations while optimizing React and Next.js for higher performance and smaller bundle sizes."
          />
          <ExperienceItem
            role="Frontend Developer"
            company="Nusantech"
            period="2021 - 2022"
            description="Developed a full-scale ERP and business management platform for Japanese clients, delivering multi-language support with i18n and Docker. Collaborated with large cross-functional teams and optimized the system using Next.js to enhance performance and user experience."
          />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32 border-t border-border pt-32">
        <div className="lg:col-span-4">
          <div className="sticky top-32">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-foreground"></span>
              Tech Stack
            </h2>
            <p className="text-foreground/50 font-mono text-xs leading-relaxed max-w-xs">
              The tools and technologies I use to bring ideas to life, always
              prioritizing performance and scalability.
            </p>
          </div>
        </div>
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          <TechItem
            category="Core"
            items={["JavaScript", "TypeScript", "Golang"]}
          />
          <TechItem
            category="Frameworks"
            items={["React", "Next.js", "Node.js"]}
          />
          <TechItem
            category="Styling"
            items={["Tailwind CSS", "Sass", "Motion"]}
          />
          <TechItem
            category="Database"
            items={["PostgreSQL", "Supabase", "Neon"]}
          />
          <TechItem
            category="Tools"
            items={["Git", "Docker", "Webpack", "Vite"]}
          />
          <TechItem category="Design" items={["Figma"]} />
        </div>
      </section>

      <section className="py-24 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-foreground/50 mb-6 block">
            Ready to start?
          </span>
          <h2 className="font-serif text-6xl md:text-8xl mb-8 leading-none tracking-tight">
            Let's work <br />{" "}
            <span className="italic text-foreground/50">together.</span>
          </h2>
          <p className="text-lg text-foreground/50 mb-12 max-w-2xl mx-auto font-normal leading-relaxed">
            I'm currently open to any interesting opportunity. If you have a
            project in mind, feel free to reach out.
          </p>
          <Button asChild size="xl">
            <a href="mailto:hi@alfanjauhari.com">Get in Touch</a>
          </Button>
        </div>
      </section>
    </motion.div>
  );
}
