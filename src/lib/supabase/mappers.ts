import type { Tool } from "@/types/tool";
import type { Review } from "@/types/review";

/** reviews 테이블 조회 시 항상 이 컬럼만 사용 (비밀 토큰은 별도 테이블). */
export const REVIEW_PUBLIC_COLUMNS =
  "id, tool_id, nickname, rating, body, created_at" as const;

export type ToolRow = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  screenshot_src?: string | null;
  category: string;
  rank: number;
  avg_rating: number | string | null;
  review_count: number | null;
};

export type ReviewRow = {
  id: string;
  tool_id: string;
  nickname: string;
  /** PostgREST/Realtime JSON에서 숫자·문자열 모두 올 수 있음 */
  rating: number | string;
  body: string;
  created_at: string;
};

/** 1–5 범위로 맞춤. 잘못된 값은 5로 폴백(표시·별 UI 크래시 방지). */
export function normalizeReviewRating(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 5;
  return Math.min(5, Math.max(1, n));
}

export function mapToolRow(row: ToolRow): Tool {
  const avg =
    typeof row.avg_rating === "string"
      ? parseFloat(row.avg_rating)
      : Number(row.avg_rating ?? 0);
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    screenshotSrc: row.screenshot_src?.trim() || undefined,
    category: row.category,
    rank: row.rank,
    avgRating: Number.isFinite(avg) ? avg : 0,
    reviewCount: row.review_count ?? 0,
  };
}

export function mapReviewRow(row: ReviewRow): Review {
  return {
    id: row.id,
    toolId: row.tool_id,
    nickname: row.nickname,
    rating: normalizeReviewRating(row.rating),
    body: row.body,
    createdAt: row.created_at,
  };
}
