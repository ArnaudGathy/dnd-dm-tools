"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ButtonWithFormStatusLoader from "@/components/ui/ButtonWithFormStatusLoader";
import { useActionState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

import { tryToAddCreature } from "@/lib/actions/creatures";

export const initialState: { message?: string; error?: string } = {};

export default function AddCreatureForm({
  characterId,
}: {
  characterId: string;
}) {
  const [state, formAction] = useActionState(tryToAddCreature, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-2 pt-4">
      <input type="hidden" name="characterId" value={characterId} />
      <div className="flex w-fit flex-col gap-2">
        <Label htmlFor="spellName">Nom de la créature à ajouter</Label>
        <span className="flex gap-2 text-sm text-muted-foreground">
          {"ANGLAIS uniquement"}
        </span>
        <a
          className="text-sm text-muted-foreground underline"
          target="_blank"
          rel="noreferrer"
          href="https://www.aidedd.org/monster/fr/"
        >
          Site de référence
        </a>
        <Input type="text" id="creatureName" name="creatureName" />
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
