import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { ReviewPanel } from "@/components/review/ReviewPanel";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { fetchReviewsForTool } from "@/lib/queries/reviews";
import { fetchToolById } from "@/lib/queries/tools";
import { tools } from "@/data/tools";

type PageProps = {
  params: { id: string };
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return tools.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const tool = await fetchToolById(params.id);
  if (!tool) return { title: "없는 페이지" };
  return {
    title: `${tool.name} — AI Rank`,
    description: tool.tagline,
  };
}

export default async function ToolDetailPage({ params }: PageProps) {
  const tool = await fetchToolById(params.id);
  if (!tool) notFound();

  const initialReviews = await fetchReviewsForTool(tool.id);
  const supabaseEnabled = isSupabaseConfigured();

  return (
    <PageContainer className="pb-8">
      <nav className="mb-8 text-sm text-muted">
        <Link href="/" className="transition hover:text-foreground">
          ← 랭킹으로
        </Link>
      </nav>

      <Card className="mb-10 p-6 sm:p-8">
        <div className="flex flex-wrap items-start gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/40 to-fuchsia-600/30 text-sm font-bold text-violet-100 ring-1 ring-white/10">
            {tool.rank}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              {tool.category}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {tool.name}
            </h1>
            <p className="mt-2 text-base text-violet-300/90">{tool.tagline}</p>
          </div>
        </div>
        <p className="mt-6 text-sm leading-relaxed text-zinc-400">{tool.description}</p>
        <dl className="mt-6 flex flex-wrap gap-6 border-t border-border pt-6 text-sm">
          <div>
            <dt className="text-muted">평균 평점</dt>
            <dd className="mt-0.5 font-semibold tabular-nums text-foreground">
              {tool.avgRating.toFixed(1)} / 5
            </dd>
          </div>
          <div>
            <dt className="text-muted">리뷰 수</dt>
            <dd className="mt-0.5 font-semibold tabular-nums text-foreground">
              {tool.reviewCount.toLocaleString()}
            </dd>
          </div>
        </dl>
      </Card>

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">한줄 리뷰</h2>
        <ReviewPanel
          key={tool.id}
          toolId={tool.id}
          initialReviews={initialReviews}
          supabaseEnabled={supabaseEnabled}
        />
      </section>
    </PageContainer>
  );
}
