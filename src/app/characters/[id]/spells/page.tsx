import SpellsFilters, { SpellsSearchParams } from "@/app/spells/SpellsFilters";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SPELLS_GROUP_BY, SPELLS_VIEW } from "@/lib/api/spells";
import SpellCardsList from "@/app/spells/SpellCardsList";
import SpellsGrouped from "@/app/spells/[id]/SpellsGrouped";
import { getValidCharacter } from "@/lib/utils";

const defaultFilter = SPELLS_GROUP_BY.LEVEL;

export default async function Spells({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SpellsSearchParams>;
}) {
  const { id } = await params;
  const awaitedSearchParams = await searchParams;
  const isCardView = awaitedSearchParams.view === SPELLS_VIEW.CARDS;

  const character = await getValidCharacter(id);
  const intCharacterId = parseInt(id, 10);

  const breadCrumbs = [
    { name: "Accueil", href: "/" },
    { name: "Personnages", href: "/characters" },
    { name: character.name, href: `/characters/${id}` },
    { name: "Sorts", href: `/characters/${id}/spells` },
  ];

  return (
    <Breadcrumbs crumbs={breadCrumbs}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className={"scroll-m-20 text-2xl font-bold tracking-tight"}>
            {`Liste des sorts de ${character.name}`}
          </h1>
        </div>
        <SpellsFilters
          defaultSearch={defaultFilter}
          features={["search", "cards", "level", "alphabetical", "favorites"]}
        />
        {isCardView ? (
          <SpellCardsList
            characterId={intCharacterId}
            searchParams={awaitedSearchParams}
          />
        ) : (
          <SpellsGrouped
            characterId={intCharacterId}
            searchParams={awaitedSearchParams}
            defaultFilter={defaultFilter}
          />
        )}
      </div>
    </Breadcrumbs>
  );
}
