import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import CharacterFilters from "@/app/(with-nav)/characters/CharacterFilters";
import CharacterList from "@/app/(with-nav)/characters/CharacterList";
import { getSessionData } from "@/lib/utils";
import { getAllFilteredCharacters } from "@/lib/api/characters";
import { CharacterListSearchParams } from "@/app/(with-nav)/characters/page";
import { getCampaigns } from "@/lib/api/campaigns";
import { getParties } from "@/lib/api/parties";

export default async function AdminCharacterList({
  searchParams,
}: {
  searchParams: CharacterListSearchParams;
}) {
  const { userMail, isAdmin } = await getSessionData();

  const characters = await getAllFilteredCharacters({
    ...searchParams,
  });

  const campaigns = await getCampaigns();
  const parties = await getParties();

  const myCharacters = characters.filter((character) => character.owner === userMail);
  const myCampaignCharacters = characters.filter(
    (character) =>
      character.owner !== userMail && !!userMail && character.campaign.owner.includes(userMail),
  );
  const otherCharacters = characters.filter(
    (character) =>
      character.owner !== userMail && (!userMail || !character.campaign.owner.includes(userMail)),
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className={"scroll-m-20 text-2xl font-bold tracking-tight"}>Liste des personnages</h1>
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
        numberOfCharacters={characters.length}
        isAdmin={isAdmin}
      />

      {myCharacters.length > 0 && (
        <>
          <h1 className="text-2xl font-bold tracking-tight">Mes personnages</h1>
          <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
            {myCharacters.map((character) => (
              <CharacterList
                key={character.id}
                character={character}
                numberOfCharacters={myCharacters.length}
              />
            ))}
          </div>
        </>
      )}

      {myCampaignCharacters.length > 0 && (
        <>
          <h1 className="pt-4 text-2xl font-bold tracking-tight">Personnages de mes campagnes</h1>
          <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
            {myCampaignCharacters.map((character) => (
              <CharacterList
                key={character.id}
                character={character}
                numberOfCharacters={myCampaignCharacters.length}
              />
            ))}
          </div>
        </>
      )}

      {otherCharacters.length > 0 && (
        <>
          <h1 className="pt-4 text-2xl font-bold tracking-tight">Autres personnages</h1>
          <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
            {otherCharacters.map((character) => (
              <CharacterList
                key={character.id}
                character={character}
                numberOfCharacters={otherCharacters.length}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
