import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-4xl px-[var(--page-pad)] pb-[var(--page-pad-bottom)] pt-[var(--page-pad)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
