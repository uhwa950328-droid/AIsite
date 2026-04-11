import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground transition hover:text-zinc-300"
        >
          AI Rank
        </Link>
        <span className="text-xs text-muted">한줄 평가 · TOP 5</span>
      </div>
    </header>
  );
}
