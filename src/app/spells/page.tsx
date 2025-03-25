import { SpellList } from "@/app/spells/SpellList";
import SpellsFilters from "@/app/spells/SpellsFilters";
import { getCharacterSpellsByLevel, SPELLS_GROUP_BY } from "@/lib/api/spells";

export default async function Spells({
  searchParams,
}: {
  searchParams: Promise<{ groupBy?: SPELLS_GROUP_BY; search?: string }>;
}) {
  const { search, groupBy } = await searchParams;
  const { spells } = await getCharacterSpellsByLevel({
    search,
    groupBy: groupBy ?? SPELLS_GROUP_BY.ALPHABETICAL,
  });

  const getLabel = () => {
    if (groupBy === SPELLS_GROUP_BY.LEVEL) {
      return "Niveau";
    }
    return "";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className={"scroll-m-20 text-2xl font-bold tracking-tight"}>
          Liste des sorts
        </h1>
      </div>
      <SpellsFilters />
      <SpellList spellsGroupedBy={spells} label={getLabel()} />
    </div>
  );
}
