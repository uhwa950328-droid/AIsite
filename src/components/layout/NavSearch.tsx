"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { emitNavigationStart } from "@/lib/navigation-events";
import { cn } from "@/lib/utils";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function NavSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qFromUrl = searchParams.get("q") ?? "";
  const isHome = pathname === "/";

  const [value, setValue] = useState(() => (isHome ? qFromUrl : ""));

  useEffect(() => {
    if (isHome) setValue(qFromUrl);
  }, [isHome, qFromUrl]);

  const pushQuery = useCallback(
    (raw: string, opts?: { silent?: boolean }) => {
      const q = raw.trim();
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      const category = searchParams.get("category");
      if (category) params.set("category", category);
      const s = params.toString();
      const href = s ? `/?${s}` : "/";
      if (isHome) {
        if (!opts?.silent) emitNavigationStart();
        router.replace(href);
      } else if (q) {
        emitNavigationStart();
        router.push(href);
      }
    },
    [isHome, router, searchParams],
  );

  return (
    <form
      role="search"
      className="ml-auto w-full min-w-0 max-w-[11.5rem]"
      onSubmit={(e) => {
        e.preventDefault();
        pushQuery(value);
      }}
    >
      <label className="sr-only" htmlFor="nav-search">
        툴 검색
      </label>
      <div
        className={cn(
          "flex h-9 w-full items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/90 px-3",
          "focus-within:border-zinc-600",
        )}
      >
        <SearchIcon className="h-4 w-4 shrink-0 text-zinc-500" />
        <input
          id="nav-search"
          type="search"
          enterKeyHint="search"
          placeholder="검색"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            setValue(v);
            if (isHome) pushQuery(v, { silent: true });
          }}
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-zinc-500 outline-none"
          autoComplete="off"
        />
      </div>
    </form>
  );
}
