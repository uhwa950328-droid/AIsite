"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Review } from "@/types/review";
import { ReviewItem } from "@/components/review/ReviewItem";
import { ReviewForm } from "@/components/review/ReviewForm";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  mapReviewRow,
  REVIEW_PUBLIC_COLUMNS,
  type ReviewRow,
} from "@/lib/supabase/mappers";
import {
  forgetReviewEditToken,
  getAllReviewEditTokenIds,
  getReviewEditToken,
  rememberReviewEditToken,
} from "@/lib/review-tokens";
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

/** 접힌 상태에서 아래로 이 정도 스크롤하면 작성 폼 자동 펼침 */
const SCROLL_DOWN_TO_OPEN_ACCUM_PX = 56;

function isTypingInReviewComposer(): boolean {
  const el = document.activeElement;
  if (!el || !(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  if (tag !== "INPUT" && tag !== "TEXTAREA") return false;
  return el.closest("[data-review-composer]") !== null;
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
  const [composerExpanded, setComposerExpanded] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [myReviewIds, setMyReviewIds] = useState<Set<string>>(
    () => new Set(),
  );
  const composerExpandedRef = useRef(false);
  /** 스크롤로 자동 펼침을 이미 한 번 썼는지 (방문당 1회) */
  const scrollToOpenDoneRef = useRef(false);
  const lastScrollY = useRef(0);
  const scrollAccum = useRef(0);
  const scrollDir = useRef<"down" | null>(null);

  useEffect(() => {
    composerExpandedRef.current = composerExpanded;
  }, [composerExpanded]);

  useEffect(() => {
    setReviews((prev) => mergeReviewsFromServer(prev, initialReviews));
  }, [initialReviews]);

  useEffect(() => {
    setMyReviewIds(new Set(getAllReviewEditTokenIds()));
  }, []);

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
        if (isTypingInReviewComposer()) {
          lastScrollY.current = window.scrollY;
          scrollDir.current = null;
          scrollAccum.current = 0;
          return;
        }

        const y = window.scrollY;
        const delta = y - lastScrollY.current;
        lastScrollY.current = y;

        if (Math.abs(delta) < 0.5) return;

        if (!composerExpandedRef.current) {
          if (scrollToOpenDoneRef.current) {
            scrollDir.current = null;
            scrollAccum.current = 0;
            return;
          }
          if (delta > 0) {
            if (scrollDir.current !== "down") {
              scrollAccum.current = 0;
              scrollDir.current = "down";
            }
            scrollAccum.current += delta;
            if (scrollAccum.current >= SCROLL_DOWN_TO_OPEN_ACCUM_PX) {
              scrollToOpenDoneRef.current = true;
              composerExpandedRef.current = true;
              setEditingReview(null);
              setComposerExpanded(true);
              scrollAccum.current = 0;
              scrollDir.current = null;
              lastScrollY.current = window.scrollY;
            }
          } else {
            scrollDir.current = null;
            scrollAccum.current = 0;
          }
          return;
        }

        // 펼친 뒤에는 스크롤로 접지 않음 — 닫기·제출만 접힘
        scrollDir.current = null;
        scrollAccum.current = 0;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const closeComposer = useCallback(() => {
    lastScrollY.current = window.scrollY;
    scrollAccum.current = 0;
    scrollDir.current = null;
    composerExpandedRef.current = false;
    setComposerExpanded(false);
    setEditingReview(null);
  }, []);

  useEffect(() => {
    if (!composerExpanded) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeComposer();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [composerExpanded, closeComposer]);

  const createReview = useCallback(
    async (payload: { nickname: string; rating: number; body: string }) => {
      if (supabase) {
        if (typeof crypto === "undefined" || !crypto.randomUUID) {
          alert(
            "이 브라우저에서는 리뷰 등록을 지원하지 않습니다. 최신 브라우저로 시도해 주세요.",
          );
          throw new Error("crypto.randomUUID unavailable");
        }
        const editToken = crypto.randomUUID();
        const { data: insertedId, error } = await supabase.rpc(
          "insert_review",
          {
            p_tool_id: toolId,
            p_nickname: payload.nickname,
            p_rating: payload.rating,
            p_body: payload.body,
            p_edit_token: editToken,
          },
        );

        if (error) {
          alert(error.message);
          throw error;
        }
        if (insertedId == null || insertedId === "") {
          alert("리뷰를 저장하지 못했습니다.");
          throw new Error("insert_review returned empty");
        }

        const idStr = String(insertedId);
        const { data: row, error: rowErr } = await supabase
          .from("reviews")
          .select(REVIEW_PUBLIC_COLUMNS)
          .eq("id", idStr)
          .single();

        if (rowErr || !row) {
          alert(rowErr?.message ?? "리뷰를 불러오지 못했습니다.");
          throw rowErr ?? new Error("missing row");
        }

        const r = mapReviewRow(row as ReviewRow);
        rememberReviewEditToken(idStr, editToken);
        setMyReviewIds((prev) => new Set(prev).add(idStr));
        setReviews((prev) => {
          if (prev.some((x) => x.id === r.id)) return prev;
          return sortReviews([r, ...prev]);
        });
        router.refresh();
        closeComposer();
        return;
      }

      const editToken =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `local-${Date.now()}-${Math.random()}`;
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `local-${Date.now()}`;
      rememberReviewEditToken(id, editToken);
      setMyReviewIds((prev) => new Set(prev).add(id));
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
      closeComposer();
    },
    [supabase, toolId, router, closeComposer],
  );

  const updateReview = useCallback(
    async (
      reviewId: string,
      payload: { nickname: string; rating: number; body: string },
    ) => {
      const token = getReviewEditToken(reviewId);
      if (!token) {
        alert("이 기기에서 수정할 수 없는 평가입니다.");
        throw new Error("no edit token");
      }

      if (supabase) {
        const { data: ok, error } = await supabase.rpc(
          "update_review_by_token",
          {
            p_review_id: reviewId,
            p_edit_token: token,
            p_nickname: payload.nickname,
            p_rating: payload.rating,
            p_body: payload.body,
          },
        );

        if (error) {
          alert(error.message);
          throw error;
        }
        if (!ok) {
          alert("수정에 실패했습니다. 다시 시도해 주세요.");
          throw new Error("update_review_by_token returned false");
        }

        setReviews((prev) =>
          sortReviews(
            prev.map((r) =>
              r.id === reviewId
                ? {
                    ...r,
                    nickname: payload.nickname,
                    rating: payload.rating,
                    body: payload.body,
                  }
                : r,
            ),
          ),
        );
        router.refresh();
        closeComposer();
        return;
      }

      setReviews((prev) =>
        sortReviews(
          prev.map((r) =>
            r.id === reviewId
              ? {
                  ...r,
                  nickname: payload.nickname,
                  rating: payload.rating,
                  body: payload.body,
                }
              : r,
          ),
        ),
      );
      closeComposer();
    },
    [supabase, router, closeComposer],
  );

  const handleDeleteReview = useCallback(
    (r: Review) => {
      if (!confirm("이 평가를 삭제할까요?")) return;

      void (async () => {
        const token = getReviewEditToken(r.id);
        if (!token) {
          alert("이 기기에서 삭제할 수 없는 평가입니다.");
          return;
        }

        if (supabase) {
          const { data: ok, error } = await supabase.rpc(
            "delete_review_by_token",
            {
              p_review_id: r.id,
              p_edit_token: token,
            },
          );

          if (error) {
            alert(error.message);
            return;
          }
          if (!ok) {
            alert("삭제에 실패했습니다. 다시 시도해 주세요.");
            return;
          }
        }

        forgetReviewEditToken(r.id);
        setMyReviewIds((prev) => {
          const next = new Set(prev);
          next.delete(r.id);
          return next;
        });
        setReviews((prev) => prev.filter((x) => x.id !== r.id));
        router.refresh();
      })();
    },
    [supabase, router],
  );

  const handleStartEdit = useCallback((r: Review) => {
    lastScrollY.current = window.scrollY;
    scrollAccum.current = 0;
    scrollDir.current = null;
    composerExpandedRef.current = true;
    setEditingReview(r);
    setComposerExpanded(true);
  }, []);

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
          reviews.map((r) => (
            <ReviewItem
              key={r.id}
              review={r}
              isMine={myReviewIds.has(r.id)}
              onEdit={handleStartEdit}
              onDelete={handleDeleteReview}
            />
          ))
        )}
      </section>

      {composerExpanded ? (
        <>
          <div
            className="fixed bottom-0 left-0 right-0 z-[45] bg-zinc-950/70 backdrop-blur-sm top-[calc(-1*max(4px,env(safe-area-inset-top,0px)))] min-h-[calc(100dvh+max(4px,env(safe-area-inset-top,0px)))]"
            aria-hidden
            onClick={closeComposer}
          />
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 bg-gradient-to-t from-background via-background/95 to-transparent pt-10">
            <div
              className="pointer-events-auto mx-auto w-full max-w-4xl px-[var(--page-pad)] pb-[calc(2rem+env(safe-area-inset-bottom))] sm:pb-[calc(2.5rem+env(safe-area-inset-bottom))]"
              data-review-composer
            >
              <div className="w-full overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] will-change-[max-height,opacity,transform] max-h-[min(70vh,560px)] translate-y-0 opacity-100">
                <ReviewForm
                  key={editingReview?.id ?? "create"}
                  className="mb-4 sm:mb-6"
                  heading={editingReview ? "리뷰 수정" : "평점 남기기"}
                  submitLabel={editingReview ? "저장하기" : "등록하기"}
                  defaultNickname={editingReview?.nickname}
                  defaultRating={editingReview?.rating}
                  defaultBody={editingReview?.body}
                  onSubmit={async (payload) => {
                    if (editingReview) {
                      await updateReview(editingReview.id, payload);
                    } else {
                      await createReview(payload);
                    }
                  }}
                  onClose={closeComposer}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 bg-gradient-to-t from-background via-background/95 to-transparent pt-10">
          <div className="pointer-events-auto mx-auto flex w-full max-w-4xl justify-center px-[var(--page-pad)] pb-[calc(2rem+env(safe-area-inset-bottom))] sm:pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
            <button
              type="button"
              className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-950/40 ring-1 ring-white/15 transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99]"
              aria-label="평점 남기기"
              onClick={() => {
                lastScrollY.current = window.scrollY;
                scrollAccum.current = 0;
                scrollDir.current = null;
                setEditingReview(null);
                composerExpandedRef.current = true;
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
