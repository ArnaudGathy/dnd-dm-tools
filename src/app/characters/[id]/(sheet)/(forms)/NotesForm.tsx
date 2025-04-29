import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateNotes } from "@/lib/actions/characters";
import { CharacterById } from "@/lib/utils";
import { PopoverClose } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

export default function NotesForm({ character }: { character: CharacterById }) {
  const action = updateNotes.bind(null, character.id);

  return (
    <form
      action={action}
      className="flex w-[300px] flex-col items-center gap-4"
    >
      <Textarea
        defaultValue={character.notes ?? ""}
        name="notes"
        className="h-[300px]"
      />
      <PopoverClose asChild>
        <Button size="lg" type="submit" className="w-full">
          <Check />
        </Button>
      </PopoverClose>
    </form>
  );
}
