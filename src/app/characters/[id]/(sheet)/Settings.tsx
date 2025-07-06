import { CharacterById } from "@/lib/utils";
import SheetCard from "@/components/ui/SheetCard";
import { StatCell } from "@/components/statblocks/StatCell";
import {
  CAMPAIGN_MAP,
  CHARACTER_STATUS_MAP,
  PARTY_MAP,
} from "@/constants/maps";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

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
        <StatCell
          name="Campagne"
          stat={CAMPAIGN_MAP[character.campaign.name]}
        />
        <StatCell
          name="Groupe"
          stat={PARTY_MAP[character.campaign.party.name]}
        />
        <Separator className="my-4 bg-muted-foreground" />
        <StatCell name="Propriétaire" stat={character.owner} />
        <StatCell name="Modification" stat={formatDate(character.updatedAt)} />
        <StatCell name="Création" stat={formatDate(character.createdAt)} />
        <Link href={`/characters/${character.id}/update`} className="mt-4">
          <Button className="w-full">
            <Edit /> Modifier le personnage
          </Button>
        </Link>
      </SheetCard>
    </div>
  );
}
