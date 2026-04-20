import { Suspense } from "react";
import { NavSearch } from "@/components/layout/NavSearch";
import { SiteHeaderBrand } from "@/components/layout/SiteHeaderBrand";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/80 bg-gradient-to-b from-violet-600/[0.07] via-violet-500/[0.03] to-transparent py-1.5 backdrop-blur-md">
      <div className="mx-auto flex min-h-14 max-w-4xl items-center justify-between gap-3 px-[var(--page-pad)]">
        <SiteHeaderBrand />
        <div className="flex min-w-0 flex-1 justify-end">
          <Suspense
            fallback={
              <div
                className="h-9 w-full max-w-[11.5rem] rounded-full bg-zinc-900/50"
                aria-hidden
              />
            }
          >
            <NavSearch />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
