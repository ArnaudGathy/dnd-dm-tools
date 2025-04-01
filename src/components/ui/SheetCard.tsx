import { cn } from "@/lib/utils";

export default function SheetCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg bg-muted p-4", className)}>{children}</div>
  );
}
