"use client";

import {
  Check,
  ChevronsLeft,
  ChevronsRight,
  Heart,
  RotateCcw,
  Shield,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetHp, setHp, setTempHp } from "@/lib/actions/characters";
import { CharacterById, cn } from "@/lib/utils";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SheetSingleData from "@/components/ui/SheetSingleData";
import { useState } from "react";

const HP_OPTIONS_STEPS = 20;

export default function HPForm({ character }: { character: CharacterById }) {
  const [hpStep, setHpStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"plus" | "minus">("minus");
  const [isTempHP, setIsTempHP] = useState(false);
  const [inputHP, setInputHP] = useState(character.currentHP);
  const isPlus = mode === "plus";

  const handleUpdateHP = async () => {
    await setHp(character.id, character.maximumHP, inputHP);
    setIsOpen(false);
  };

  const handleSetHp = async (amount: number) => {
    if (isTempHP) {
      await setTempHp(
        character.id,
        character.currentTempHP + (isPlus ? amount : -amount),
      );
    } else {
      const newHp = await setHp(
        character.id,
        character.maximumHP,
        character.currentHP + (isPlus ? amount : -amount),
      );
      setInputHP(newHp);
    }

    setIsOpen(false);
  };

  const baseHP = Math.min(character.currentHP, character.maximumHP);

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
                {baseHP}
              </span>
              <span className="text-teal-500">
                {character.currentTempHP > 0 && `+${character.currentTempHP}`}
              </span>
              <span>/</span>
              <span>{character.maximumHP}</span>
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="w-[300px]"
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            <div className="flex flex-col items-center gap-4">
              <div>Points de vie (PV)</div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={inputHP}
                  name="HP"
                  onChange={(e) => {
                    const newHp = e.target.value;
                    if (!!newHp && !Number.isNaN(newHp)) {
                      setInputHP(parseInt(newHp, 10));
                    }
                  }}
                />
                <Button
                  className="w-full"
                  onClick={() => {
                    void handleUpdateHP();
                  }}
                >
                  <Check />
                </Button>
                <PopoverClose asChild>
                  <Button
                    className="w-full"
                    onClick={() => {
                      void resetHp(character.id, character.maximumHP);
                      setInputHP(character.maximumHP);
                    }}
                    theme="white"
                  >
                    <RotateCcw /> MAX
                  </Button>
                </PopoverClose>
              </div>
              {`${isPlus ? "Ajout" : "Suppression"} de ${isTempHP ? "PV temporaire" : "PV"}`}
              <div className="flex gap-2">
                <div className="grid grid-cols-4 gap-1">
                  <Button
                    theme={isTempHP ? "red" : "teal"}
                    onClick={() => {
                      setIsTempHP((current) => !current);
                      setMode("plus");
                    }}
                  >
                    {isTempHP ? <Heart /> : <Shield />}
                  </Button>
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
                  {Array.from(
                    { length: HP_OPTIONS_STEPS },
                    (_, i) => i + 1 + hpStep * HP_OPTIONS_STEPS,
                  ).map((i) => (
                    <Button
                      key={i}
                      theme={
                        isTempHP
                          ? isPlus
                            ? "teal"
                            : "orange"
                          : isPlus
                            ? "green"
                            : "red"
                      }
                      className="font-mono"
                      onClick={() => {
                        void handleSetHp(i);
                      }}
                    >
                      {isPlus ? "+" : "-"}
                      {i}
                    </Button>
                  ))}
                  <Button
                    theme="white"
                    onClick={() => setHpStep((current) => current - 1)}
                    disabled={hpStep === 0}
                  >
                    <ChevronsLeft />
                  </Button>
                  <Button
                    theme="white"
                    onClick={() => setHpStep((current) => current + 1)}
                    disabled={hpStep === 5}
                  >
                    <ChevronsRight />
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      }
    />
  );
}
