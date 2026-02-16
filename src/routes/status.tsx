import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  ActivityIcon,
  BookOpenIcon,
  CloudIcon,
  FocusIcon,
  Gamepad2Icon,
  GoalIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { clientEnv } from "@/env/client";
import { getPublicStatusSnapshotQueryOptions } from "@/fns/polymorphic/status";
import { seoHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/status")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(getPublicStatusSnapshotQueryOptions);
  },
  head: () =>
    seoHead({
      title: "Status",
      description:
        "A compact live dashboard with current focus, weather, projects, reading progress, and stocks.",
      canonical: "/status",
      image: `${clientEnv.VITE_CLOUDINARY_URL}/og/home.webp`,
    }),
});

function formatLocalTime(date: Date, timezone: string) {
  try {
    return {
      time: new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
      }).format(date),
      day: new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        weekday: "short",
        day: "numeric",
        month: "short",
      }).format(date),
    };
  } catch {
    return {
      time: new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date),
      day: new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }).format(date),
    };
  }
}

function LiveClock({ timezone }: { timezone: string }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1_000);

    return () => clearInterval(timer);
  }, []);

  const formatted = useMemo(
    () => formatLocalTime(now, timezone),
    [now, timezone],
  );

  return (
    <div>
      <p className="font-serif text-5xl md:text-6xl tracking-tight">
        {formatted.time}
      </p>
      <p className="text-sm uppercase tracking-[0.2em] text-foreground/60 mt-2">
        {formatted.day}
      </p>
    </div>
  );
}

function ProgressBar({ value }: { value: number | null }) {
  if (typeof value !== "number") {
    return null;
  }

  return (
    <div className="mt-4 space-y-1">
      <div className="h-1.5 bg-foreground/10 overflow-hidden">
        <div className="h-full bg-foreground" style={{ width: `${value}%` }} />
      </div>
      <p className="text-xs font-mono uppercase tracking-widest text-foreground/50">
        {value}%
      </p>
    </div>
  );
}

function RouteComponent() {
  const { data } = useSuspenseQuery(getPublicStatusSnapshotQueryOptions);

  if (!data) {
    return null;
  }

  return (
    <div className="page-transition py-12">
      <section className="mb-16 max-w-3xl">
        <h1 className="font-serif text-7xl mb-6">Status.</h1>
        <p className="text-lg text-foreground/70">
          A personal heads-up display for focus, progress, reading, and market
          watch.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <article className="md:col-span-6 border border-border bg-card p-6 md:p-8">
          <div className="flex items-center justify-between mb-10">
            <p className="font-mono text-xxs uppercase tracking-[0.24em] text-foreground/50">
              Local Time
            </p>
            <p className="font-mono text-xxs uppercase tracking-[0.24em] text-foreground/50">
              {data.profile.locationLabel}
            </p>
          </div>
          <LiveClock timezone={data.profile.timezone} />
        </article>

        <article className="md:col-span-3 border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-10 text-foreground/60">
            <CloudIcon className="size-4" />
            <p className="font-mono text-xxs uppercase tracking-[0.24em]">
              Weather
            </p>
          </div>
          <p className="font-serif text-5xl mb-2">
            {typeof data.profile.weather.tempC === "number"
              ? `${Math.round(data.profile.weather.tempC)}°C`
              : "--"}
          </p>
          <p className="text-sm text-foreground/65 mb-4">
            {data.profile.weather.summary ?? "No weather data"}
          </p>
          <p className="font-mono text-xxs uppercase tracking-[0.24em] text-foreground/45">
            {data.profile.weather.source === "manual" ? "Manual" : "Auto sync"}
          </p>
        </article>

        <article className="md:col-span-3 border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-10 text-foreground/60">
            <FocusIcon className="size-4" />
            <p className="font-mono text-xxs uppercase tracking-[0.24em]">
              Focus
            </p>
          </div>
          <p className="font-serif text-3xl leading-tight">
            {data.profile.focusText ?? "No active focus"}
          </p>
          <ProgressBar value={data.profile.focusProgress} />
        </article>

        <article className="md:col-span-6 border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-foreground/60">
              <GoalIcon className="size-4" />
              <p className="font-mono text-xxs uppercase tracking-[0.24em]">
                Active Project
              </p>
            </div>
            {data.profile.projectStatus ? (
              <span className="font-mono text-xxs uppercase tracking-wider border border-border px-2 py-1">
                {data.profile.projectStatus}
              </span>
            ) : null}
          </div>
          <p className="font-serif text-4xl mb-3">
            {data.profile.projectName ?? "No active project"}
          </p>
          {data.profile.projectMilestone ? (
            <p className="font-mono text-xxs uppercase tracking-[0.24em] text-foreground/50">
              Milestone: {data.profile.projectMilestone}
            </p>
          ) : null}
          <ProgressBar value={data.profile.projectProgress} />
        </article>

        <article className="md:col-span-3 border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-8 text-foreground/60">
            <BookOpenIcon className="size-4" />
            <p className="font-mono text-xxs uppercase tracking-[0.24em]">
              Reading
            </p>
          </div>
          <p className="font-serif text-3xl leading-tight mb-1">
            {data.profile.readingTitle ?? "Not reading"}
          </p>
          {data.profile.readingAuthor ? (
            <p className="text-sm text-foreground/60">
              by {data.profile.readingAuthor}
            </p>
          ) : null}
          <ProgressBar value={data.profile.readingProgress} />
        </article>

        <article className="md:col-span-3 border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-8 text-foreground/60">
            <Gamepad2Icon className="size-4" />
            <p className="font-mono text-xxs uppercase tracking-[0.24em]">
              Playing
            </p>
          </div>
          <p className="font-serif text-3xl leading-tight mb-4">
            {data.profile.playingTitle ?? "Not playing"}
          </p>
          {data.profile.playingPlatform ? (
            <span className="font-mono text-xxs uppercase tracking-wider border border-border px-2 py-1">
              {data.profile.playingPlatform}
            </span>
          ) : null}
        </article>

        <article className="md:col-span-12 border border-border bg-card p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-foreground/60">
              <ActivityIcon className="size-4" />
              <p className="font-mono text-xxs uppercase tracking-[0.24em]">
                Stock Snapshot
              </p>
            </div>
            <p className="font-mono text-xxs uppercase tracking-[0.24em] text-foreground/45">
              Delayed quotes
            </p>
          </div>

          {data.stocks.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.stocks.map((stock) => {
                const changePercent = stock.autoChangePercent;
                const hasChange = typeof changePercent === "number";
                const isPositive = hasChange && changePercent >= 0;

                return (
                  <div className="border border-border p-4" key={stock.id}>
                    <p className="font-mono text-xs tracking-widest uppercase mb-4">
                      {stock.symbol}
                    </p>
                    <p className="font-serif text-4xl mb-2">
                      {typeof stock.autoPrice === "number"
                        ? stock.autoPrice.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : "--"}
                    </p>
                    <p
                      className={cn(
                        "text-xs font-mono uppercase tracking-wider flex items-center gap-1",
                        hasChange
                          ? isPositive
                            ? "text-emerald-500"
                            : "text-rose-500"
                          : "text-foreground/50",
                      )}
                    >
                      {isPositive ? (
                        <TrendingUpIcon className="size-3" />
                      ) : hasChange ? (
                        <TrendingDownIcon className="size-3" />
                      ) : null}
                      {hasChange
                        ? `${isPositive ? "+" : ""}${changePercent.toFixed(2)}%`
                        : "No movement"}
                    </p>
                    <p className="text-xxs text-foreground/45 mt-3">
                      {stock.currency ?? "USD"}{" "}
                      {stock.delayed ? "(Delayed)" : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-foreground/60">
              No symbols configured yet.
            </p>
          )}
        </article>
      </section>
    </div>
  );
}
