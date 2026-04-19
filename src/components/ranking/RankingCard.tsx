import Link from "next/link";
import type { Tool } from "@/types/tool";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { ReviewSnippetRotator } from "@/components/ranking/ReviewSnippetRotator";

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
            i < full ? "text-[#B453FF]" : "text-zinc-600",
          )}
        >
          ★
        </span>
      ))}
      <span className="ml-1.5 text-xs tabular-nums text-zinc-300">
        {value.toFixed(1)}
      </span>
    </div>
  );
}

export function RankingCard({ tool, className }: RankingCardProps) {
  const hasReviews = tool.reviewCount > 0;
  const snippets = tool.reviewSnippets ?? [];

  return (
    <Link
      href={`/tool/${tool.id}`}
      className={cn(
        "group block w-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <Card className="border-0 bg-card p-5 shadow-lg shadow-black/30 transition-all duration-200 ease-out group-hover:-translate-y-0.5 group-hover:bg-card/95 group-hover:shadow-xl group-hover:shadow-black/50 group-hover:ring-1 group-hover:ring-violet-500/25">
        <div className="flex items-start gap-4">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/20 text-sm font-bold text-violet-200 ring-1 ring-white/10 transition-transform duration-200 ease-out group-hover:scale-105 group-hover:from-violet-600/40 group-hover:to-fuchsia-600/30"
            aria-label={hasReviews ? `순위 ${tool.rank}위` : "순위 없음"}
          >
            {hasReviews ? tool.rank : "–"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground group-hover:text-white">
                {tool.name}
              </h2>
              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
                {tool.category}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted transition-colors duration-200 group-hover:text-zinc-400">
              {tool.tagline}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
              <Stars value={tool.avgRating} />
              <span>리뷰 {tool.reviewCount.toLocaleString()}개</span>
            </div>
            {snippets.length > 0 ? (
              <ReviewSnippetRotator snippets={snippets} />
            ) : null}
          </div>
        </div>
      </Card>
    </Link>
  );
}
