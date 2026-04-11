import { PageContainer } from "@/components/layout/PageContainer";
import { RankingCard } from "@/components/ranking/RankingCard";
import { fetchTopTools } from "@/lib/queries/tools";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const top = await fetchTopTools(5);

  return (
    <PageContainer>
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-widest text-violet-400/90">
          Leaderboard
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          AI 툴 TOP 5
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          지금 많이 쓰이는 AI 툴을 한눈에. 카드를 눌러 상세와 한줄 리뷰를 확인하세요.
        </p>
      </div>

      <ul className="flex flex-col gap-4">
        {top.map((tool) => (
          <li key={tool.id}>
            <RankingCard tool={tool} />
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}
