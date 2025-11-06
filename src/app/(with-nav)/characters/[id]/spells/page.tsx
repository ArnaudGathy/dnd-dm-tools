import SpellsFilters, {
  SpellsSearchParams,
} from "@/app/(with-nav)/characters/[id]/spells/SpellsFilters";
import SpellsGrouped from "@/app/(with-nav)/spells/[id]/SpellsGrouped";
import { getValidCharacter } from "@/lib/utils";
import AddSpellForm from "@/app/(with-nav)/characters/[id]/spells/AddSpellForm";
import { Separator } from "@/components/ui/separator";
import EditModeButton from "@/app/(with-nav)/characters/[id]/spells/EditModeButton";

import { getSpellsToPreparePerDay } from "@/utils/stats/spells";
import {
  Circle,
  CopyCheck,
  Info,
  RefreshCcw,
  Sparkles,
  SquareCheckBig,
  SquarePlus,
  WandSparkles,
} from "lucide-react";
import StatCard from "@/app/(with-nav)/characters/[id]/(sheet)/StatCard";
import PopoverComponent from "@/components/ui/PopoverComponent";

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

          <div className="flex gap-2">
            <PopoverComponent
              definition={
                <div>
                  <div className="flex flex-col text-sm">
                    <div className="text-base font-bold">Mode édition</div>
                    <div className="text-muted-foreground">Il permet de</div>
                    <div>Ajouter un sort (champs de texte qui apparait)</div>
                    <div>Supprimer un sort (icône de croix)</div>
                    <div>Configurer un sort (icône de rouage)</div>

                    <Separator className="my-2" />

                    <div className="text-base font-bold">Icônes</div>
                    <div className="text-muted-foreground">
                      Cliquer pour préparer / oublier un sort.
                    </div>
                    <div className="flex items-center gap-2">
                      <SquarePlus className="size-4" /> Sort non préparé
                    </div>
                    <div className="flex items-center gap-2">
                      <SquareCheckBig className="size-4" /> Sort préparé
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4" /> Sort rituel
                    </div>
                    <div className="flex items-center gap-2">
                      <WandSparkles className="size-4" /> 1 utilisation sans emplacement par long
                      repos
                    </div>

                    <Separator className="my-2" />

                    <div className="text-base font-bold">Couleurs</div>
                    <div className="text-muted-foreground">
                      Un sort coloré veut dire qu&apos;il peut-être utilisé.
                    </div>
                    <div className="flex items-center gap-2">
                      <Circle className="size-4 text-sky-500" /> Sort préparé (inclus dans le compte
                      total)
                    </div>
                    <div className="flex items-center gap-2">
                      <Circle className="size-4 text-amber-500" /> Sort toujours préparé
                    </div>
                    <div className="flex items-center gap-2">
                      <Circle className="size-4 text-purple-500" /> Sort échangeable lors d&apos;un
                      lvl up
                    </div>
                    <div className="flex items-center gap-2">
                      <Circle className="size-4 text-rose-500" /> Sort échangeable lors d&apos;un
                      long repos
                    </div>
                    <div className="flex items-center gap-2">
                      <Circle className="size-4 text-emerald-500" /> Sort rituel
                    </div>
                  </div>
                </div>
              }
            >
              <Info className="size-5 text-blue-400" />
            </PopoverComponent>
            <EditModeButton />
          </div>
        </div>
        {isEditMode && <AddSpellForm characterId={id} />}

        <SpellsFilters />
      </div>

      {!isCollapsed && (
        <div className="flex gap-4">
          {!!spellsToPreparePerDay && (
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
                definition={<div>Combien de sorts peuvent être changés chaque jour</div>}
              />
            </div>
          )}
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
