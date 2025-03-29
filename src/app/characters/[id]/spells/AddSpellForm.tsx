"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ButtonWithFormStatusLoader from "@/components/ui/ButtonWithFormStatusLoader";
import { useActionState } from "react";
import { tryToAddSpell } from "@/lib/actions/spells";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const initialState: { message?: string; error?: string } = {};

export default function AddSpellForm({ characterId }: { characterId: string }) {
  const [state, formAction] = useActionState(tryToAddSpell, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-2 pt-4">
      <input type="hidden" name="characterId" value={characterId} />
      <div className="space-y-2">
        <Label htmlFor="spellName">
          Nom du sort à ajouter (Français ou Anglais)
        </Label>
        <div className="flex space-x-2">
          <Input type="text" id="spellName" name="spellName" />
          <ButtonWithFormStatusLoader hasTextDuringLoad={false}>
            <Plus className="size-6" />
          </ButtonWithFormStatusLoader>
        </div>
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
