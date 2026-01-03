"use client";

import { Progress } from "@/components/ui/progress";
import { CharacterById } from "@/lib/utils";
import SheetCard from "@/components/ui/SheetCard";

export default function AttunedItems({ character }: { character: CharacterById }) {
  const numberOfAttunedItems = character.inventory.filter((item) => item.isAttuned).length;

  return (
    <SheetCard className="flex flex-col items-center justify-center">
      <span className="mb-2 text-2xl font-bold">Objets magique harmonisés</span>
      <div className="relative my-2 flex w-2/3 items-center gap-2">
        <Progress value={numberOfAttunedItems >= 1 ? 100 : 0} className="bg-stone-700" />
        <Progress value={numberOfAttunedItems >= 2 ? 100 : 0} className="bg-stone-700" />
        <Progress value={numberOfAttunedItems >= 3 ? 100 : 0} className="bg-stone-700" />
        <span className="absolute left-1/2 mt-0.5 -translate-x-1/2 text-base">
          {numberOfAttunedItems}/3
        </span>
      </div>
    </SheetCard>
  );
}
