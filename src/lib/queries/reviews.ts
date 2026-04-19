import { unstable_noStore as noStore } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { mapReviewRow, type ReviewRow } from "@/lib/supabase/mappers";
import type { Review } from "@/types/review";

export async function fetchReviewsForTool(toolId: string): Promise<Review[]> {
  noStore();
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    console.error(
      "[fetchReviewsForTool] Supabase 서버 클라이언트를 만들 수 없습니다. NEXT_PUBLIC_SUPABASE_URL·NEXT_PUBLIC_SUPABASE_ANON_KEY(또는 SUPABASE_URL·SUPABASE_ANON_KEY)를 설정하세요.",
    );
    return [];
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
