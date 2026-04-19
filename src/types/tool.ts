export type Tool = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  /** 히어로 스크린샷: `/screenshots/...` 또는 외부 https URL */
  screenshotSrc?: string;
  category: string;
  /** 1 = highest on leaderboard */
  rank: number;
  avgRating: number;
  reviewCount: number;
  /** 홈 랭킹 카드용 최근 리뷰 본문 (최신순, 여러 줄 순환 표시) */
  reviewSnippets?: string[];
};
