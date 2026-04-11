import Link from "next/link";
import type { Tool } from "@/types/tool";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type RankingCardProps = {
  tool: Tool;
  className?: string;
};

function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <div className="flex items-center gap-0.5" aria-label={`평균 ${value}점`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={cn(
            "text-sm",
            i < full ? "text-amber-400" : "text-zinc-600",
          )}
        >
          ★
        </span>
      ))}
      <span className="ml-1.5 text-xs tabular-nums text-muted">{value.toFixed(1)}</span>
    </div>
  );
}

export function RankingCard({ tool, className }: RankingCardProps) {
  return (
    <Link href={`/tool/${tool.id}`} className={cn("group block", className)}>
      <Card className="p-5 transition hover:border-zinc-600 hover:bg-zinc-900/90">
        <div className="flex items-start gap-4">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/20 text-sm font-bold text-violet-200 ring-1 ring-white/10"
            aria-hidden
          >
            {tool.rank}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-white">
                {tool.name}
              </h2>
              <span className="rounded-full bg-zinc-800/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
                {tool.category}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">{tool.tagline}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
              <Stars value={tool.avgRating} />
              <span>리뷰 {tool.reviewCount.toLocaleString()}개</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
