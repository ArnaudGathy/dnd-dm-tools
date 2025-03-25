import {
  getNumberOfCharactersByOwner,
  getFilteredCharactersByOwner,
} from "@/lib/api/characters";
import { getSessionData } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CAMPAIGN_MAP, CLASS_MAP, PARTY_MAP, RACE_MAP } from "@/constants/maps";
import { StatCell } from "@/app/creatures/StatCell";
import { CampaignId, CharacterStatus, PartyId } from "@prisma/client";
import {
  BookOpenIcon,
  FileSpreadsheet,
  Heart,
  MapPin,
  Skull,
  TreePalm,
  Users,
} from "lucide-react";
import { TooltipComponent } from "@/components/ui/tooltip";
import { classColors } from "@/constants/colors";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CharacterFilters from "@/app/characters/CharacterFilters";
import { getOwnersCampaigns } from "@/lib/api/campaigns";
import { getOwnersParties } from "@/lib/api/parties";

const breadCrumbs = [
  { name: "Accueil", href: "/" },
  { name: "Personnages", href: "/characters" },
];

export default async function Characters({
  searchParams,
}: {
  searchParams: Promise<{
    campaign?: CampaignId;
    party?: PartyId;
    status?: CharacterStatus;
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const { isAdmin, userMail } = await getSessionData();
  const ownerEmail = isAdmin ? undefined : userMail;

  const characters = await getFilteredCharactersByOwner({
    ownerEmail,
    ...params,
  });
  const totalCharacters = await getNumberOfCharactersByOwner({ ownerEmail });
  const campaigns = await getOwnersCampaigns({ ownerEmail });
  const parties = await getOwnersParties({ ownerEmail });

  return (
    <Breadcrumbs crumbs={breadCrumbs}>
      <h1 className={"scroll-m-20 text-2xl font-bold tracking-tight"}>
        Liste des personnages
      </h1>
      <CharacterFilters
        parties={parties}
        campaigns={campaigns}
        numberOfCharacters={totalCharacters}
      />
      <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
        {characters.length > 0 ? (
          characters.map((character) => (
            <Card key={character.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{character.name}</span>
                  <div>
                    {character.status === CharacterStatus.DEAD && (
                      <TooltipComponent definition="Personnage mort">
                        <Skull />
                      </TooltipComponent>
                    )}
                    {character.status === CharacterStatus.RETIRED && (
                      <TooltipComponent definition="Personnage retraité">
                        <TreePalm />
                      </TooltipComponent>
                    )}
                    {character.status === CharacterStatus.ACTIVE && (
                      <TooltipComponent definition="Personnage actif">
                        <Heart />
                      </TooltipComponent>
                    )}
                  </div>
                </CardTitle>
                <CardDescription className="flex gap-1">
                  <span
                    style={{
                      color: classColors[character.className].background,
                    }}
                  >
                    {CLASS_MAP[character.className]}
                  </span>
                  <span>{RACE_MAP[character.race]}</span>
                  <span>{`niveau ${character.level}`}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {totalCharacters > 1 && (
                  <div className="flex flex-col gap-4">
                    <StatCell
                      name={<Users />}
                      stat={PARTY_MAP[character.campaign.party.name]}
                      isInline
                    />
                    <StatCell
                      name={<MapPin />}
                      stat={CAMPAIGN_MAP[character.campaign.name]}
                      isInline
                    />
                  </div>
                )}
                <div className="flex gap-4">
                  <Link href={`/characters/${character.id}/sheet`}>
                    <Button variant="default" size="sm">
                      <FileSpreadsheet />
                      Fiche de personnage
                    </Button>
                  </Link>
                  {character._count.spellsOnCharacters > 0 && (
                    <Link href={`/characters/${character.id}/spells`}>
                      <Button variant="secondary" size="sm">
                        <BookOpenIcon />
                        Liste des sorts
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-muted-foreground">Aucun personnage trouvé.</div>
        )}
      </div>
    </Breadcrumbs>
  );
}
