"use client";

import {
  Check,
  ChevronsLeft,
  ChevronsRight,
  Heart,
  RotateCcw,
} from "lucide-react";
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
import ToggleConfirmDialog from "@/components/ui/ToggleConfirmDialog";

const HP_OPTIONS_STEPS = 21;

export default function HPForm({ character }: { character: CharacterById }) {
  const [hpStep, setHpStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"plus" | "minus">("minus");
  const [inputHP, setInputHP] = useState(character.currentHP);
  const isPlus = mode === "plus";

  const handleUpdateHP = async (hpOverride?: number) => {
    await updateHP(character.id, character.maximumHP, hpOverride ?? inputHP);
    setIsOpen(false);
    if (hpOverride) {
      setInputHP(hpOverride);
    }
  };

  const handleSetHp = async (amount: number) => {
    const newHp = await setHP(
      character.id,
      character.currentHP,
      isPlus ? amount : -amount,
    );
    setIsOpen(false);
    setInputHP(newHp);
  };

  const baseHP = Math.min(character.currentHP, character.maximumHP);
  const temporaryHp =
    character.currentHP > character.maximumHP
      ? character.currentHP - character.maximumHP
      : 0;

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
                {temporaryHp > 0 && `+${temporaryHp}`}
              </span>
              <span>/</span>
              <span>{character.maximumHP}</span>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[300px]">
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
                <ToggleConfirmDialog
                  title="Ajouter des PV temporaire ?"
                  description="Augmenter les PV au dessus du maximum ajoutera des PV temporaires. Annuler montera le PV au maximum sans ajouter de PV temporaires."
                  onConfirm={() => {
                    void handleUpdateHP();
                  }}
                  onCancel={() => {
                    void handleUpdateHP(character.maximumHP);
                  }}
                >
                  {(setIsOpenDialog: (isOpen: boolean) => void) => (
                    <Button
                      className="w-full"
                      onClick={() => {
                        if (
                          inputHP > character.maximumHP &&
                          character.currentHP <= character.maximumHP
                        ) {
                          setIsOpenDialog(true);
                        } else {
                          void handleUpdateHP();
                        }
                      }}
                    >
                      <Check />
                    </Button>
                  )}
                </ToggleConfirmDialog>
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
                  {Array.from(
                    { length: HP_OPTIONS_STEPS },
                    (_, i) => i + 1 + hpStep * HP_OPTIONS_STEPS,
                  ).map((i) => (
                    <ToggleConfirmDialog
                      key={i}
                      title="Ajouter des PV temporaire ?"
                      description="Augmenter les PV au dessus du maximum ajoutera des PV temporaires. Annuler montera le PV au maximum sans ajouter de PV temporaires."
                      onConfirm={() => {
                        void handleSetHp(i);
                      }}
                      onCancel={() => {
                        void handleUpdateHP(character.maximumHP);
                      }}
                    >
                      {(setIsOpenDialog: (isOpen: boolean) => void) => (
                        <Button
                          theme={isPlus ? "green" : "red"}
                          className="font-mono"
                          onClick={() => {
                            if (
                              isPlus &&
                              character.currentHP + i > character.maximumHP &&
                              character.currentHP <= character.maximumHP
                            ) {
                              setIsOpenDialog(true);
                            } else {
                              void handleSetHp(i);
                            }
                          }}
                        >
                          {isPlus ? "+" : "-"}
                          {i}
                        </Button>
                      )}
                    </ToggleConfirmDialog>
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
