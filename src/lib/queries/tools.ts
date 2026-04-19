import { unstable_noStore as noStore } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
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

function logNoSupabase(context: string) {
  console.error(
    `[${context}] Supabase 서버 클라이언트를 만들 수 없습니다. NEXT_PUBLIC_SUPABASE_URL·NEXT_PUBLIC_SUPABASE_ANON_KEY(또는 SUPABASE_URL·SUPABASE_ANON_KEY)를 설정하세요.`,
  );
}

export async function fetchTopTools(limit = 5): Promise<Tool[]> {
  noStore();
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    logNoSupabase("fetchTopTools");
    return [];
  }

  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .order("avg_rating", { ascending: false })
    .order("review_count", { ascending: false })
    .order("id", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("[fetchTopTools]", error.message, error);
    return [];
  }

  if (!data?.length) return [];
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
  if (!supabase) {
    logNoSupabase("fetchAllTools");
    return [];
  }

  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .order("avg_rating", { ascending: false })
    .order("review_count", { ascending: false })
    .order("id", { ascending: true });

  if (error) {
    console.error("[fetchAllTools]", error.message, error);
    return [];
  }

  if (!data?.length) return [];
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
  if (!supabase) {
    logNoSupabase("fetchToolById");
    return undefined;
  }

  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[fetchToolById]", id, error.message, error);
    return undefined;
  }

  if (!data) return undefined;
  const tool = mapToolRow(data as ToolRow);
  const snippetMap = await fetchReviewSnippetsByToolIds(supabase, [id]);

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
