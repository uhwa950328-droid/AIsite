"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ReviewSnippetRotatorProps = {
  snippets: string[];
  className?: string;
};

const INTERVAL_MS = 5000;
/** 페이드 아웃 후 다음 문구로 교체 */
const FADE_MS = 280;

export function ReviewSnippetRotator({
  snippets,
  className,
}: ReviewSnippetRotatorProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  /** 브라우저 setTimeout id (Node Timeout 타입과 호환 위해 number) */
  const swapTimerRef = useRef<number | null>(null);
  const snippetsKey = snippets.join("\u0001");

  useEffect(() => {
    setIndex(0);
    setVisible(true);
  }, [snippetsKey]);

  useEffect(() => {
    if (snippets.length <= 1) return;

    const id = window.setInterval(() => {
      setVisible(false);
      if (swapTimerRef.current) window.clearTimeout(swapTimerRef.current);
      swapTimerRef.current = window.setTimeout(() => {
        swapTimerRef.current = null;
        setIndex((i) => (i + 1) % snippets.length);
        setVisible(true);
      }, FADE_MS);
    }, INTERVAL_MS);

    return () => {
      window.clearInterval(id);
      if (swapTimerRef.current) window.clearTimeout(swapTimerRef.current);
    };
  }, [snippets.length, snippetsKey]);

  if (snippets.length === 0) return null;

  const text = snippets[index] ?? "";

  return (
    <div className={cn("mt-3", className)}>
      <p
        className={cn(
          "line-clamp-2 overflow-hidden break-words whitespace-pre-line text-sm leading-relaxed text-foreground/90 transition-[opacity,transform] duration-300 ease-out",
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-1 opacity-0",
        )}
        aria-live="polite"
      >
        <span className="text-zinc-500">{'"'}</span>
        {text}
        <span className="text-zinc-500">{'"'}</span>
      </p>
    </div>
  );
}
