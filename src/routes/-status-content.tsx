import { useSuspenseQuery } from "@tanstack/react-query";
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
import { Skeleton } from "@/components/ui/skeleton";
import { getPublicStatusSnapshotQueryOptions } from "@/fns/polymorphic/status";
import { cn, formatLocalTime } from "@/lib/utils";

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

export function StatusContent() {
  const { data } = useSuspenseQuery(getPublicStatusSnapshotQueryOptions);

  if (!data) {
    return null;
  }

  console.log(data);

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

export function StatusFallback() {
  return (
    <div className="page-transition py-12">
      <section className="mb-16 max-w-3xl">
        <Skeleton className="h-16 w-48 mb-6" />
        <Skeleton className="h-5 w-full max-w-xl" />
        <Skeleton className="h-5 w-2/3 mt-2" />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <article className="md:col-span-6 border border-border bg-card p-6 md:p-8">
          <div className="flex items-center justify-between mb-10">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-3 w-32 mt-3" />
        </article>

        <article className="md:col-span-3 border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-10">
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-10 w-24 mb-3" />
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-3 w-16" />
        </article>

        <article className="md:col-span-3 border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-10">
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-2 w-full mt-4" />
        </article>

        <article className="md:col-span-6 border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-10 w-3/4 mb-3" />
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-2 w-full mt-4" />
        </article>

        <article className="md:col-span-3 border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-8">
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2 w-full mt-4" />
        </article>

        <article className="md:col-span-3 border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-8">
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-6 w-24" />
        </article>

        <article className="md:col-span-12 border border-border bg-card p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {["alpha", "bravo", "charlie", "delta"].map((label) => (
              <div
                className="border border-border p-4"
                key={`stock-skeleton-${label}`}
              >
                <Skeleton className="h-3 w-16 mb-4" />
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16 mt-3" />
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
