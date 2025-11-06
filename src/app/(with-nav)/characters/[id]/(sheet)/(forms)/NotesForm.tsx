"use client";

import { Check, Edit, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateNotes } from "@/lib/actions/characters";
import { CharacterById } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function NotesForm({ character }: { character: CharacterById }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState(character.notes ?? "");

  const handleSubmit = async () => {
    setIsLoading(true);
    await updateNotes(character.id, notes);
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger onClick={() => setIsOpen(true)} asChild>
        <Button className="absolute right-4 top-4">
          <Edit />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-[300px] flex-col items-center gap-4">
        <Textarea
          name="notes"
          className="h-[300px]"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
        <Button
          size="lg"
          type="button"
          className="w-full"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? <LoaderCircle className="size-6 animate-spin" /> : <Check />}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
