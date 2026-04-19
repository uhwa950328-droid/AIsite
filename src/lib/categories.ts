import type { Tool } from "@/types/tool";

export const CATEGORY_ORDER = [
  "productivity",
  "image",
  "video",
  "coding",
] as const;

export type CategorySlug = (typeof CATEGORY_ORDER)[number];

export type CategoryChip = {
  slug: CategorySlug;
  label: string;
  emoji: string;
};

export const CATEGORY_CHIPS: CategoryChip[] = [
  { slug: "productivity", label: "생산성", emoji: "✍️" },
  { slug: "image", label: "이미지", emoji: "🎨" },
  { slug: "video", label: "영상", emoji: "🎬" },
  { slug: "coding", label: "코딩", emoji: "💻" },
];

/** DB `tools.category` 값과 칩 slug 매칭 (레거시 값 포함) */
const SLUG_TO_DB: Record<CategorySlug, readonly string[]> = {
  productivity: ["생산성", "대화·생산성", "생산성(엔터)"],
  image: ["이미지"],
  video: ["영상"],
  coding: ["코딩"],
};

export function toolMatchesCategorySlug(
  tool: Tool,
  slug: CategorySlug,
): boolean {
  const allowed = SLUG_TO_DB[slug];
  return allowed.some((v) => tool.category === v);
}

export function parseCategoryParam(
  param: string | undefined,
): CategorySlug | null {
  if (!param) return null;
  return CATEGORY_ORDER.includes(param as CategorySlug)
    ? (param as CategorySlug)
    : null;
}

export function getCategoryLabel(slug: CategorySlug): string {
  return CATEGORY_CHIPS.find((c) => c.slug === slug)?.label ?? slug;
}
