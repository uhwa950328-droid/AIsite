import type { Review } from "@/types/review";

export const reviews: Review[] = [
  {
    id: "r1",
    toolId: "chatgpt",
    nickname: "dev_kim",
    rating: 5,
    body: "코드 리뷰 요청할 때마다 생산성이 확 올라감.",
    createdAt: "2026-04-01T09:00:00.000Z",
  },
  {
    id: "r2",
    toolId: "chatgpt",
    nickname: "writer_lee",
    rating: 4,
    body: "초안 잡기 좋은데 가끔 환각은 꼭 확인해야 함.",
    createdAt: "2026-04-02T14:30:00.000Z",
  },
  {
    id: "r3",
    toolId: "midjourney",
    nickname: "pixelpark",
    rating: 5,
    body: "분위기 잡는 키워드만 맞추면 퀄리티 미쳤음.",
    createdAt: "2026-04-03T11:20:00.000Z",
  },
  {
    id: "r4",
    toolId: "dall-e",
    nickname: "mockup_j",
    rating: 4,
    body: "ChatGPT랑 붙어 있어서 워크플로가 편함.",
    createdAt: "2026-04-04T08:15:00.000Z",
  },
  {
    id: "r5",
    toolId: "claude",
    nickname: "docs_fan",
    rating: 5,
    body: "긴 PDF 넣고 질문하는 용도로 최고.",
    createdAt: "2026-04-05T16:45:00.000Z",
  },
  {
    id: "r6",
    toolId: "notion-ai",
    nickname: "pm_su",
    rating: 4,
    body: "회의록 정리 속도가 체감으로 빨라짐.",
    createdAt: "2026-04-06T10:00:00.000Z",
  },
];

export function getReviewsByToolId(toolId: string): Review[] {
  return reviews
    .filter((r) => r.toolId === toolId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}
