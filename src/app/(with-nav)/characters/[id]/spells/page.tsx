import SpellsFilters, {
  SpellsSearchParams,
} from "@/app/(with-nav)/characters/[id]/spells/SpellsFilters";
import { SpellList } from "@/app/(with-nav)/characters/[id]/spells/SpellList";
import { cn, getValidCharacter } from "@/lib/utils";
import AddSpellPopover from "@/app/(with-nav)/characters/[id]/spells/AddSpellPopover";
import EditModeButton from "@/app/(with-nav)/characters/[id]/spells/EditModeButton";
import SpellsLegend from "@/app/(with-nav)/characters/[id]/spells/SpellsLegend";
import { getGroupedCharacterSpells, SPELLS_GROUP_BY } from "@/lib/api/spells";
import { Badge } from "@/components/ui/badge";
import { Classes, SpellAction } from "@prisma/client";

import { getSpellsToPreparePerDay } from "@/utils/stats/spells";
import { CopyCheck, Info, RefreshCcw } from "lucide-react";
import { ElementType, ReactNode } from "react";
import PopoverComponent from "@/components/ui/PopoverComponent";

function StatPill({
  icon: Icon,
  value,
  label,
  definition,
  iconClassName = "text-sky-500",
  valueClassName,
}: {
  icon: ElementType;
  value: ReactNode;
  label: string;
  definition: ReactNode;
  iconClassName?: string;
  valueClassName?: string;
}) {
  return (
    <PopoverComponent
      definition={definition}
      className="flex items-center gap-1.5 rounded-md border bg-card px-2.5 py-1 text-sm transition-colors hover:bg-muted"
    >
      <Icon className={cn("size-4", iconClassName)} />
      <span className={cn("font-semibold tabular-nums", valueClassName)}>{value}</span>
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
  const isWizard = character.className === Classes.WIZARD;
  const spellsToPreparePerDay = getSpellsToPreparePerDay(character);

  // Only spells the player prepared themselves count toward the budget — exclude
  // always-prepared, free long-rest casts, wizard rituals and cantrips (level 0).
  const preparedCount = character.spellsOnCharacters.filter(
    (soc) =>
      soc.isPrepared &&
      !soc.isAlwaysPrepared &&
      !soc.hasLongRestCast &&
      soc.spell.level > 0 &&
      !(isWizard && soc.spell.isRitual),
  ).length;
  const preparedDiff = spellsToPreparePerDay ? preparedCount - spellsToPreparePerDay.total : 0;
  const preparedTone =
    preparedDiff === 0 ? "text-emerald-500" : preparedDiff < 0 ? "text-amber-500" : "text-red-500";

  const groupBy = awaitedSearchParams.groupBy ?? SPELLS_GROUP_BY.LEVEL;
  const { level: levelParam, action } = awaitedSearchParams;
  const level =
    levelParam !== undefined && /^\d+$/.test(levelParam) ? parseInt(levelParam, 10) : undefined;
  const actionTypes = (action ? action.split(",") : []).filter((a): a is SpellAction =>
    (Object.values(SpellAction) as string[]).includes(a),
  );
  const { spells } = await getGroupedCharacterSpells({
    search: awaitedSearchParams.search,
    groupBy,
    characterId: character.id,
    isWizard,
    usableOnly: awaitedSearchParams.usable === "true",
    level,
    ritualOnly: awaitedSearchParams.ritual === "true",
    concentrationOnly: awaitedSearchParams.concentration === "true",
    actionTypes,
    hasLongRestCast: awaitedSearchParams.longRestCast === "true",
    canBeSwappedOnLongRest: awaitedSearchParams.swapLongRest === "true",
    canBeSwappedOnLevelUp: awaitedSearchParams.swapLevelUp === "true",
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
                  iconClassName={preparedTone}
                  valueClassName={preparedTone}
                  value={`${preparedCount} / ${spellsToPreparePerDay.total}`}
                  label="préparés"
                  definition={
                    <div className="flex max-w-[16rem] flex-col gap-1 text-sm">
                      <div>
                        Sorts préparés manuellement : {preparedCount} /{" "}
                        {spellsToPreparePerDay.total}.
                      </div>
                      <div className="text-muted-foreground">
                        Les sorts toujours préparés, les rituels (magicien) et les sorts mineurs ne
                        comptent pas.
                      </div>
                    </div>
                  }
                />
                <StatPill
                  icon={RefreshCcw}
                  value={spellsToPreparePerDay.dailyAmount}
                  label="échangeables / jour"
                  definition={<div>Combien de sorts peuvent être changés chaque jour</div>}
                />
                {preparedDiff !== 0 && (
                  <span className={cn("text-sm font-medium", preparedTone)}>
                    {preparedDiff < 0
                      ? `Il manque ${-preparedDiff} sort${-preparedDiff > 1 ? "s" : ""} à préparer`
                      : `${preparedDiff} sort${preparedDiff > 1 ? "s" : ""} préparé${
                          preparedDiff > 1 ? "s" : ""
                        } en trop`}
                  </span>
                )}
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
