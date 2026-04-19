"use client";

import { useCallback, useState } from "react";

function ThumbUpIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

function ThumbDownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-3" />
    </svg>
  );
}

export function ReviewReactionBar() {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const onLike = useCallback(() => {
    setLikes((n) => n + 1);
  }, []);

  const onDislike = useCallback(() => {
    setDislikes((n) => n + 1);
  }, []);

  return (
    <div
      className="flex shrink-0 flex-row items-center gap-3 text-muted sm:gap-4"
      role="group"
      aria-label="반응"
    >
      <button
        type="button"
        onClick={onLike}
        className="flex items-center gap-1 rounded-md text-xs tabular-nums transition-colors hover:bg-white/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 sm:text-sm"
        aria-label="좋아요"
      >
        <ThumbUpIcon className="h-4 w-4 shrink-0 text-foreground/80" />
        <span className="min-w-[1ch] text-foreground/90">{likes}</span>
      </button>
      <button
        type="button"
        onClick={onDislike}
        className="flex items-center gap-1 rounded-md text-xs tabular-nums transition-colors hover:bg-white/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 sm:text-sm"
        aria-label="싫어요"
      >
        <ThumbDownIcon className="h-4 w-4 shrink-0 text-foreground/80" />
        <span className="min-w-[1ch] text-foreground/90">{dislikes}</span>
      </button>
    </div>
  );
}
