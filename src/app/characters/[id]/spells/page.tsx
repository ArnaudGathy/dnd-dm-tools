import { getCharacterSpellsByLevel, GROUP_BY } from "@/lib/api/characters";
import { SpellList } from "@/app/spells/SpellList";
import SpellsFilters from "@/app/spells/SpellsFilters";
import Breadcrumbs from "@/components/Breadcrumbs";

const defaultFilter = GROUP_BY.LEVEL;

export default async function Spells({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ groupBy?: GROUP_BY; search?: string }>;
}) {
  const { id } = await params;
  const { search, groupBy } = await searchParams;

  const breadCrumbs = [
    { name: "Accueil", href: "/" },
    { name: "Personnages", href: "/characters" },
    { name: "Sorts", href: `/characters/${id}/spells` },
  ];

  const spellsByLevel = await getCharacterSpellsByLevel({
    search,
    groupBy: groupBy ?? defaultFilter,
    characterId: parseInt(id, 10),
  });

  const getLabel = () => {
    if (groupBy === GROUP_BY.LEVEL || !groupBy) {
      return "Niveau";
    }
    return "";
  };

  return (
    <Breadcrumbs crumbs={breadCrumbs}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className={"scroll-m-20 text-2xl font-bold tracking-tight"}>
            Liste des sorts
          </h1>
        </div>
        <SpellsFilters defaultSearch={defaultFilter} disablePlayer />
        <SpellList spellsGroupedBy={spellsByLevel} label={getLabel()} />
      </div>
    </Breadcrumbs>
  );
}
