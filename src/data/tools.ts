import type { Tool } from "@/types/tool";

export const tools: Tool[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    tagline: "대화형 AI의 기준",
    description:
      "OpenAI의 GPT 기반 챗봇으로, 코딩·글쓰기·요약·번역 등 다양한 작업을 자연어로 처리할 수 있습니다. 플러그인과 맞춤 GPT로 워크플로를 확장할 수 있습니다.",
    category: "대화·생산성",
    rank: 1,
    avgRating: 4.8,
    reviewCount: 12840,
  },
  {
    id: "midjourney",
    name: "Midjourney",
    tagline: "디스코드 기반 이미지 생성",
    description:
      "텍스트 프롬프트만으로 고품질 일러스트·컨셉 아트를 생성합니다. Discord 봇으로 동작하며, 스타일과 구도를 세밀하게 조정할 수 있습니다.",
    category: "이미지",
    rank: 2,
    avgRating: 4.7,
    reviewCount: 8920,
  },
  {
    id: "dall-e",
    name: "DALL·E",
    tagline: "OpenAI 이미지 생성",
    description:
      "ChatGPT와 통합된 이미지 생성 모델로, 자연어 설명에서 독창적인 이미지를 만듭니다. 편집·변형 기능으로 반복 작업에 유리합니다.",
    category: "이미지",
    rank: 3,
    avgRating: 4.5,
    reviewCount: 6540,
  },
  {
    id: "claude",
    name: "Claude",
    tagline: "긴 문맥에 강한 AI",
    description:
      "Anthropic의 AI 어시스턴트로, 긴 문서 분석·코드 리뷰·안전한 답변에 강점이 있습니다. 아티팩트로 코드·문서 미리보기가 가능합니다.",
    category: "대화·생산성",
    rank: 4,
    avgRating: 4.6,
    reviewCount: 5210,
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    tagline: "노트 안에서 바로",
    description:
      "Notion 워크스페이스에 내장된 AI로, 페이지 요약·초안 작성·번역·표 정리 등을 문맥 안에서 바로 수행할 수 있습니다.",
    category: "생산성",
    rank: 5,
    avgRating: 4.3,
    reviewCount: 4102,
  },
];

export function getTopTools(limit = 5): Tool[] {
  return [...tools].sort((a, b) => a.rank - b.rank).slice(0, limit);
}

export function getToolById(id: string): Tool | undefined {
  return tools.find((t) => t.id === id);
}
