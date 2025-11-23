import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  MapPinIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { InteractiveTitle } from "@/components/interactive-title";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FEATURED_WORKS } from "@/constants";

export const Route = createFileRoute("/")({ component: Home });

export const updates = [
  {
    id: "1",
    title: "The Beauty of Minimalist Interfaces",
    date: "Oct 12, 2024",
    category: "Design",
    summary:
      "Exploring why less is often more when constructing user interfaces for complex applications. We dive into negative space, typography scales, and the removal of non-essential elements.",
    readTime: "5 min",
    featured: true,
    content: `
      <p class="mb-6 text-xl font-serif leading-relaxed text-gray-800 dark:text-gray-200">In a world cluttered with information, clarity is power. Minimalist interfaces are not about removing features; they are about removing distractions. When we strip away the non-essential, we allow the user to focus on what truly matters.</p>

      <h3 class="text-2xl font-bold mt-12 mb-6 text-ink">The Power of Negative Space</h3>
      <p class="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">The concept of negative space—often referred to as whitespace—is fundamental to this approach. It is not merely empty space; it is an active design element that guides the eye and creates structure without the need for borders or dividers. By increasing the margins and padding between elements, we create a rhythm that makes the content easier to digest.</p>

      <p class="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">Consider the evolution of typography on the web. We have moved from dense, text-heavy pages to layouts that breathe. Large, bold headings paired with generous line heights improve readability and reduce cognitive load. This is not just an aesthetic choice; it is a functional one.</p>

      <h3 class="text-2xl font-bold mt-12 mb-6 text-ink">Function Over Decoration</h3>
      <p class="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">As frontend engineers, we must advocate for simplicity. Every element we add to a page increases complexity, maintenance cost, and cognitive burden on the user. Before adding a button, a modal, or a tooltip, ask yourself: "Is this absolutely necessary?"</p>

      <p class="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">True minimalism is the result of rigorous editing. It is the art of saying more with less. It requires a deep understanding of the user's goals and the discipline to prioritize them above all else.</p>
    `,
  },
  {
    id: "2",
    title: "React 19 and the Future of State",
    date: "Sep 28, 2024",
    category: "Engineering",
    summary:
      "A deep dive into the new features of React 19 and how they change our mental model of state management.",
    readTime: "8 min",
    featured: true,
    content: `
      <p class="mb-6 text-xl font-serif leading-relaxed text-gray-800 dark:text-gray-200">React has always been about the UI being a function of state. With React 19, that function is becoming more powerful, more concurrent, and surprisingly, simpler.</p>

      <h3 class="text-2xl font-bold mt-12 mb-6 text-ink">The Death of useEffect?</h3>
      <p class="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">For years, <code>useEffect</code> has been the swiss-army knife of React development. Fetching data? useEffect. Subscribing to events? useEffect. Synchronizing state? useEffect. But it was also a footgun. React 19 introduces new primitives that handle these side effects more gracefully, moving us towards a model where valid state transitions are handled directly in event handlers or through the new <code>use</code> API.</p>

      <p class="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">The introduction of the compiler also means we spend less time worrying about memoization. <code>useMemo</code> and <code>useCallback</code> might soon become relics of a manual optimization era, allowing us to focus purely on business logic.</p>
    `,
  },
  {
    id: "3",
    title: "Typography in the Age of AI",
    date: "Aug 15, 2024",
    category: "Thoughts",
    summary:
      "Can AI truly understand the nuance of kerning and leading? A look at generative design tools.",
    readTime: "4 min",
    featured: false,
    content: `
      <p class="mb-6 text-xl font-serif leading-relaxed text-gray-800 dark:text-gray-200">Generative AI can write code, paint pictures, and compose music. But can it typeset a page?</p>
      <p class="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">Typography is an emotional discipline. The difference between a good layout and a great one often comes down to "feeling"—the subtle adjustment of tracking on a headline, the optical alignment of a bullet point. These are decisions made by the human eye, influenced by centuries of tradition.</p>
    `,
  },
  {
    id: "4",
    title: "Building Resilient Systems",
    date: "Jul 02, 2024",
    category: "Engineering",
    summary:
      "Strategies for error handling and gracefull degradation in modern web apps.",
    readTime: "6 min",
    featured: false,
    content: `
      <p class="mb-6 text-xl font-serif leading-relaxed text-gray-800 dark:text-gray-200">Errors are inevitable. Broken systems are optional.</p>
      <p class="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">Resilience in frontend development means assuming the network will fail, the API will return 500s, and the user will click buttons twice. It means designing UI states that communicate uncertainty without breaking trust.</p>
    `,
  },
  {
    id: "5",
    title: "The Psychology of Loading States",
    date: "Jun 10, 2024",
    category: "UX",
    summary:
      "How perceived performance affects user retention and the subtle art of skeleton screens.",
    readTime: "5 min",
    featured: true,
    content: `
      <p class="mb-6 text-xl font-serif leading-relaxed text-gray-800 dark:text-gray-200">Waiting is painful. But waiting without feedback is torture.</p>
      <p class="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">Skeleton screens work because they reduce entropy. They provide a structure that promises content is coming, maintaining the layout stability and reducing the cognitive jar when data finally arrives. It's a small psychological trick that makes 2 seconds feel like 500ms.</p>
    `,
  },
];

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
      <section className="flex flex-col justify-center relative z-10 min-h-[calc(100vh-6rem)] mb-40 overflow-hidden">
        <div className="my-16 xl:mb-24">
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
            <div className="flex gap-4">
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
        <h2 className="font-serif text-5xl md:text-6xl mb-16">
          Selected Works
        </h2>
        <div className="flex flex-col gap-12 pb-24">
          {FEATURED_WORKS.map((work, index) => (
            <div
              className="sticky"
              key={work.id}
              style={{
                top: `calc(7.5rem + ${index * 40}px)`,
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5 }}
                className="bg-background border border-border rounded-lg overflow-hidden flex flex-col md:flex-row h-auto md:h-[500px] group relative"
              >
                <Link
                  to={`/works/${work.slug}`}
                  className="absolute inset-0 z-40"
                />
                <div className="w-full md:w-7/12 relative overflow-hidden cursor-pointer">
                  <motion.div
                    className="absolute inset-0 bg-linear-30 from-accent to-accent/80"
                    whileHover={{ scale: 1.05 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.33, 1, 0.68, 1],
                    }}
                  />
                  <div className="relative z-10 h-full flex items-center justify-center pointer-events-none">
                    <motion.div className="text-foreground font-serif text-9xl select-none">
                      {work.id}
                    </motion.div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <div className="bg-background text-foreground px-6 py-3 rounded-full opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 font-mono text-xs uppercase tracking-widest border border-border">
                      Explore Case Study
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-5/12 p-8 md:p-12 flex flex-col justify-between relative z-30">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-xs font-mono">{work.year}</span>
                      <ArrowUpRightIcon className="size-5" />
                    </div>
                    <h3 className="font-serif text-4xl text-ink mb-6 leading-tight">
                      {work.title}
                    </h3>
                    <p className="leading-relaxed mb-8 text-5050">
                      {work.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {work.tags.map((tag) => (
                      <Tooltip key={tag}>
                        <TooltipTrigger
                          className="border border-border text-foreground/50 text-xxs px-4 py-2 tracking-widest uppercase cursor-help"
                          asChild
                        >
                          <Link to={`works?tag=${tag}`}>{tag}</Link>
                        </TooltipTrigger>
                        <TooltipContent>View {tag} Projects</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* Section: LATEST UPDATES */}
      <section className="mb-40">
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
          {updates.map((update, index) => (
            <Link
              to={`/updates/${update.id}`}
              key={update.id}
              className="group block"
            >
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col md:flex-row md:items-baseline justify-between gap-8"
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
                    {update.date}
                  </span>
                  <span className="font-mono text-xxs text-foreground/50 uppercase tracking-widest">
                    {update.readTime}
                  </span>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
