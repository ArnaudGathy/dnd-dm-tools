"use client";

import { Check, Heart, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetHp, setHP, updateHP } from "@/lib/actions/characters";
import { CharacterById, cn } from "@/lib/utils";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SheetSingleData from "@/components/ui/SheetSingleData";
import { useState } from "react";

const HP_OPTIONS = 22;

export default function HPForm({ character }: { character: CharacterById }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"plus" | "minus">("minus");
  const isPlus = mode === "plus";
  const action = updateHP.bind(null, character.id, character.maximumHP);

  const handleSetHp = (amount: number) =>
    setHP(
      character.id,
      character.currentHP,
      character.maximumHP,
      isPlus ? amount : -amount,
    );

  return (
    <SheetSingleData
      label={
        <div className="flex justify-center">
          <Heart className="stroke-[2.5px] text-primary" />
        </div>
      }
      value={
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger onClick={() => setIsOpen(true)}>
            <div>
              <span
                className={cn({
                  "text-green-500": character.currentHP < character.maximumHP,
                  "text-orange-500":
                    character.currentHP <= character.maximumHP * 0.5,
                  "text-red-500":
                    character.currentHP <= character.maximumHP * 0.2,
                  "text-stone-500": character.currentHP <= 0,
                })}
              >
                {character.currentHP}
              </span>
              <span>/</span>
              <span>{character.maximumHP}</span>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[300px]">
            <div className="flex flex-col items-center gap-4">
              <div>Points de vie (PV)</div>
              <form
                action={action}
                className="flex flex-col items-center gap-4"
              >
                <div className="flex gap-2">
                  <Input
                    type="number"
                    defaultValue={character.currentHP}
                    name="HP"
                  />
                  <PopoverClose asChild>
                    <Button type="submit" className="w-full">
                      <Check />
                    </Button>
                  </PopoverClose>
                  <PopoverClose asChild>
                    <Button
                      className="w-full"
                      onClick={() => resetHp(character.id, character.maximumHP)}
                      theme="white"
                    >
                      <RotateCcw /> MAX
                    </Button>
                  </PopoverClose>
                </div>
                <div className="flex gap-2">
                  <div className="grid grid-cols-4 gap-1">
                    <Button
                      theme={isPlus ? "red" : "green"}
                      onClick={() =>
                        setMode((current) =>
                          current === "plus" ? "minus" : "plus",
                        )
                      }
                    >
                      {isPlus ? "-" : "+"}
                    </Button>
                    {Array.from({ length: HP_OPTIONS }, (_, i) => i + 1).map(
                      (i) => (
                        <PopoverClose key={i} asChild>
                          <Button
                            theme={isPlus ? "green" : "red"}
                            className="font-mono"
                            onClick={() => handleSetHp(i)}
                          >
                            {isPlus ? "+" : "-"}
                            {i}
                          </Button>
                        </PopoverClose>
                      ),
                    )}
                    <Input
                      type="number"
                      className="w-[58px]"
                      placeholder={isPlus ? "+ x" : "- x"}
                      onBlur={(e) => handleSetHp(parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </form>
            </div>
          </PopoverContent>
        </Popover>
      }
    />
  );
}
