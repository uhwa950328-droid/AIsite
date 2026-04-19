import { Suspense } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CategoryChips } from "@/components/home/CategoryChips";
import { HomeLeaderboardRealtime } from "@/components/ranking/HomeLeaderboardRealtime";
import { RankingCard } from "@/components/ranking/RankingCard";
import {
  getCategoryLabel,
  parseCategoryParam,
  toolMatchesCategorySlug,
} from "@/lib/categories";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { fetchAllTools } from "@/lib/queries/tools";
import { toolMatchesSearch } from "@/lib/search/matchTool";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: { q?: string; category?: string };
};

export default async function HomePage({ searchParams }: PageProps) {
  const qRaw = typeof searchParams.q === "string" ? searchParams.q : "";
  const hasQuery = qRaw.trim().length > 0;
  const categorySlug = parseCategoryParam(
    typeof searchParams.category === "string"
      ? searchParams.category
      : undefined,
  );
  const hasCategory = categorySlug !== null;

  const all = await fetchAllTools();

  let list = hasQuery
    ? all.filter((tool) => toolMatchesSearch(tool, qRaw))
    : all;

  if (categorySlug) {
    list = list.filter((tool) => toolMatchesCategorySlug(tool, categorySlug));
  }

  const supabaseEnabled = isSupabaseConfigured();
  const reRank = hasQuery || hasCategory;

  let title: string;
  if (hasQuery) {
    title = "검색 결과";
  } else if (hasCategory) {
    title = `${getCategoryLabel(categorySlug)} 카테고리`;
  } else {
    title = "AI TOOL RANKING";
  }

  let description: string;
  if (hasQuery && hasCategory) {
    description = `“${qRaw.trim()}” 검색 결과 중 ${getCategoryLabel(categorySlug)} 카테고리입니다.`;
  } else if (hasQuery) {
    description = `이름·한줄·설명·카테고리에서 “${qRaw.trim()}”와 맞는 툴입니다.`;
  } else if (hasCategory) {
    description = `${getCategoryLabel(categorySlug)} 카테고리 툴을 평점·리뷰 순으로 모두 보여 줍니다.`;
  } else {
    description =
      "등록된 AI 툴 전체를 평점 순으로 보여 줍니다. 카드를 눌러 평점을 확인하세요.";
  }

  return (
    <PageContainer>
      <HomeLeaderboardRealtime supabaseEnabled={supabaseEnabled} />
      <div className="flex flex-col gap-[var(--page-section-gap)]">
        <div className="w-full text-center">
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wide text-violet-400/90">
              2026년 상반기 기준
            </p>
            <h1 className={cnTitle(hasQuery || hasCategory)}>{title}</h1>
          </div>
          <div className="mt-3 space-y-6">
            <p className="text-sm leading-relaxed text-muted">{description}</p>
            <Suspense fallback={<div className="h-10" aria-hidden />}>
              <CategoryChips active={categorySlug} />
            </Suspense>
          </div>
        </div>

        {list.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-4 py-12 text-center text-sm text-muted">
            {hasQuery && !hasCategory
              ? "검색과 맞는 툴이 없습니다. 다른 키워드를 입력해 보세요."
              : "조건에 맞는 툴이 없습니다. 다른 카테고리나 검색어를 사용해 보세요."}
          </p>
        ) : (
          <ul className="flex w-full flex-col gap-[var(--page-stack-gap)]">
            {list.map((tool, i) => (
              <li key={tool.id}>
                <RankingCard
                  tool={reRank ? { ...tool, rank: i + 1 } : tool}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageContainer>
  );
}

function cnTitle(compact: boolean) {
  return compact
    ? "text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
    : "whitespace-pre-line text-3xl font-bold tracking-tight text-foreground sm:text-4xl";
}
