"use client";

import { X } from "lucide-react";
import { deleteSpellAction } from "@/lib/actions/spells";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function DeleteSpellButton({
  spellId,
  characterId,
}: {
  spellId: string;
  characterId: number;
}) {
  return (
    <ConfirmDialog
      title="Supprimer le sort ?"
      description="Le sort sera supprimé de la liste ainsi que des favoris."
      onConfirm={() =>
        deleteSpellAction({
          characterId: characterId,
          spellId: spellId,
        })
      }
    >
      <button className="flex items-center">
        <X className="size-6 cursor-pointer text-primary" />
      </button>
    </ConfirmDialog>
  );
}
