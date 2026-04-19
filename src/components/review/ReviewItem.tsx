import type { Review } from "@/types/review";
import { Card } from "@/components/ui/Card";
import { PartialStarsRow } from "@/components/review/PartialStars";
import { ReviewReactionBar } from "@/components/review/ReviewReactionBar";
import { cn } from "@/lib/utils";

type ReviewItemProps = {
  review: Review;
  className?: string;
};

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const y = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const h = d.getHours();
    const min = d.getMinutes();
    const isPM = h >= 12;
    let hour12 = h % 12;
    if (hour12 === 0) hour12 = 12;
    const period = isPM ? "오후" : "오전";
    const mm = min.toString().padStart(2, "0");
    return `${y}. ${month}. ${day}. ${period} ${hour12}:${mm}`;
  } catch {
    return iso;
  }
}

export function ReviewItem({ review, className }: ReviewItemProps) {
  return (
    <article className={cn(className)}>
      <Card className="border-0 bg-card px-6 py-4 shadow-lg shadow-black/30 transition-colors duration-200 sm:px-8 sm:py-5">
        <div className="flex min-w-0 flex-nowrap items-center gap-6 overflow-x-auto sm:gap-8">
          <div className="flex shrink-0 flex-col items-center gap-1 text-sm font-bold tabular-nums leading-none sm:flex-row sm:items-center sm:gap-2 sm:text-base">
            <PartialStarsRow
              value={review.rating}
              ariaLabel={`${review.rating}점 만점 5점`}
            />
            <span className="text-zinc-300">{review.rating.toFixed(1)}</span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 whitespace-pre-line text-sm font-medium leading-snug text-white sm:line-clamp-3">
              {review.body}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-zinc-500">
              <span>{review.nickname}</span>
              <span
                className="select-none text-[10px] font-light leading-none text-zinc-600"
                aria-hidden
              >
                |
              </span>
              <time dateTime={review.createdAt}>{formatDate(review.createdAt)}</time>
            </div>
          </div>

          <ReviewReactionBar />
        </div>
      </Card>
    </article>
  );
}
