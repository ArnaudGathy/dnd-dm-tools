"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ButtonWithFormStatusLoader from "@/components/ui/ButtonWithFormStatusLoader";
import { useActionState, useEffect, useState } from "react";
import { tryToAddSpell } from "@/lib/actions/spells";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const initialState: { message?: string; error?: string } = {};

export default function AddSpellPopover({ characterId }: { characterId: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(tryToAddSpell, initialState);

  useEffect(() => {
    if (state.message) {
      toast.success(state.message);
      setOpen(false);
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="default" size="sm">
          <Plus className="size-4" /> Ajouter un sort
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <form action={formAction} className="flex flex-col gap-3">
          <input type="hidden" name="characterId" value={characterId} />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold">Ajouter un sort</span>
            <span className="text-xs text-muted-foreground">
              Anglais ou français (2024 uniquement).
            </span>
          </div>
          <Input
            type="text"
            id="spellName"
            name="spellName"
            placeholder="Nom du sort…"
            autoFocus
            autoComplete="off"
          />
          <div className="flex items-center justify-between gap-2">
            <a
              className="text-xs text-muted-foreground underline hover:text-foreground"
              target="_blank"
              rel="noreferrer"
              href="https://www.aidedd.org/spell/fr/"
            >
              Site de référence
            </a>
            <ButtonWithFormStatusLoader hasTextDuringLoad={false}>
              <Plus className="size-4" /> Ajouter
            </ButtonWithFormStatusLoader>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
