import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { PropsWithChildren } from "react";
import { DotTitle } from "@/components/dot-title";
import { PAGE_TRANSITIONS } from "@/constants";
import { clientEnv } from "@/env/client";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/(app)/uses")({
  component: Uses,
  head: () =>
    seoHead({
      title: "Uses",
      description:
        "A living collection of the hardware, software, and office gear I use on a daily basis to build a software.",
      canonical: "/uses",
      image: `${clientEnv.VITE_CLOUDINARY_URL}/og/uses.webp`,
    }),
});

function UseSection({
  title,
  subtitle,
  children,
}: PropsWithChildren<{ title: string; subtitle: string }>) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 border-t border-border pt-24 first:border-0 first:pt-0">
      <div className="lg:col-span-4">
        <div className="sticky top-32">
          <DotTitle>{title}</DotTitle>
          <p className="text-foreground/50 font-mono text-xs leading-relaxed max-w-xs">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
        {children}
      </div>
    </div>
  );
}

function UseItem({
  delay,
  title,
  children,
}: PropsWithChildren<{ delay: number; title: string }>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="group"
    >
      <h3 className="font-serif text-2xl text-ink mb-4 group-hover:text-foreground/60 transition-colors">
        {title}
      </h3>
      <p className="prose prose-primary leading-relaxed">{children}</p>
    </motion.div>
  );
}

function BuildItem({
  title,
  description,
  specs,
}: {
  title: string;
  description: string;
  specs: { label: string; value: string }[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group md:col-span-2 border border-border p-8 rounded-sm"
    >
      <div className="mb-8">
        <h3 className="font-serif text-3xl text-ink mb-4">{title}</h3>
        <p className="text-base text-foreground/60 font-normal leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 border-t border-border pt-6">
        {specs.map((spec) => (
          <div
            key={spec.value}
            className="grid grid-cols-[5rem_1fr] items-center border-b border-border/50 pb-2 last:border-0"
          >
            <span className="font-mono text-xxs uppercase tracking-widest text-foreground/50">
              {spec.label}
            </span>
            <span className="font-serif text-lg text-ink text-end">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Uses() {
  return (
    <motion.div {...PAGE_TRANSITIONS} className="mt-12">
      <div className="max-w-2xl mb-24">
        <h1 className="font-serif text-6xl md:text-8xl mb-8 tracking-tight">
          Uses
        </h1>
        <p className="text-lg md:text-xl text-foreground/60 font-normal leading-relaxed">
          A living collection of the hardware, software, and office gear I use
          on a daily basis to build a software.
        </p>
      </div>

      <UseSection
        title="Workstation"
        subtitle="The hardware backbone to support my needs for thinkering and developing a beautiful software"
      >
        <BuildItem
          title="Custom Build PC"
          description="A dedicated PC with Windows 11 and Ubuntu as my secondary operating
          system (actually it just for gaming and college stuff)"
          specs={[
            { label: "Case", value: "Cube Gaming Lich Black" },
            { label: "CPU", value: "AMD Ryzen 5 5500" },
            { label: "GPU", value: "AMD Radeon RX 6600" },
            { label: "RAM", value: "32GB Corsair Vengeance" },
            {
              label: "Storage",
              value: "2TB (Klevv, Samsung and Team Group SSD)",
            },
            { label: "Cooling", value: "ID-COOLING SE-214-XT" },
          ]}
        />
        <UseItem title="Mac Mini M4" delay={0.1}>
          A monster that hides behind the word "mini". This is my main workspace
          for software development
        </UseItem>
        <UseItem title="MacBook Air M1 (2020)" delay={0.2}>
          My main laptop which basically used when I need to go out or join
          meeting because my other computer doesn't have a mic & camera lol
        </UseItem>
        <UseItem title="Keychron K3" delay={0.3}>
          The best mechanical keyboard so far. It can connected up to 3 devices
          and easily switch device by holding some keys
        </UseItem>
        <UseItem title="Logitech Superlight" delay={0.4}>
          Buy this mouse to play some competitive FPS games and definitly worth
          every penny
        </UseItem>
        <UseItem title="Kanata+ Karya" delay={0.5}>
          An adjustable desk with large space to hold my workstation
          well-organized without headache
        </UseItem>
        <UseItem title="Pexio Milson" delay={0.6}>
          Move to this ergonomic chair to make my posture stay good
        </UseItem>
      </UseSection>

      <UseSection
        title="Software"
        subtitle="The digital tools that enable my creativity and supporting my development workflow"
      >
        <UseItem title="Zed" delay={0.1}>
          Very fast IDE that actually worked for my development workflow
        </UseItem>
        <UseItem title="Zen" delay={0.2}>
          A firefox based browser with beautifully and easy to use tab
          management
        </UseItem>
        <UseItem title="Raycast" delay={0.3}>
          Spotlight replacement on steroids. I use it for window management,
          running quick scripts, clipboard history and more
        </UseItem>
        <UseItem title="Ghostty" delay={0.4}>
          Lightweight terminal alternative that cover anything for my needs
        </UseItem>
      </UseSection>
    </motion.div>
  );
}
