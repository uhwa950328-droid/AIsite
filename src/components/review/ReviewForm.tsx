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
  className?: string;
};

export function ReviewForm({ onSubmit, className }: ReviewFormProps) {
  const [nickname, setNickname] = useState("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(NICK_KEY);
      if (saved) setNickname(saved);
    } catch {
      /* ignore */
    }
  }, []);

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
        "space-y-4 rounded-2xl border border-border bg-card/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-md",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">한줄 리뷰 남기기</h3>
        <span className="text-xs text-muted">닉네임 · 별점 · 한줄평</span>
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
          className="w-full rounded-lg border border-border bg-zinc-950/80 px-3 py-2 text-sm text-foreground placeholder:text-zinc-500 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
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
          placeholder="한줄로 평가를 남겨보세요."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full resize-none rounded-lg border border-border bg-zinc-950/80 px-3 py-2 text-sm text-foreground placeholder:text-zinc-500 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 active:scale-[0.99]"
      >
        등록하기
      </button>
    </form>
  );
}
