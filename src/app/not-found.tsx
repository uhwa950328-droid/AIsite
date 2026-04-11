import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";

export default function NotFound() {
  return (
    <PageContainer className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold">페이지를 찾을 수 없습니다</h1>
      <p className="mt-2 text-sm text-muted">요청한 AI 툴이 없거나 주소가 바뀌었을 수 있어요.</p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
      >
        랭킹 홈으로
      </Link>
    </PageContainer>
  );
}
