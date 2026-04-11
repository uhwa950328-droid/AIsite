"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Review } from "@/types/review";
import { ReviewItem } from "@/components/review/ReviewItem";
import { ReviewForm } from "@/components/review/ReviewForm";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { mapReviewRow, type ReviewRow } from "@/lib/supabase/mappers";

type ReviewPanelProps = {
  toolId: string;
  initialReviews: Review[];
  /** 서버에서 env 존재 여부 전달 — 클라이언트에서 Realtime·INSERT 사용 */
  supabaseEnabled: boolean;
};

function sortReviews(list: Review[]): Review[] {
  return [...list].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function mergeReviewsFromServer(prev: Review[], server: Review[]): Review[] {
  const next = sortReviews(server);
  if (next.length === 0 && prev.length > 0) return prev;
  const byId = new Map<string, Review>();
  for (const r of next) byId.set(r.id, r);
  for (const r of prev) {
    if (!byId.has(r.id)) byId.set(r.id, r);
  }
  return sortReviews([...byId.values()]);
}

export function ReviewPanel({
  toolId,
  initialReviews,
  supabaseEnabled,
}: ReviewPanelProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(() =>
    sortReviews(initialReviews),
  );

  useEffect(() => {
    setReviews((prev) => mergeReviewsFromServer(prev, initialReviews));
  }, [initialReviews]);

  const supabase = supabaseEnabled ? getSupabaseBrowserClient() : null;

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel(`reviews:${toolId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "reviews",
          filter: `tool_id=eq.${toolId}`,
        },
        (payload) => {
          const row = payload.new as ReviewRow | null;
          if (!row?.id) return;
          setReviews((prev) => {
            if (prev.some((r) => r.id === row.id)) return prev;
            return sortReviews([mapReviewRow(row), ...prev]);
          });
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, toolId, router]);

  const handleSubmit = useCallback(
    async (payload: { nickname: string; rating: number; body: string }) => {
      if (supabase) {
        const { data, error } = await supabase
          .from("reviews")
          .insert({
            tool_id: toolId,
            nickname: payload.nickname,
            rating: payload.rating,
            body: payload.body,
          })
          .select()
          .single();

        if (error) {
          alert(error.message);
          throw error;
        }
        if (data) {
          const r = mapReviewRow(data as ReviewRow);
          setReviews((prev) => {
            if (prev.some((x) => x.id === r.id)) return prev;
            return sortReviews([r, ...prev]);
          });
        }
        return;
      }

      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `local-${Date.now()}`;
      setReviews((prev) =>
        sortReviews([
          {
            id,
            toolId,
            nickname: payload.nickname,
            rating: payload.rating,
            body: payload.body,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]),
      );
    },
    [supabase, toolId],
  );

  return (
    <div className="space-y-6">
      <section aria-label="리뷰 목록" className="space-y-3">
        {reviews.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
            아직 리뷰가 없습니다. 첫 한줄평을 남겨보세요.
          </p>
        ) : (
          reviews.map((r) => <ReviewItem key={r.id} review={r} />)
        )}
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 bg-gradient-to-t from-background via-background/95 to-transparent pt-10">
        <div className="pointer-events-auto mx-auto max-w-5xl px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
          <ReviewForm className="mb-4 sm:mb-6" onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
