import { CHARACTER_STATUS_MAP } from "@/constants/maps";
import { cn } from "@/lib/utils";
import { CharacterStatus } from "@prisma/client";
import { Heart, type LucideIcon, RotateCcw, Skull, TreePalm } from "lucide-react";

export const STATUS_CONFIG: Record<CharacterStatus, { icon: LucideIcon; className: string }> = {
  [CharacterStatus.ACTIVE]: {
    icon: Heart,
    className: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
  },
  [CharacterStatus.DEAD]: {
    icon: Skull,
    className: "bg-rose-500/15 text-rose-400 ring-rose-500/30",
  },
  [CharacterStatus.RETIRED]: {
    icon: TreePalm,
    className: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
  },
  [CharacterStatus.BACKUP]: {
    icon: RotateCcw,
    className: "bg-sky-500/15 text-sky-400 ring-sky-500/30",
  },
};

export function CharacterStatusChip({
  status,
  className,
}: {
  status: CharacterStatus;
  className?: string;
}) {
  const { icon: Icon, className: statusClassName } = STATUS_CONFIG[status];
  const isActive = status === CharacterStatus.ACTIVE;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        statusClassName,
        className,
      )}
    >
      {/* Living status pill: the active heart gently pulses. */}
      <Icon className={cn("size-3.5", isActive && "animate-pulse")} />
      {CHARACTER_STATUS_MAP[status]}
    </span>
  );
}
