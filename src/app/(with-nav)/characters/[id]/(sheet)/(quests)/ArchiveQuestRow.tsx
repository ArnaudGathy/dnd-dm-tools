"use client";

import { Quest } from "@/types/schemas";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { QuestBody, QuestOutcome, QuestReward } from "./QuestCard";

/** Condensed, closed-by-default row for archived statuses (Terminé / Pas intéressé):
 *  the list stays scannable, tap a quest to re-read its details and resolution. */
export default function ArchiveQuestRow({ quest }: { quest: Quest }) {
  return (
    <Collapsible className="rounded-lg bg-muted">
      <CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 rounded-lg px-3.5 py-2.5 text-left transition-colors hover:bg-white/5">
        <span className="min-w-0 flex-1 truncate text-sm font-bold leading-tight">
          {quest.name}
        </span>
        <span className="sm:block hidden max-w-[40%] truncate text-xs text-muted-foreground">
          {quest.location}
        </span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-2.5 px-3.5 pb-3 pt-0.5">
          <QuestBody quest={quest} />
          <QuestReward reward={quest.reward} />
          {quest.outcome && <QuestOutcome outcome={quest.outcome} />}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
