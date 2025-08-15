import { cn } from "@/lib/utils";

export default function InfoCell({
  name,
  value,
  className,
}: {
  name: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center", className)}>
      <span className="min-w-[85px] text-muted-foreground">{name}</span>
      <>{value}</>
    </div>
  );
}
