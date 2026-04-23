const STORAGE_KEY = "ai-rank-review-edit-tokens";

function readMap(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, string>;
  } catch {
    return {};
  }
}

function writeMap(map: Record<string, string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function rememberReviewEditToken(reviewId: string, token: string) {
  const map = readMap();
  map[reviewId] = token;
  writeMap(map);
}

export function getReviewEditToken(reviewId: string): string | null {
  const map = readMap();
  return map[reviewId] ?? null;
}

export function forgetReviewEditToken(reviewId: string) {
  const map = readMap();
  if (!(reviewId in map)) return;
  delete map[reviewId];
  writeMap(map);
}

/** 클라이언트에서 마운트 후 “내 리뷰” 집합 초기화용 */
export function getAllReviewEditTokenIds(): string[] {
  return Object.keys(readMap());
}
