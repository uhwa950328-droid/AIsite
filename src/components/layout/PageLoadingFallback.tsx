import { PageContainer } from "@/components/layout/PageContainer";
import { cn } from "@/lib/utils";

type PageLoadingFallbackProps = {
  /** 툴 상세 등 레이아웃이 다른 구간용 최소 높이 */
  minHeightClass?: string;
};

export function PageLoadingFallback({
  minHeightClass = "min-h-[40vh]",
}: PageLoadingFallbackProps) {
  return (
    <PageContainer
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        minHeightClass,
      )}
    >
      <div
        className="relative h-11 w-11"
        role="status"
        aria-live="polite"
        aria-label="페이지 불러오는 중"
      >
        <span className="absolute inset-0 rounded-full border-2 border-zinc-700/80" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-violet-400 border-r-fuchsia-500/70" />
      </div>
      <p className="text-sm text-muted">불러오는 중…</p>
    </PageContainer>
  );
}
