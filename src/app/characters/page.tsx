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
import { Check, Skull, TreePalm } from "lucide-react";
import { TooltipComponent } from "@/components/ui/tooltip";
export default async function Characters() {
  const { userName, isAdmin, userMail } = await getSessionData();
  const characters = await getCharactersByOwner(isAdmin ? undefined : userMail);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="scroll-m-20 text-2xl font-bold tracking-tight">
        Liste des personnages {isAdmin ? "" : ` de ${userName}`}
      </h1>

      <div className="flex flex-col gap-4">
        {characters.map((character) => (
          <Card key={character.id} className="w-full md:w-[50%]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {character.status === CharacterStatus.DEAD && (
                    <TooltipComponent definition="Personnage mort">
                      <Skull className="text-red-600" />
                    </TooltipComponent>
                  )}
                  {character.status === CharacterStatus.RETIRED && (
                    <TooltipComponent definition="Personnage retraité">
                      <TreePalm className="text-amber-700" />
                    </TooltipComponent>
                  )}
                  {character.status === CharacterStatus.ACTIVE && (
                    <TooltipComponent definition="Personnage actif">
                      <Check className="text-green-500" />
                    </TooltipComponent>
                  )}
                  <span>{character.name}</span>
                </div>
                <span className="text-base text-muted-foreground">
                  {CLASS_MAP[character.className]}
                </span>
              </CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="flex gap-8">
              <StatCell
                name="Groupe"
                stat={PARTY_MAP[character.campaign.party.name]}
                isInline
              />
              <StatCell
                name="Campagne"
                stat={CAMPAIGN_MAP[character.campaign.name]}
                isInline
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
