import type { Tool } from "@/types/tool";
import type { Review } from "@/types/review";

export type ToolRow = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  rank: number;
  avg_rating: number | string | null;
  review_count: number | null;
};

export type ReviewRow = {
  id: string;
  tool_id: string;
  nickname: string;
  rating: number;
  body: string;
  created_at: string;
};

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
    rating: row.rating,
    body: row.body,
    createdAt: row.created_at,
  };
}
