import { getGroupedCharacterSpells, SPELLS_GROUP_BY } from "@/lib/api/spells";
import { SpellList } from "@/app/(with-nav)/characters/[id]/spells/SpellList";
import { SpellsSearchParams } from "@/app/(with-nav)/characters/[id]/spells/SpellsFilters";
import { CharacterById } from "@/lib/utils";
import { Classes } from "@prisma/client";

export default async function SpellsGrouped({
  searchParams,
  character,
  isEditMode = false,
}: {
  searchParams: SpellsSearchParams;
  character: CharacterById;
  isEditMode?: boolean;
}) {
  const defaultFilter = SPELLS_GROUP_BY.LEVEL;
  const { search, groupBy, filterBy } = searchParams;
  const { spells } = await getGroupedCharacterSpells({
    search,
    groupBy: groupBy ?? defaultFilter,
    filterBy,
    characterId: character.id,
    isWizard: character.className === Classes.WIZARD,
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
      character={character}
      isEditMode={isEditMode}
    />
  );
}
