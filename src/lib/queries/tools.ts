import { unstable_noStore as noStore } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getAllTools, getTopTools, getToolById } from "@/data/tools";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { mapToolRow, type ToolRow } from "@/lib/supabase/mappers";
import type { Tool } from "@/types/tool";

const SNIPPETS_PER_TOOL = 8;

async function fetchReviewSnippetsByToolIds(
  supabase: SupabaseClient,
  toolIds: string[],
): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  if (toolIds.length === 0) return map;

  const { data, error } = await supabase
    .from("reviews")
    .select("tool_id, body, created_at")
    .in("tool_id", toolIds)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[fetchReviewSnippetsByToolIds]", error.message);
    return map;
  }

  for (const row of data ?? []) {
    const tid = row.tool_id as string;
    const body = String(row.body ?? "").trim();
    if (!body) continue;
    const arr = map.get(tid) ?? [];
    if (arr.length >= SNIPPETS_PER_TOOL) continue;
    arr.push(body);
    map.set(tid, arr);
  }
  return map;
}

export async function fetchTopTools(limit = 5): Promise<Tool[]> {
  noStore();
  const supabase = getSupabaseServerClient();
  if (!supabase) return getTopTools(limit);

  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .order("avg_rating", { ascending: false })
    .order("review_count", { ascending: false })
    .order("id", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("[fetchTopTools]", error.message, error);
    return getTopTools(limit);
  }

  if (!data?.length) return getTopTools(limit);
  const tools = (data as ToolRow[]).map((row, i) => {
    const tool = mapToolRow(row);
    return { ...tool, rank: i + 1 };
  });
  const snippetMap = await fetchReviewSnippetsByToolIds(
    supabase,
    tools.map((t) => t.id),
  );
  return tools.map((t) => ({
    ...t,
    reviewSnippets: snippetMap.get(t.id) ?? [],
  }));
}

export async function fetchAllTools(): Promise<Tool[]> {
  noStore();
  const supabase = getSupabaseServerClient();
  if (!supabase) return getAllTools();

  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .order("avg_rating", { ascending: false })
    .order("review_count", { ascending: false })
    .order("id", { ascending: true });

  if (error) {
    console.error("[fetchAllTools]", error.message, error);
    return getAllTools();
  }

  if (!data?.length) return getAllTools();
  const tools = (data as ToolRow[]).map((row, i) => {
    const tool = mapToolRow(row);
    return { ...tool, rank: i + 1 };
  });
  const snippetMap = await fetchReviewSnippetsByToolIds(
    supabase,
    tools.map((t) => t.id),
  );
  return tools.map((t) => ({
    ...t,
    reviewSnippets: snippetMap.get(t.id) ?? [],
  }));
}

export async function fetchToolById(id: string): Promise<Tool | undefined> {
  noStore();
  const supabase = getSupabaseServerClient();
  if (!supabase) return getToolById(id);

  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[fetchToolById]", id, error.message, error);
    return getToolById(id);
  }

  if (!data) return getToolById(id);
  const tool = mapToolRow(data as ToolRow);
  const snippetMap = await fetchReviewSnippetsByToolIds(supabase, [id]);

  // fetchAllTools와 동일 정렬로 순위 부여 (DB `rank` 컬럼과 불일치할 수 있음)
  const { data: orderRows, error: orderError } = await supabase
    .from("tools")
    .select("id")
    .order("avg_rating", { ascending: false })
    .order("review_count", { ascending: false })
    .order("id", { ascending: true });

  let rank = tool.rank;
  if (!orderError && orderRows?.length) {
    const idx = orderRows.findIndex((r) => r.id === id);
    if (idx >= 0) rank = idx + 1;
  }

  return { ...tool, rank, reviewSnippets: snippetMap.get(id) ?? [] };
}
