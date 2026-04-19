import { cn } from "@/lib/utils";

/** 0–5 척도에서 i번째 별(0-based)의 채움 비율 0–1 */
export function starFill(rating: number, index: number) {
  return Math.min(1, Math.max(0, rating - index));
}

function StarSlot({ fill }: { fill: number }) {
  return (
    <span
      className="relative inline-flex h-[1em] w-[1em] shrink-0 items-center justify-center leading-none"
      aria-hidden
    >
      <span className="absolute inset-0 flex items-center justify-center text-zinc-600">
        ★
      </span>
      <span
        className="absolute left-0 top-0 flex h-full overflow-hidden text-[#B453FF]"
        style={{ width: `${fill * 100}%` }}
      >
        <span className="flex h-full w-[1em] flex-none items-center justify-center">★</span>
      </span>
    </span>
  );
}

type PartialStarsRowProps = {
  value: number;
  className?: string;
  ariaLabel?: string;
};

export function PartialStarsRow({
  value,
  className,
  ariaLabel,
}: PartialStarsRowProps) {
  return (
    <div
      className={cn("flex shrink-0 items-center gap-px leading-none", className)}
      role="img"
      aria-label={ariaLabel ?? `평균 ${value.toFixed(1)}점 만점 5점`}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <StarSlot key={i} fill={starFill(value, i)} />
      ))}
    </div>
  );
}
