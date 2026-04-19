"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { NAVIGATION_START_EVENT } from "@/lib/navigation-events";

/**
 * 내부 링크 클릭·프로그래매틱 이동 시 상단 인디터미넌트 바.
 * 라우트가 바뀌면 자동으로 숨깁니다.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, setPending] = useState(false);
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const prevKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevKeyRef.current === null) {
      prevKeyRef.current = routeKey;
      return;
    }
    if (prevKeyRef.current !== routeKey) {
      prevKeyRef.current = routeKey;
      setPending(false);
    }
  }, [routeKey]);

  useEffect(() => {
    const onClickCapture = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !(a instanceof HTMLAnchorElement)) return;
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:"))
        return;
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        if (
          url.pathname === window.location.pathname &&
          url.search === window.location.search
        ) {
          return;
        }
        setPending(true);
      } catch {
        /* ignore */
      }
    };

    const onProgStart = () => setPending(true);

    const onPopState = () => setPending(true);

    document.addEventListener("click", onClickCapture, true);
    window.addEventListener(NAVIGATION_START_EVENT, onProgStart);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClickCapture, true);
      window.removeEventListener(NAVIGATION_START_EVENT, onProgStart);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  if (!pending) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px] overflow-hidden bg-zinc-950/40"
      aria-hidden
    >
      <div className="animate-nav-progress h-full w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600 bg-[length:200%_100%]" />
    </div>
  );
}
