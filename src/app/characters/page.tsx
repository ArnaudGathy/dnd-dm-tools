import { getCharactersByOwner } from "@/lib/api/characters";
import { getSessionData } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CAMPAIGN_MAP, CLASS_MAP, PARTY_MAP } from "@/constants/maps";
import { StatCell } from "@/app/creatures/StatCell";
import { CharacterStatus } from "@prisma/client";
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

const breadCrumbs = [
  { name: "Accueil", href: "/" },
  { name: "Personnages", href: "/characters" },
];

export default async function Characters() {
  const { isAdmin, userMail } = await getSessionData();
  const characters = await getCharactersByOwner(isAdmin ? undefined : userMail);

  return (
    <Breadcrumbs crumbs={breadCrumbs}>
      <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
        {characters.map((character) => (
          <Card key={character.id} className="w-full md:w-auto">
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
                <span>humain</span>
                <span>niveau 4</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
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
              <div className="flex gap-4">
                <Link href={`/characters/${character.id}/sheet`}>
                  <Button variant="default" size="sm">
                    <FileSpreadsheet />
                    Fiche de personnage
                  </Button>
                </Link>
                <Link href={`/characters/${character.id}/spells`}>
                  <Button variant="secondary" size="sm">
                    <BookOpenIcon />
                    Liste des sorts
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Breadcrumbs>
  );
}
