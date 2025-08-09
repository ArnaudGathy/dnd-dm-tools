"use client";

import { CLASS_SPELL_PROGRESSION_MAP } from "@/constants/maps";
import { Character } from "@prisma/client";
import { entries } from "remeda";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "react-use";
import { BookOpenIcon, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";

const SingleSlot = ({
  isExpanded,
  add,
  remove,
}: {
  isExpanded?: boolean;
  add: () => void;
  remove: () => void;
}) => (
  <div
    className={cn(
      "size-10 cursor-pointer rounded border-[2px] border-sky-100 bg-sky-500 hover:scale-105",
      {
        "border-sky-900 bg-transparent": isExpanded,
      },
    )}
    onClick={() => (isExpanded ? add() : remove())}
  ></div>
);

function SpellSlots({ character }: { character: Character }) {
  const spellSlots = CLASS_SPELL_PROGRESSION_MAP[character.className];
  const allSlots = spellSlots[character.level - 1];

  const [currentSlots, setCurrentSlots] = useLocalStorage(
    "spellSlots",
    allSlots,
  );

  const addSlot = (spellLevel: number) => {
    const maxSlots = allSlots[spellLevel];
    setCurrentSlots(
      !currentSlots
        ? currentSlots
        : {
            ...currentSlots,
            [spellLevel]: Math.min(maxSlots, currentSlots[spellLevel] + 1),
          },
    );
  };

  const removeSlot = (spellLevel: number) => {
    setCurrentSlots(
      !currentSlots
        ? currentSlots
        : {
            ...currentSlots,
            [spellLevel]: Math.max(0, currentSlots[spellLevel] - 1),
          },
    );
  };

  if (currentSlots === undefined || spellSlots.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col">
        <span className="self-center text-lg font-bold">Emplacements</span>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 p-4">
          {entries(allSlots).map(([level, slots]) => {
            const numberLevel = parseInt(level, 10);
            const availableSlots = currentSlots[numberLevel];
            return (
              <div key={level} className="flex flex-col gap-1">
                <span className="self-center text-sm text-muted-foreground">{`Niv. ${level}`}</span>
                <div className="grid grid-cols-2 gap-1">
                  {Array(slots)
                    .fill(0)
                    .map((_, index) => (
                      <SingleSlot
                        key={index}
                        add={() => addSlot(numberLevel)}
                        remove={() => removeSlot(numberLevel)}
                        isExpanded={index >= availableSlots}
                      />
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Link href={`/characters/${character.id}/spells`} className="w-full">
          <Button
            variant="secondary"
            className="w-full border-2 border-sky-500 bg-sky-950 font-bold hover:bg-sky-900"
          >
            <BookOpenIcon className="text-sky-500" />
            Liste des sorts
          </Button>
        </Link>
        <Button
          onClick={() => setCurrentSlots(allSlots)}
          className="border-2 border-sky-500 bg-sky-950 font-bold hover:bg-sky-900"
        >
          <RotateCw />
        </Button>
      </div>
    </>
  );
}

export default dynamic(() => Promise.resolve(SpellSlots), { ssr: false });
