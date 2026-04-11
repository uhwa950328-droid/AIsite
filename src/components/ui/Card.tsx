import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card/80 shadow-xl shadow-black/20 backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
