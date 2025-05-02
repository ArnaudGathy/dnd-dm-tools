"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ButtonWithFormStatusLoader from "@/components/ui/ButtonWithFormStatusLoader";
import { useActionState } from "react";
import { tryToAddSpell } from "@/lib/actions/spells";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SpellVersion } from "@prisma/client";

export const initialState: { message?: string; error?: string } = {};

export default function AddSpellForm({
  characterId,
  spellVersion,
}: {
  characterId: string;
  spellVersion: SpellVersion;
}) {
  const [state, formAction] = useActionState(tryToAddSpell, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-2 pt-4">
      <input type="hidden" name="characterId" value={characterId} />
      <input type="hidden" name="spellVersion" value={spellVersion} />
      <div className="flex w-fit flex-col gap-2">
        <Label htmlFor="spellName">Nom du sort à ajouter</Label>
        <span className="flex gap-2 text-sm text-muted-foreground">
          {spellVersion === SpellVersion.V2024
            ? "Anglais uniquement (ed. 2024)"
            : "Français ou anglais"}
          <a
            className="underline"
            target="_blank"
            rel="noreferrer"
            href={
              spellVersion === SpellVersion.V2024
                ? "https://www.aidedd.org/spell/"
                : "https://www.aidedd.org/dnd-filters/sorts.php"
            }
          >
            Site de référence
          </a>
        </span>
        <Input type="text" id="spellName" name="spellName" />
        <ButtonWithFormStatusLoader hasTextDuringLoad={false}>
          <Plus className="size-6" /> Ajouter
        </ButtonWithFormStatusLoader>
      </div>

      <div
        className={cn("min-h-5 text-sm", {
          "text-green-500": !!state.message,
          "text-red-500": !!state.error,
        })}
      >
        {state.error || state.message}
      </div>
    </form>
  );
}
