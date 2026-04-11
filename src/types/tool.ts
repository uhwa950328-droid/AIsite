export type Tool = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  /** 1 = highest on leaderboard */
  rank: number;
  avgRating: number;
  reviewCount: number;
};
