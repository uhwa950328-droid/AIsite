import Image from "next/image";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { HomeLeaderboardRealtime } from "@/components/ranking/HomeLeaderboardRealtime";
import { ReviewPanel } from "@/components/review/ReviewPanel";
import { ReviewSectionSummary } from "@/components/review/ReviewSectionSummary";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { fetchReviewsForTool } from "@/lib/queries/reviews";
import { fetchToolById } from "@/lib/queries/tools";
import type { Tool } from "@/types/tool";

type PageProps = {
  params: { id: string };
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const tool = await fetchToolById(params.id);
  if (!tool) return { title: "없는 페이지" };
  return {
    title: `${tool.name} — AI Review`,
    description: tool.tagline,
  };
}

function isRemoteImageSrc(src: string) {
  return /^https?:\/\//i.test(src);
}

function ToolDetailHero({
  tool,
  hasReviews,
}: {
  tool: Tool;
  hasReviews: boolean;
}) {
  const rankLabel = hasReviews ? `TOP${tool.rank}` : "순위 집계 전";

  return (
    <section className="relative w-full overflow-hidden" aria-labelledby="tool-detail-title">
      <div className="relative isolate flex min-h-[min(52vh,520px)] w-full flex-col justify-end overflow-hidden bg-zinc-950 sm:min-h-[min(48vh,560px)]">
        {tool.screenshotSrc ? (
          <div className="pointer-events-none absolute inset-0 z-0">
            <Image
              src={tool.screenshotSrc}
              alt={`${tool.name} 서비스 화면`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
              unoptimized={isRemoteImageSrc(tool.screenshotSrc)}
            />
          </div>
        ) : (
          <div
            className="absolute inset-0 z-0 bg-gradient-to-br from-zinc-900 via-violet-950/40 to-zinc-950"
            aria-hidden
          />
        )}

        <div
          className="absolute inset-0 z-[1] bg-gradient-to-t from-background via-background/75 to-background/20 sm:from-background/95 sm:via-background/55 sm:to-transparent"
          aria-hidden
        />
        {/* 왼쪽 가장자리·텍스트 영역과 맞물리도록 배경색 기준 가로 페이드 */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-background from-0% via-background/40 via-[38%] to-transparent to-[76%] sm:via-background/30 sm:via-[42%] sm:to-[82%]"
          aria-hidden
        />

        <div className="relative z-[2] pb-8 pt-24 sm:pb-10 sm:pt-32">
          <div className="w-full text-left text-white">
            <p className="text-2xl font-bold tracking-tight sm:text-3xl">
              {rankLabel}
            </p>
            <h1
              id="tool-detail-title"
              className="mt-1 text-4xl font-bold tracking-tight sm:text-5xl sm:tracking-tighter"
            >
              {tool.name}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-lg border border-white/10 bg-white/12 px-3 py-1.5 text-sm font-medium text-white/95 backdrop-blur-sm">
                {tool.category}
              </span>
              <span className="rounded-lg border border-white/10 bg-white/12 px-3 py-1.5 text-sm font-medium text-white/95 backdrop-blur-sm">
                {tool.tagline}
              </span>
            </div>

            <p className="mt-5 max-w-[50%] text-sm leading-relaxed text-white/85 sm:text-base">
              {tool.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function ToolDetailPage({ params }: PageProps) {
  const tool = await fetchToolById(params.id);
  if (!tool) notFound();

  const initialReviews = await fetchReviewsForTool(tool.id);
  const supabaseEnabled = isSupabaseConfigured();
  const hasReviews = tool.reviewCount > 0;

  return (
    <PageContainer>
      <HomeLeaderboardRealtime supabaseEnabled={supabaseEnabled} />

      <div className="flex flex-col gap-[var(--page-section-gap)]">
        <ToolDetailHero tool={tool} hasReviews={hasReviews} />

        <section className="flex w-full flex-col gap-[var(--page-section-gap)]">
          <ReviewSectionSummary
            avgRating={tool.avgRating}
            reviewCount={tool.reviewCount}
          />
          <ReviewPanel
            key={tool.id}
            toolId={tool.id}
            initialReviews={initialReviews}
            supabaseEnabled={supabaseEnabled}
          />
        </section>
      </div>
    </PageContainer>
  );
}
