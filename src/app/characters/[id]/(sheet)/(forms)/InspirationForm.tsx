import SheetSingleData from "@/components/ui/SheetSingleData";
import { CharacterById } from "@/lib/utils";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { Input } from "@/components/ui/input";
import { PopoverClose } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { updateInspiration } from "@/lib/actions/characters";

export default function InspirationForm({
  character,
  className,
}: {
  character: CharacterById;
  className?: string;
}) {
  const action = updateInspiration.bind(null, character.id);

  return (
    <SheetSingleData
      label="Inspiration"
      value={
        <PopoverComponent
          definition={
            <form
              action={action}
              className="flex w-[60px] flex-col items-center gap-4"
            >
              <Input defaultValue={character.inspiration} name="inspiration" />
              <PopoverClose asChild>
                <Button size="lg" type="submit" className="w-full">
                  <Check />
                </Button>
              </PopoverClose>
            </form>
          }
        >
          {character.inspiration}
        </PopoverComponent>
      }
      className={className}
    />
  );
}
