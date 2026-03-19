import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <section className="page-transition flex flex-col items-center justify-center text-center py-24 gap-6">
      <p className="font-mono text-xs uppercase tracking-widest text-foreground/40">
        404
      </p>
      <h1 className="font-serif text-6xl md:text-8xl tracking-tight">
        Lost in space.
      </h1>
      <p className="text-lg text-foreground/60 max-w-md">
        The page you're looking for doesn't exist, or it may have been moved.
      </p>
      <Link
        to="/"
        className="mt-4 font-mono text-xs uppercase tracking-widest text-foreground/50 hover:text-foreground transition-colors border border-border px-6 py-3 hover:border-foreground/30"
      >
        Back to home
      </Link>
    </section>
  );
}
