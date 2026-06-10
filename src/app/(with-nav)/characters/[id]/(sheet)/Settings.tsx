"use client";

import { CharacterById } from "@/lib/utils";
import SheetCard from "@/components/ui/SheetCard";
import { StatCell } from "@/components/statblocks/StatCell";
import { CAMPAIGN_MAP, CHARACTER_STATUS_MAP, PARTY_MAP } from "@/constants/maps";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, RefreshCcw, Trash } from "lucide-react";
import { toast } from "sonner";
import ToggleConfirmDialog from "@/components/ui/ToggleConfirmDialog";
import { deleteCharacter } from "@/lib/actions/characters";

const formatDate = (date: Date) =>
  Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);

export default function Settings({ character }: { character: CharacterById }) {
  return (
    <div className="flex w-full flex-col gap-4 p-0 md:w-auto md:p-4">
      <SheetCard className="flex flex-col">
        <span className="mb-2 text-2xl font-bold">Informations</span>
        <StatCell name="État" stat={CHARACTER_STATUS_MAP[character.status]} />
        <Separator className="my-4 bg-muted-foreground" />
        <StatCell name="Propriétaire" stat={character.owner} />
        <StatCell name="Modification" stat={formatDate(character.updatedAt)} />
        <StatCell name="Création" stat={formatDate(character.createdAt)} />
        <Separator className="my-4 bg-muted-foreground" />
        <StatCell name="Campagne" stat={CAMPAIGN_MAP[character.campaign.name]} />
        <StatCell name="DM de la Campagne" stat={character.campaign.owner.join(", ")} />
        <StatCell name="Groupe" stat={PARTY_MAP[character.campaign.party.name]} />
        <Link href={`/characters/${character.id}/update`} className="mt-4">
          <Button variant="outline" className="w-full">
            <Edit /> Modifier le personnage
          </Button>
        </Link>
        <Separator className="my-8 bg-muted-foreground" />
        <div className="flex gap-4">
          <Button
            theme="white"
            onClick={() => {
              localStorage.clear();
              toast("Les ressources et les emplacements de sorts on été réinitialisés.");
            }}
          >
            <RefreshCcw /> Vider le cache
          </Button>
          <ToggleConfirmDialog
            title="Supprimer le personnage ?"
            description="Cette action est irréversible. Le personnage et toutes ses données (sorts, créatures, armes, armures, équipement, objets magiques et argent) seront définitivement supprimés."
            onConfirm={async () => {
              const result = await deleteCharacter(character.id);
              if (result?.error) {
                toast.error(result.error);
              }
            }}
          >
            {(setIsOpen) => (
              <Button theme="red" onClick={() => setIsOpen(true)}>
                <Trash /> Supprimer le personnage
              </Button>
            )}
          </ToggleConfirmDialog>
        </div>
      </SheetCard>
    </div>
  );
}
