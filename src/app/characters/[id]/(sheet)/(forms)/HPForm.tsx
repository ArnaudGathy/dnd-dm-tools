"use client";

import { Check, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetHp, updateHP } from "@/lib/actions/characters";
import { CharacterById } from "@/lib/utils";
import { PopoverClose } from "@/components/ui/popover";

export default function HPForm({ character }: { character: CharacterById }) {
  const action = updateHP.bind(null, character.id, character.maximumHP);

  return (
    <form action={action} className="flex w-[60px] flex-col items-center gap-4">
      <Input defaultValue={character.currentHP} name="HP" />
      <div className="flex gap-2">
        <PopoverClose asChild>
          <Button type="submit" className="w-full">
            <Check />
          </Button>
        </PopoverClose>
        <PopoverClose asChild>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => resetHp(character.id, character.maximumHP)}
          >
            <RotateCcw />
          </Button>
        </PopoverClose>
      </div>
    </form>
  );
}
