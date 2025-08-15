import { getGroupedCharacterSpells, SPELLS_GROUP_BY } from "@/lib/api/spells";
import { SpellList } from "@/app/(with-nav)/spells/SpellList";
import { SpellsSearchParams } from "@/app/(with-nav)/spells/SpellsFilters";

export default async function SpellsGrouped({
  searchParams,
  characterId,
  defaultFilter,
  isEditMode = false,
}: {
  searchParams: SpellsSearchParams;
  characterId: number;
  defaultFilter: SPELLS_GROUP_BY;
  isEditMode?: boolean;
}) {
  const { search, groupBy, filterBy } = searchParams;
  const { spells } = await getGroupedCharacterSpells({
    search,
    groupBy: groupBy ?? defaultFilter,
    filterBy,
    characterId: characterId,
  });

  const getLabel = () => {
    if (groupBy === SPELLS_GROUP_BY.LEVEL || !groupBy) {
      return "Niveau";
    }
    return "";
  };

  return (
    <SpellList
      spellsGroupedBy={spells}
      label={getLabel()}
      characterId={characterId}
      showFavorites
      isEditMode={isEditMode}
    />
  );
}
