import { Suspense } from "react";
import { NavSearch } from "@/components/layout/NavSearch";
import { SiteHeaderBrand } from "@/components/layout/SiteHeaderBrand";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-3 px-[var(--page-pad)]">
        <SiteHeaderBrand />
        <Suspense
          fallback={
            <div
              className="h-9 w-full max-w-[10.5rem] rounded-full bg-zinc-900/50 sm:max-w-[11.5rem]"
              aria-hidden
            />
          }
        >
          <NavSearch />
        </Suspense>
      </div>
    </header>
  );
}
