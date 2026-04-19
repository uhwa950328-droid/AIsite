import { PageLoadingFallback } from "@/components/layout/PageLoadingFallback";

export default function ToolLoading() {
  return (
    <PageLoadingFallback minHeightClass="min-h-[min(52vh,520px)] sm:min-h-[min(48vh,560px)]" />
  );
}
