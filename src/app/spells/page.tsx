import { SpellList } from "@/app/spells/SpellList";
import { getCharacterSpellsByLevel, GROUP_BY } from "@/lib/api/characters";
import SpellsFilters from "@/app/spells/SpellsFilters";

export default async function Spells({
  searchParams,
}: {
  searchParams: Promise<{ groupBy?: GROUP_BY; search?: string }>;
}) {
  const { search, groupBy } = await searchParams;
  const spellsByLevel = await getCharacterSpellsByLevel({
    search,
    groupBy: groupBy ?? GROUP_BY.ALPHABETICAL,
  });

  const getLabel = () => {
    if (groupBy === GROUP_BY.LEVEL) {
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
      <SpellList spellsGroupedBy={spellsByLevel} label={getLabel()} />
    </div>
  );
}
