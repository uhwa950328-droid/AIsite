"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CATEGORY_CHIPS,
  type CategorySlug,
} from "@/lib/categories";
import { cn } from "@/lib/utils";

type CategoryChipsProps = {
  active: CategorySlug | null;
};

function buildHref(q: string | null, slug: CategorySlug | null) {
  const params = new URLSearchParams();
  if (q?.trim()) params.set("q", q.trim());
  if (slug) params.set("category", slug);
  const s = params.toString();
  return s ? `/?${s}` : "/";
}

export function CategoryChips({ active }: CategoryChipsProps) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  return (
    <div
      className="mt-6 flex flex-wrap items-center justify-center gap-2"
      role="navigation"
      aria-label="카테고리 필터"
    >
      <Link
        href={buildHref(q, null)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-colors",
          active === null
            ? "bg-violet-500 text-white"
            : "bg-zinc-100 text-zinc-950 hover:bg-zinc-200",
        )}
        aria-current={active === null ? "page" : undefined}
      >
        전체
      </Link>
      {CATEGORY_CHIPS.map((c) => {
        const isActive = active === c.slug;
        return (
          <Link
            key={c.slug}
            href={buildHref(q, c.slug)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-colors",
              isActive
                ? "bg-violet-500 text-white"
                : "bg-zinc-100 text-zinc-950 hover:bg-zinc-200",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <span aria-hidden>{c.emoji}</span>
            {c.label}
          </Link>
        );
      })}
    </div>
  );
}
