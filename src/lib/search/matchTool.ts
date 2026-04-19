import type { Tool } from "@/types/tool";

/** name, tagline, description, category, id — 공백으로 나눈 토큰이 모두 포함되면 일치 */
export function toolMatchesSearch(tool: Tool, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [tool.id, tool.name, tool.tagline, tool.description, tool.category]
    .join("\n")
    .toLowerCase();
  const parts = q.split(/\s+/).filter(Boolean);
  return parts.every((part) => haystack.includes(part));
}
