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
  const { isAdmin } = await getSessionData();

  const characters = await getAllFilteredCharacters({
    ...searchParams,
  });

  const campaigns = await getCampaigns();
  const parties = await getParties();

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
        numberOfCharacters={2}
        isAdmin={isAdmin}
      />

      <h1 className="text-2xl font-bold tracking-tight">Personnages</h1>
      <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
        {characters.length > 0 ? (
          characters.map((character) => (
            <CharacterList
              key={character.id}
              character={character}
              numberOfCharacters={characters.length}
            />
          ))
        ) : (
          <div className="text-muted-foreground">Aucun personnage trouvé.</div>
        )}
      </div>
    </div>
  );
}
