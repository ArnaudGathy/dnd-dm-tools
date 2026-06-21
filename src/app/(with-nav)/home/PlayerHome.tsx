import Link from "next/link";
import { ArrowRight, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSessionData } from "@/lib/utils";
import { getFilteredCharactersByOwner } from "@/lib/api/characters";
import CharacterList from "@/app/(with-nav)/characters/CharacterList";
import HomeHeader from "@/app/(with-nav)/home/HomeHeader";
import HomeSectionGrid from "@/app/(with-nav)/home/HomeSectionGrid";
import { playerSections } from "@/app/(with-nav)/home/homeSections";

export default async function PlayerHome() {
  const { userMail, userName } = await getSessionData();

  const characters = await getFilteredCharactersByOwner({ ownerEmail: userMail });
  const myCharacters = characters.filter((character) => character.owner === userMail);

  return (
    <div className="mx-auto mt-4 flex w-full max-w-5xl flex-col gap-10">
      <HomeHeader
        firstName={userName}
        subtitle="Reprenez votre aventure là où vous l'avez laissée."
      />

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Mes personnages
          </h2>
          <Link
            href="/characters"
            className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Voir tout
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {myCharacters.length > 0 ? (
          <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
            {myCharacters.map((character) => (
              <CharacterList
                key={character.id}
                character={character}
                numberOfCharacters={myCharacters.length}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border bg-card/40 p-6">
            <p className="text-muted-foreground">Vous n&apos;avez pas encore de personnage.</p>
            <Link href="/characters/add">
              <Button variant="secondary">
                <UserPlus />
                Créer un personnage
              </Button>
            </Link>
          </div>
        )}
      </section>

      <HomeSectionGrid title="Raccourcis" sections={playerSections} />
    </div>
  );
}
