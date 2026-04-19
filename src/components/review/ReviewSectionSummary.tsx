import { cn } from "@/lib/utils";
import { PartialStarsRow } from "@/components/review/PartialStars";

type ReviewSectionSummaryProps = {
  avgRating: number;
  reviewCount: number;
  className?: string;
};

const RATING_LINE =
  "text-xl font-bold tabular-nums leading-none text-foreground sm:text-2xl";

export function ReviewSectionSummary({
  avgRating,
  reviewCount,
  className,
}: ReviewSectionSummaryProps) {
  return (
    <div className={cn(className)}>
      <h2 className="sr-only">한줄 리뷰</h2>
      <div
        className={cn(
          "flex min-w-0 flex-nowrap items-center gap-2 overflow-x-auto sm:gap-3",
          RATING_LINE,
        )}
      >
        <span className="shrink-0">평점</span>
        <PartialStarsRow value={avgRating} />
        <span className="shrink-0 text-zinc-300">{avgRating.toFixed(1)}</span>
        <span className="shrink-0 whitespace-nowrap text-xs font-normal tabular-nums leading-none text-muted sm:text-sm">
          {reviewCount.toLocaleString()}명 참여
        </span>
      </div>
    </div>
  );
}
