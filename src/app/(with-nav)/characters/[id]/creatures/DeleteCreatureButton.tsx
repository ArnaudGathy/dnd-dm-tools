"use client";

import { X } from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { FlatCreature } from "@/lib/api/creatures";
import { deleteCreatureAction } from "@/lib/actions/creatures";

export default function DeleteCreatureButton({
  creature,
  characterId,
}: {
  creature: FlatCreature;
  characterId: number;
}) {
  return (
    <ConfirmDialog
      title="Supprimer la créature ?"
      description="La créature sera supprimée de la liste ainsi que des favoris."
      onConfirm={() =>
        deleteCreatureAction({
          characterId: characterId,
          creatureId: creature.id,
        })
      }
    >
      <button className="flex items-center">
        <X className="size-6 cursor-pointer text-primary" />
      </button>
    </ConfirmDialog>
  );
}
