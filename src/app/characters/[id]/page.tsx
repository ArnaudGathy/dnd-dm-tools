import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpenIcon, PawPrintIcon } from "lucide-react";
import { getValidCharacter } from "@/lib/utils";

export default async function Character({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await getValidCharacter(id);

  const breadCrumbs = [
    { name: "Accueil", href: "/" },
    { name: "Personnages", href: "/characters" },
    { name: character.name, href: `/characters/${id}` },
  ];

  return (
    <Breadcrumbs crumbs={breadCrumbs}>
      <div className="flex flex-col gap-4">
        <h1 className={"scroll-m-20 text-2xl font-bold tracking-tight"}>
          {character.name}
        </h1>

        <div className="flex gap-4">
          {character.spellsOnCharacters.length > 0 && (
            <Link href={`/characters/${character.id}/spells`}>
              <Button variant="secondary" size="sm">
                <BookOpenIcon />
                Liste des sorts
              </Button>
            </Link>
          )}
          {character.creatures.length > 0 && (
            <Link href={`/characters/${character.id}/creatures`}>
              <Button variant="secondary" size="sm">
                <PawPrintIcon />
                Liste des créatures
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Breadcrumbs>
  );
}
