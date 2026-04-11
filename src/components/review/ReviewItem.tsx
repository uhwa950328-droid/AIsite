import type { Review } from "@/types/review";
import { cn } from "@/lib/utils";

type ReviewItemProps = {
  review: Review;
  className?: string;
};

function Stars({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${value}점`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={cn("text-xs", i < value ? "text-amber-400" : "text-zinc-600")}
        >
          ★
        </span>
      ))}
    </span>
  );
}

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
    <article
      className={cn(
        "rounded-xl border border-border/80 bg-zinc-900/40 px-4 py-3",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-zinc-200">{review.nickname}</span>
        <Stars value={review.rating} />
        <time className="ml-auto text-xs text-muted" dateTime={review.createdAt}>
          {formatDate(review.createdAt)}
        </time>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-zinc-300">{review.body}</p>
    </article>
  );
}
