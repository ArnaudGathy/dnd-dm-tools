import {
  getFilteredCharactersByOwner,
  getNumberOfCharactersByOwner,
} from "@/lib/api/characters";
import { getSessionData } from "@/lib/utils";
import { CampaignId, CharacterStatus, PartyId } from "@prisma/client";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CharacterFilters from "@/app/(with-nav)/characters/CharacterFilters";
import { getOwnersCampaigns } from "@/lib/api/campaigns";
import { getOwnersParties } from "@/lib/api/parties";
import CharacterList from "@/app/(with-nav)/characters/CharacterList";

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
  const { userMail } = await getSessionData();
  const ownerEmail = userMail;

  const characters = await getFilteredCharactersByOwner({
    ownerEmail,
    ...params,
  });
  const totalCharacters = await getNumberOfCharactersByOwner({ ownerEmail });
  const campaigns = await getOwnersCampaigns({ ownerEmail });
  const parties = await getOwnersParties({ ownerEmail });

  const myCharacters = characters.filter(
    (character) => character.owner === userMail,
  );
  const myCampaignCharacters = characters.filter(
    (character) => character.owner !== userMail,
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className={"scroll-m-20 text-2xl font-bold tracking-tight"}>
          Liste des personnages
        </h1>
        <Link href={`/characters/add`}>
          <Button variant="secondary">
            <UserPlus />
            Créer un personnage
          </Button>
        </Link>
      </div>
      <CharacterFilters
        parties={parties}
        campaigns={campaigns}
        numberOfCharacters={totalCharacters}
      />

      <h1 className="text-2xl font-bold tracking-tight">Mes personnages</h1>
      <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
        {myCharacters.length > 0 ? (
          myCharacters.map((character) => (
            <CharacterList
              key={character.id}
              character={character}
              numberOfCharacters={myCharacters.length}
            />
          ))
        ) : (
          <div className="text-muted-foreground">Aucun personnage trouvé.</div>
        )}
      </div>

      <h1 className="pt-4 text-2xl font-bold tracking-tight">
        Personnages de mes campagnes
      </h1>
      <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
        {myCampaignCharacters.length > 0 ? (
          myCampaignCharacters.map((character) => (
            <CharacterList
              key={character.id}
              character={character}
              numberOfCharacters={myCampaignCharacters.length}
            />
          ))
        ) : (
          <div className="text-muted-foreground">Aucun personnage trouvé.</div>
        )}
      </div>
    </div>
  );
}
