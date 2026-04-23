"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const NICK_KEY = "ai-rank-last-nickname";

type ReviewFormProps = {
  onSubmit: (payload: {
    nickname: string;
    rating: number;
    body: string;
  }) => void | Promise<void>;
  /** 패널·모달 등에서 폼을 접을 때 */
  onClose?: () => void;
  className?: string;
  heading?: string;
  submitLabel?: string;
  defaultNickname?: string;
  defaultRating?: number;
  defaultBody?: string;
};

export function ReviewForm({
  onSubmit,
  onClose,
  className,
  heading = "평점 남기기",
  submitLabel = "등록하기",
  defaultNickname,
  defaultRating,
  defaultBody,
}: ReviewFormProps) {
  const [nickname, setNickname] = useState(() => defaultNickname ?? "");
  const [rating, setRating] = useState(() => defaultRating ?? 5);
  const [body, setBody] = useState(() => defaultBody ?? "");

  useEffect(() => {
    if (defaultNickname != null && defaultNickname !== "") {
      setNickname(defaultNickname);
      return;
    }
    try {
      const saved = localStorage.getItem(NICK_KEY);
      if (saved) setNickname(saved);
    } catch {
      /* ignore */
    }
  }, [defaultNickname]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nick = nickname.trim();
    const text = body.trim();
    if (!nick || !text) return;
    try {
      localStorage.setItem(NICK_KEY, nick);
    } catch {
      /* ignore */
    }
    try {
      await Promise.resolve(
        onSubmit({ nickname: nick, rating, body: text }),
      );
      setBody("");
    } catch {
      /* Supabase 오류 시 본문 유지 */
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "space-y-5 rounded-2xl border-0 bg-card px-6 py-6 shadow-lg shadow-black/30 backdrop-blur-md sm:px-8 sm:py-7",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold text-foreground">{heading}</h3>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="-m-1 shrink-0 rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/[0.08] hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40"
            aria-label="닫기"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        ) : null}
      </div>
      <div>
        <label htmlFor="nickname" className="sr-only">
          닉네임
        </label>
        <input
          id="nickname"
          type="text"
          autoComplete="nickname"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full rounded-xl border-0 bg-white/[0.06] px-3 py-2 text-base text-foreground placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/35 sm:text-sm"
        />
      </div>
      <div>
        <span className="mb-2 block text-xs font-medium text-muted">별점</span>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                rating === n
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200",
              )}
            >
              {n}점
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="body" className="sr-only">
          한줄평
        </label>
        <textarea
          id="body"
          rows={2}
          placeholder="평가를 남겨보세요"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full resize-none rounded-xl border-0 bg-white/[0.06] px-3 py-2 text-base text-foreground placeholder:text-zinc-500 sm:text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/35"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 active:scale-[0.99]"
      >
        {submitLabel}
      </button>
    </form>
  );
}
