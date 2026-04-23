import Image from "next/image";
import Link from "next/link";
import type { Tool } from "@/types/tool";
import { Card } from "@/components/ui/Card";
import { isRemoteImageSrc } from "@/lib/image";
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
            i < full
              ? "text-[#B453FF]"
              : "text-zinc-600 transition-colors duration-200 group-hover:text-zinc-500",
          )}
        >
          ★
        </span>
      ))}
      <span className="ml-1.5 text-xs tabular-nums text-zinc-300 transition-colors duration-200 group-hover:text-zinc-200">
        {value.toFixed(1)}
      </span>
    </div>
  );
}

export function RankingCard({ tool, className }: RankingCardProps) {
  const hasReviews = tool.reviewCount > 0;
  const snippets = tool.reviewSnippets ?? [];
  const shot = tool.screenshotSrc?.trim();

  return (
    <Link
      href={`/tool/${tool.id}`}
      className={cn(
        "group block w-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <Card className="border border-border bg-card p-5 shadow-lg shadow-black/30 transition-all duration-200 ease-out group-hover:-translate-y-1 group-hover:border-violet-500/40 group-hover:bg-card-hover group-hover:shadow-xl group-hover:shadow-black/50 group-hover:shadow-[0_0_32px_-8px_rgba(139,92,246,0.2)] group-hover:ring-2 group-hover:ring-violet-500/40">
        <div className="flex items-start gap-4">
          {shot ? (
            <div className="relative h-[4.5rem] w-[7.25rem] shrink-0 overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/10 transition-transform duration-200 ease-out group-hover:scale-[1.02] group-hover:ring-white/15">
              <Image
                src={shot}
                alt={`${tool.name} 화면 미리보기`}
                fill
                className="object-cover object-top"
                sizes="116px"
                unoptimized={isRemoteImageSrc(shot)}
              />
            </div>
          ) : null}
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/20 text-sm font-bold text-violet-200 ring-1 ring-white/10 transition-transform duration-200 ease-out group-hover:scale-105 group-hover:from-violet-600/40 group-hover:to-fuchsia-600/30"
            aria-label={hasReviews ? `순위 ${tool.rank}위` : "순위 없음"}
          >
            {hasReviews ? tool.rank : "–"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground group-hover:text-white">
                {tool.name}
              </h2>
              <span className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-300 transition-colors duration-200 group-hover:border-white/15 group-hover:bg-white/12">
                {tool.category}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted transition-colors duration-200 group-hover:text-zinc-400">
              {tool.tagline}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500 transition-colors duration-200 group-hover:text-zinc-400">
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
