import { SpellList } from "@/app/spells/SpellList";
import SpellsFilters from "@/app/spells/SpellsFilters";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getCharacterSpellsByLevel, SPELLS_GROUP_BY } from "@/lib/api/spells";
import NotFound from "next/dist/client/components/not-found-error";

const defaultFilter = SPELLS_GROUP_BY.LEVEL;

export default async function Spells({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ groupBy?: SPELLS_GROUP_BY; search?: string }>;
}) {
  const { id } = await params;
  const { search, groupBy } = await searchParams;

  const { spells, name } = await getCharacterSpellsByLevel({
    search,
    groupBy: groupBy ?? defaultFilter,
    characterId: parseInt(id, 10),
  });

  if (!name) {
    return <NotFound />;
  }

  const breadCrumbs = [
    { name: "Accueil", href: "/" },
    { name: "Personnages", href: "/characters" },
    { name: name, href: `/characters/${id}` },
    { name: "Sorts", href: `/characters/${id}/spells` },
  ];

  const getLabel = () => {
    if (groupBy === SPELLS_GROUP_BY.LEVEL || !groupBy) {
      return "Niveau";
    }
    return "";
  };

  return (
    <Breadcrumbs crumbs={breadCrumbs}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className={"scroll-m-20 text-2xl font-bold tracking-tight"}>
            {`Liste des sorts de ${name}`}
          </h1>
        </div>
        <SpellsFilters defaultSearch={defaultFilter} disablePlayer />
        <SpellList spellsGroupedBy={spells} label={getLabel()} />
      </div>
    </Breadcrumbs>
  );
}
