import { getGroupedCharacterSpells, SPELLS_GROUP_BY } from "@/lib/api/spells";
import { SpellList } from "@/app/spells/SpellList";
import { SpellsSearchParams } from "@/app/characters/[id]/spells/page";

export default async function SpellsGrouped({
  searchParams,
  characterId,
  defaultFilter,
}: {
  searchParams: SpellsSearchParams;
  characterId: number;
  defaultFilter: SPELLS_GROUP_BY;
}) {
  const { search, groupBy } = searchParams;
  const { spells } = await getGroupedCharacterSpells({
    search,
    groupBy: groupBy ?? defaultFilter,
    characterId: characterId,
  });

  const getLabel = () => {
    if (groupBy === SPELLS_GROUP_BY.LEVEL || !groupBy) {
      return "Niveau";
    }
    return "";
  };

  return <SpellList spellsGroupedBy={spells} label={getLabel()} />;
}
