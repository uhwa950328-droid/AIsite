import type { Review } from "@/types/review";
import { Card } from "@/components/ui/Card";
import { normalizeReviewRating } from "@/lib/supabase/mappers";
import { PartialStarsRow } from "@/components/review/PartialStars";
import { ReviewReactionBar } from "@/components/review/ReviewReactionBar";
import { cn } from "@/lib/utils";

type ReviewItemProps = {
  review: Review;
  className?: string;
  /** 이 기기에 저장된 수정 토큰이 있으면 좋아요 대신 수정·삭제 표시 */
  isMine?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (review: Review) => void;
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

export function ReviewItem({
  review,
  className,
  isMine = false,
  onEdit,
  onDelete,
}: ReviewItemProps) {
  const rating = normalizeReviewRating(review.rating);

  return (
    <article className={cn(className)}>
      <Card className="border-0 bg-card px-6 py-4 shadow-lg shadow-black/30 transition-colors duration-200 sm:px-8 sm:py-5">
        <div className="flex min-w-0 flex-col items-stretch gap-4 overflow-x-visible sm:flex-row sm:flex-nowrap sm:items-center sm:gap-8 sm:overflow-x-auto">
          <div className="flex shrink-0 flex-row flex-nowrap items-center gap-2 text-sm font-bold tabular-nums leading-none sm:text-base">
            <PartialStarsRow
              value={rating}
              ariaLabel={`${rating}점 만점 5점`}
            />
            <span className="text-zinc-300">{rating.toFixed(1)}</span>
          </div>

          <div className="min-w-0 w-full sm:flex-1">
            <p className="whitespace-pre-line text-sm font-medium leading-snug text-white">
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

          <div className="self-start sm:self-auto">
            {isMine && onEdit && onDelete ? (
              <div
                className="flex shrink-0 flex-row items-center gap-2 sm:gap-3"
                role="group"
                aria-label="내 리뷰 관리"
              >
                <button
                  type="button"
                  onClick={() => onEdit(review)}
                  className="rounded-md px-2 py-1 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 sm:text-sm"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(review)}
                  className="rounded-md px-2 py-1 text-xs font-medium text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 sm:text-sm"
                >
                  삭제
                </button>
              </div>
            ) : (
              <ReviewReactionBar />
            )}
          </div>
        </div>
      </Card>
    </article>
  );
}
