"use client";

import SheetSingleData from "@/components/ui/SheetSingleData";
import { CharacterById } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, LoaderCircle } from "lucide-react";
import { updateInspiration } from "@/lib/actions/characters";
import { useState } from "react";

export default function InspirationForm({
  character,
  className,
}: {
  character: CharacterById;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inspiration, setInspiration] = useState(character.inspiration);

  const handleSubmit = async () => {
    setIsLoading(true);
    await updateInspiration(character.id, inspiration);
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <SheetSingleData
      label="Inspiration"
      value={
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger onClick={() => setIsOpen(true)}>
            {character.inspiration}
          </PopoverTrigger>
          <PopoverContent className="w-full">
            <div className="flex w-[60px] flex-col items-center gap-4">
              <Input
                type="number"
                name="inspiration"
                onChange={(e) => setInspiration(Number(e.target.value))}
                value={inspiration}
              />
              <Button
                size="lg"
                type="button"
                className="w-full"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Check />
                )}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      }
      className={className}
    />
  );
}
