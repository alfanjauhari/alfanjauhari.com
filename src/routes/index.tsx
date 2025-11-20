import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownIcon, ArrowRightIcon, MapPinIcon } from "lucide-react";
import { motion } from "motion/react";
import { InteractiveTitle } from "@/components/interactive-title";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: Home });

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
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -20,
      }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Section: HERO */}
      <section className="flex flex-col justify-center relative z-10 min-h-[calc(100vh-6rem)]">
        <div className="my-16">
          <motion.div
            initial={{
              y: 40,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <InteractiveTitle />
          </motion.div>
        </div>

        <motion.div
          initial={{
            y: 20,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            delay: 0.4,
            duration: 0.8,
          }}
          className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12"
        >
          <div className="space-y-6">
            <p className="text-xl md:text-2xl leading-tight text-ink font-normal max-w-2xl">
              Digital craftsman and Senior Frontend Engineer. I build{" "}
              <span className="font-serif italic">pixel-perfect</span>{" "}
              interfaces and scalable systems for the web.
            </p>
            <div className="flex gap-4 pt-2">
              <Button size="xl" asChild>
                <Link to="/works">View Works</Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="mailto:hello@alfan.dev">Contact Me</a>
              </Button>
            </div>
          </div>
          <div className="flex flex-col justify-between items-start md:items-end text-left md:text-right">
            <div className="space-y-1">
              <div className="flex items-center md:justify-end gap-2 text-ink">
                <MapPinIcon className="size-4" />
                <span className="text-sm font-bold">Jakarta, ID</span>
              </div>
              <span className="font-mono text-xs text-gray-400 block">
                06° 12' S, 106° 49' E
              </span>
            </div>

            <div className="hidden md:block animate-bounce mt-12">
              <ArrowDownIcon className="size-5 text-gray-400" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Section: METHODOLOGY */}
      <section className="mb-40">
        <h2 className="font-serif text-5xl md:text-6xl mb-16">Methodology</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {process.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative flex flex-col group"
            >
              <span className="font-mono text-sm text-gray-400 mb-6 block">
                {step.id}
              </span>
              <div>
                <h3 className="text-3xl font-serif text-ink mb-4 group-hover:translate-x-2 transition-transform duration-300">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section: SELECTED WORKS */}
      <section className="mb-40">
        <div className="flex items-center justify-between mb-16">
          <h2 className="font-serif text-5xl md:text-6xl">Selected Works</h2>
          <Link
            className="hidden md:flex items-center gap-2 text-xs font-mono uppercase tracking-widest hover:underline"
            to="/works"
          >
            <span>View All</span>
            <ArrowRightIcon className="size-3" />
          </Link>
        </div>
      </section>
    </motion.div>
  );
}
