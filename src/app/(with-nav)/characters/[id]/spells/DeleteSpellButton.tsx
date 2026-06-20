"use client";

import { X } from "lucide-react";
import { deleteSpellAction } from "@/lib/actions/spells";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Spell } from "@prisma/client";

export default function DeleteSpellButton({
  spell,
  characterId,
}: {
  spell: Spell;
  characterId: number;
}) {
  return (
    <ConfirmDialog
      title="Supprimer le sort ?"
      description="Le sort sera supprimé de la liste ainsi que des favoris."
      onConfirm={() =>
        deleteSpellAction({
          characterId: characterId,
          spellId: spell.id,
        })
      }
    >
      <button
        title="Supprimer le sort"
        className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
      >
        <X className="size-4" />
      </button>
    </ConfirmDialog>
  );
}
