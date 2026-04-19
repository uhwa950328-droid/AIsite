"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type ReviewSnippetRotatorProps = {
  snippets: string[];
  className?: string;
};

const INTERVAL_MS = 5000;

export function ReviewSnippetRotator({
  snippets,
  className,
}: ReviewSnippetRotatorProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (snippets.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % snippets.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [snippets.length]);

  if (snippets.length === 0) return null;

  const text = snippets[index] ?? "";

  return (
    <p
      className={cn(
        "mt-3 line-clamp-2 whitespace-pre-line text-sm leading-relaxed text-foreground/90",
        className,
      )}
      aria-live="polite"
    >
      <span className="text-zinc-500">{'"'}</span>
      {text}
      <span className="text-zinc-500">{'"'}</span>
    </p>
  );
}
