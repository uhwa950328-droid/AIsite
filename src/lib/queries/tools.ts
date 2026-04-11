import { unstable_noStore as noStore } from "next/cache";
import { getTopTools, getToolById } from "@/data/tools";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { mapToolRow, type ToolRow } from "@/lib/supabase/mappers";
import type { Tool } from "@/types/tool";

export async function fetchTopTools(limit = 5): Promise<Tool[]> {
  noStore();
  const supabase = getSupabaseServerClient();
  if (!supabase) return getTopTools(limit);

  const { data, error } = await supabase
    .from("tools")
    .select("*")
    .order("rank", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("[fetchTopTools]", error.message, error);
    return getTopTools(limit);
  }

  if (!data?.length) return getTopTools(limit);
  return (data as ToolRow[]).map(mapToolRow);
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
  return mapToolRow(data as ToolRow);
}
