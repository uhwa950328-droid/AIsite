"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function ChevronBackIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function SiteHeaderBrand() {
  const pathname = usePathname();
  const isToolDetail = pathname.startsWith("/tool/");

  if (isToolDetail) {
    return (
      <Link
        href="/"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted transition-colors hover:bg-white/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label="랭킹으로 돌아가기"
      >
        <ChevronBackIcon className="h-5 w-5" />
      </Link>
    );
  }

  return (
    <Link href="/" className="flex min-w-0 shrink items-center gap-3">
      <span
        className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl"
        aria-hidden
      >
        <Image
          src="/logo.png"
          alt=""
          width={36}
          height={36}
          className="h-full w-full object-cover"
          priority
        />
      </span>
      <span className="text-[18px] font-bold tracking-tight text-foreground">
        AI Review
      </span>
    </Link>
  );
}
