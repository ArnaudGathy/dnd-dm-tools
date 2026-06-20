import SpellsFilters, {
  SpellsSearchParams,
} from "@/app/(with-nav)/characters/[id]/spells/SpellsFilters";
import { SpellList } from "@/app/(with-nav)/characters/[id]/spells/SpellList";
import { getValidCharacter } from "@/lib/utils";
import AddSpellPopover from "@/app/(with-nav)/characters/[id]/spells/AddSpellPopover";
import EditModeButton from "@/app/(with-nav)/characters/[id]/spells/EditModeButton";
import SpellsLegend from "@/app/(with-nav)/characters/[id]/spells/SpellsLegend";
import { getGroupedCharacterSpells, SPELLS_GROUP_BY } from "@/lib/api/spells";
import { Badge } from "@/components/ui/badge";
import { Classes } from "@prisma/client";

import { getSpellsToPreparePerDay } from "@/utils/stats/spells";
import { CopyCheck, Info, RefreshCcw } from "lucide-react";
import { ElementType, ReactNode } from "react";
import PopoverComponent from "@/components/ui/PopoverComponent";

function StatPill({
  icon: Icon,
  value,
  label,
  definition,
}: {
  icon: ElementType;
  value: ReactNode;
  label: string;
  definition: ReactNode;
}) {
  return (
    <PopoverComponent
      definition={definition}
      className="flex items-center gap-1.5 rounded-md border bg-card px-2.5 py-1 text-sm transition-colors hover:bg-muted"
    >
      <Icon className="size-4 text-sky-500" />
      <span className="font-semibold tabular-nums">{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </PopoverComponent>
  );
}

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

  const character = await getValidCharacter(id);
  const spellsToPreparePerDay = getSpellsToPreparePerDay(character);

  const groupBy = awaitedSearchParams.groupBy ?? SPELLS_GROUP_BY.LEVEL;
  const { spells } = await getGroupedCharacterSpells({
    search: awaitedSearchParams.search,
    groupBy,
    filterBy: awaitedSearchParams.filterBy,
    characterId: character.id,
    isWizard: character.className === Classes.WIZARD,
  });
  const totalCount = Object.values(spells).reduce((sum, list) => sum + list.length, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <h1 className="flex scroll-m-20 items-center gap-2 text-2xl font-semibold leading-none tracking-tight">
              {`Sorts de ${character.name}`}
              <Badge variant="secondary" className="font-normal tabular-nums">
                {totalCount}
              </Badge>
            </h1>

            {!!spellsToPreparePerDay && (
              <div className="flex flex-wrap items-center gap-2">
                <StatPill
                  icon={CopyCheck}
                  value={spellsToPreparePerDay.total}
                  label="à préparer"
                  definition={<div>Total de sorts à préparer</div>}
                />
                <StatPill
                  icon={RefreshCcw}
                  value={spellsToPreparePerDay.dailyAmount}
                  label="échangeables / jour"
                  definition={<div>Combien de sorts peuvent être changés chaque jour</div>}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isEditMode && <AddSpellPopover characterId={id} />}
            <PopoverComponent definition={<SpellsLegend />}>
              <Info className="size-5 text-blue-400" />
            </PopoverComponent>
            <EditModeButton />
          </div>
        </div>

        <SpellsFilters />
      </div>

      <SpellList
        spellsGroupedBy={spells}
        groupBy={groupBy}
        character={character}
        isEditMode={isEditMode}
      />
    </div>
  );
}
