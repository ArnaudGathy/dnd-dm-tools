"use client";

import { Quest } from "@/types/schemas";
import SheetCard from "@/components/ui/SheetCard";
import { StatCell } from "@/components/statblocks/StatCell";
import { useLocalStorage } from "react-use";
import { ChevronDown, ChevronUp } from "lucide-react";

export const QuestDetails = ({ quest }: { quest: Quest }) => {
  const [isOpen, setIsOpen] = useLocalStorage(`quest.${quest.id}`, true);

  return (
    <SheetCard className="relative flex flex-col gap-2">
      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-l font-bold md:text-xl">{quest.name}</span>
        {isOpen ? (
          <ChevronDown className="size-6" />
        ) : (
          <ChevronUp className="size-6" />
        )}
      </div>

      {isOpen && (
        <>
          <StatCell name="Donneur de quête" stat={quest.giver} />
          <StatCell name="Localisation" stat={quest.location} />
          <StatCell name="Tâche à accomplir" stat={quest.task} />
          {quest.providedItem && (
            <StatCell name="Matériel fourni" stat={quest.providedItem} />
          )}
          <StatCell name="Récompense" stat={quest.reward ?? "Aucune"} />
          {quest.outcome && (
            <StatCell
              name="Résolution"
              stat={quest.outcome}
              isHighlighted
              highlightClassName="text-green-400"
            />
          )}
        </>
      )}
    </SheetCard>
  );
};
