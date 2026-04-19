/** 프로그래매틱 라우팅 시 상단 진행 표시와 동기화 */
export const NAVIGATION_START_EVENT = "aisite:navigation-start";

export function emitNavigationStart(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(NAVIGATION_START_EVENT));
}
