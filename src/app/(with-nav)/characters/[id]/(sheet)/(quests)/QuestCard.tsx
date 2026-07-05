import { Quest } from "@/types/schemas";
import { cn } from "@/lib/utils";
import { Gem, MapPin, Package, UserRound } from "lucide-react";
import { ElementType, ReactNode } from "react";

/** One icon-led metadata line inside a quest card (donneur, lieu, matériel…). */
export function QuestField({
  icon: Icon,
  label,
  children,
  className,
}: {
  icon: ElementType;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline gap-2 text-sm", className)}>
      <Icon className="size-3.5 shrink-0 translate-y-0.5 text-muted-foreground" />
      <span className="shrink-0 text-tiny font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="min-w-0 break-words leading-snug text-foreground/90">{children}</span>
    </div>
  );
}

/** The emerald "how it ended" insert shown on resolved quests. */
export function QuestOutcome({ outcome }: { outcome: string }) {
  return (
    <div className="rounded-md border-l-2 border-emerald-500 bg-emerald-500/[0.07] px-3 py-2">
      <span className="text-tiny font-bold uppercase tracking-wider text-emerald-400">
        Résolution
      </span>
      <p className="mt-0.5 whitespace-pre-line text-sm leading-snug text-emerald-100/90">
        {outcome}
      </p>
    </div>
  );
}

/** The amber reward footer — the quest's motivator, set apart from the fields. */
export function QuestReward({ reward }: { reward?: string }) {
  return (
    <div className="flex items-baseline gap-2 border-t border-border/70 pt-2 text-sm">
      <Gem className="size-3.5 shrink-0 translate-y-0.5 text-amber-400" />
      <span className="shrink-0 text-tiny font-semibold uppercase tracking-wider text-amber-300/90">
        Récompense
      </span>
      <span className="min-w-0 break-words font-semibold leading-snug text-foreground">
        {reward ?? "Aucune"}
      </span>
    </div>
  );
}

/** Body fields shared by the rich card and the expanded archive row. */
export function QuestBody({ quest }: { quest: Quest }) {
  return (
    <div className="flex flex-col gap-1.5">
      <QuestField icon={UserRound} label="Donneur">
        {quest.giver}
      </QuestField>
      <QuestField icon={MapPin} label="Lieu">
        {quest.location}
      </QuestField>
      {quest.providedItem && (
        <QuestField icon={Package} label="Matériel">
          {quest.providedItem}
        </QuestField>
      )}
      <p className="whitespace-pre-line pt-1 text-sm leading-relaxed text-foreground/90">
        {quest.task}
      </p>
    </div>
  );
}

/** Rich, always-open card used for the active statuses (En cours / Intéressé). */
export default function QuestCard({ quest }: { quest: Quest }) {
  return (
    <div className="flex flex-col gap-2.5 rounded-lg bg-muted px-3.5 py-3">
      <span className="text-base font-bold leading-tight">{quest.name}</span>
      <QuestBody quest={quest} />
      <QuestReward reward={quest.reward} />
      {quest.outcome && <QuestOutcome outcome={quest.outcome} />}
    </div>
  );
}
