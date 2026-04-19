"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Review } from "@/types/review";
import { ReviewItem } from "@/components/review/ReviewItem";
import { ReviewForm } from "@/components/review/ReviewForm";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { mapReviewRow, type ReviewRow } from "@/lib/supabase/mappers";
import { cn } from "@/lib/utils";

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
  return sortReviews(Array.from(byId.values()));
}

const SCROLL_DOWN_ACCUM_PX = 48;

export function ReviewPanel({
  toolId,
  initialReviews,
  supabaseEnabled,
}: ReviewPanelProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(() =>
    sortReviews(initialReviews),
  );
  const [composerExpanded, setComposerExpanded] = useState(true);
  const composerExpandedRef = useRef(true);
  const lastScrollY = useRef(0);
  const scrollAccum = useRef(0);
  const scrollDir = useRef<"down" | null>(null);

  useEffect(() => {
    composerExpandedRef.current = composerExpanded;
  }, [composerExpanded]);

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

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!composerExpandedRef.current) {
          scrollDir.current = null;
          scrollAccum.current = 0;
          return;
        }

        const y = window.scrollY;
        const delta = y - lastScrollY.current;
        lastScrollY.current = y;

        if (Math.abs(delta) < 0.5) return;

        if (delta > 0) {
          if (scrollDir.current !== "down") {
            scrollAccum.current = 0;
            scrollDir.current = "down";
          }
          scrollAccum.current += delta;
          if (scrollAccum.current >= SCROLL_DOWN_ACCUM_PX) {
            setComposerExpanded(false);
            scrollAccum.current = 0;
            scrollDir.current = null;
          }
        } else {
          scrollDir.current = null;
          scrollAccum.current = 0;
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

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
        setComposerExpanded(false);
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
      setComposerExpanded(false);
    },
    [supabase, toolId],
  );

  const bottomPad = composerExpanded
    ? "pb-[calc(13rem+env(safe-area-inset-bottom))] sm:pb-[calc(14rem+env(safe-area-inset-bottom))]"
    : "pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:pb-[calc(7rem+env(safe-area-inset-bottom))]";

  return (
    <div className={cn("space-y-6", bottomPad)}>
      <section aria-label="리뷰 목록" className="space-y-4">
        {reviews.length === 0 ? (
          <p className="rounded-2xl border-0 bg-card py-10 text-center text-sm leading-relaxed text-muted shadow-lg shadow-black/30">
            아직 평가가 없습니다. 첫 평가를 남겨보세요.
          </p>
        ) : (
          reviews.map((r) => <ReviewItem key={r.id} review={r} />)
        )}
      </section>

      {composerExpanded ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 bg-gradient-to-t from-background via-background/95 to-transparent pt-10">
          <div className="pointer-events-auto mx-auto w-full max-w-4xl px-[var(--page-pad)] pb-[calc(2rem+env(safe-area-inset-bottom))] sm:pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
            <div className="w-full overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] will-change-[max-height,opacity,transform] max-h-[min(70vh,560px)] translate-y-0 opacity-100">
              <ReviewForm
                className="mb-4 sm:mb-6"
                onSubmit={handleSubmit}
                onClose={() => {
                  lastScrollY.current = window.scrollY;
                  scrollAccum.current = 0;
                  scrollDir.current = null;
                  setComposerExpanded(false);
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 bg-gradient-to-t from-background via-background/95 to-transparent pt-10">
          <div className="pointer-events-auto mx-auto flex w-full max-w-4xl justify-center px-[var(--page-pad)] pb-[calc(2rem+env(safe-area-inset-bottom))] sm:pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
            <button
              type="button"
              className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 ring-1 ring-white/15 transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99]"
              aria-label="평점 남기기"
              onClick={() => {
                lastScrollY.current = window.scrollY;
                scrollAccum.current = 0;
                scrollDir.current = null;
                setComposerExpanded(true);
              }}
            >
              + 평점 남기기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
