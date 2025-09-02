import SpellsFilters, {
  SpellsSearchParams,
} from "@/app/(with-nav)/characters/[id]/spells/SpellsFilters";
import SpellsGrouped from "@/app/(with-nav)/spells/[id]/SpellsGrouped";
import { getValidCharacter } from "@/lib/utils";
import AddSpellForm from "@/app/(with-nav)/characters/[id]/spells/AddSpellForm";
import { Separator } from "@/components/ui/separator";
import EditModeButton from "@/app/(with-nav)/characters/[id]/spells/EditModeButton";

import { getSpellsToPreparePerDay } from "@/utils/stats/spells";
import { CopyCheck, RefreshCcw } from "lucide-react";
import StatCard from "@/app/(with-nav)/characters/[id]/(sheet)/StatCard";

export default async function Spells({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SpellsSearchParams>;
}) {
  const { id } = await params;
  const awaitedSearchParams = await searchParams;
  const isEditMode = awaitedSearchParams?.editMode === "true";
  const isCollapsed = awaitedSearchParams?.isCollapsed === "true";

  const character = await getValidCharacter(id);

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

        <SpellsFilters />
      </div>

      {!!spellsToPreparePerDay && !isCollapsed && (
        <div className="flex gap-4">
          <StatCard
            icon={CopyCheck}
            iconColor="text-sky-500"
            value={spellsToPreparePerDay.total}
            definition={<div>Total de sorts à préparer</div>}
          />
          <StatCard
            icon={RefreshCcw}
            iconColor="text-sky-500"
            value={spellsToPreparePerDay.dailyAmount}
            definition={
              <div>Combien de sorts peuvent être changés chaque jour</div>
            }
          />
        </div>
      )}

      <Separator />

      <SpellsGrouped
        character={character}
        searchParams={awaitedSearchParams}
        isEditMode={isEditMode}
      />
    </div>
  );
}
