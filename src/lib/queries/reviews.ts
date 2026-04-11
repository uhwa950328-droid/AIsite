import { unstable_noStore as noStore } from "next/cache";
import { getReviewsByToolId } from "@/data/reviews";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { mapReviewRow, type ReviewRow } from "@/lib/supabase/mappers";
import type { Review } from "@/types/review";

export async function fetchReviewsForTool(toolId: string): Promise<Review[]> {
  noStore();
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[fetchReviewsForTool] Supabase 서버 URL/키 없음 — 목업 데이터만 사용합니다. .env.local 의 NEXT_PUBLIC_SUPABASE_* 또는 SUPABASE_* 를 확인하세요.",
      );
    }
    return getReviewsByToolId(toolId);
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("tool_id", toolId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[fetchReviewsForTool]", toolId, error.message, error);
    return [];
  }

  if (!data) return [];
  return (data as ReviewRow[]).map(mapReviewRow);
}
