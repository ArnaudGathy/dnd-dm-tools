import SpellsFilters, { SpellsSearchParams } from "@/app/spells/SpellsFilters";
import { SPELLS_GROUP_BY, SPELLS_VIEW } from "@/lib/api/spells";
import SpellCardsList from "@/app/spells/SpellCardsList";
import SpellsGrouped from "@/app/spells/[id]/SpellsGrouped";
import { getValidCharacter } from "@/lib/utils";
import AddSpellForm from "@/app/characters/[id]/spells/AddSpellForm";
import { Separator } from "@/components/ui/separator";
import EditModeButton from "@/app/characters/[id]/spells/EditModeButton";

import { getSpellsToPreparePerDay } from "@/utils/stats/spells";

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
  const isEditMode = awaitedSearchParams?.editMode === "true";

  const character = await getValidCharacter(id);
  const intCharacterId = parseInt(id, 10);

  const spellsToPreparePerDay = getSpellsToPreparePerDay(character);

  return (
    <div className="space-y-4">
      <div className="w-fit space-y-4">
        <div className="flex items-center justify-between">
          <h1 className={"scroll-m-20 text-2xl font-bold tracking-tight"}>
            {`Sorts de ${character.name}`}
          </h1>

          <EditModeButton />
        </div>
        {isEditMode && <AddSpellForm characterId={id} />}
        <SpellsFilters
          defaultSearch={defaultFilter}
          features={["search", "cards", "level", "alphabetical", "favorites"]}
        />
        {!!spellsToPreparePerDay && (
          <div className="flex flex-col">
            <span>
              Total de sorts à préparer :{" "}
              <span className="font-bold text-sky-500">
                {spellsToPreparePerDay.total}
              </span>
            </span>
            <span>
              Sorts à préparer chaque jour :{" "}
              <span className="font-bold text-sky-500">
                {spellsToPreparePerDay.dailyAmount}
              </span>
            </span>
          </div>
        )}
      </div>

      <Separator />

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
          isEditMode={isEditMode}
        />
      )}
    </div>
  );
}
