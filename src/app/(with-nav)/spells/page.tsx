import { SPELLS_GROUP_BY, getAllSpells } from "@/lib/api/spells";
import { Badge } from "@/components/ui/badge";
import { entries } from "remeda";
import { getSessionData } from "@/lib/utils";
import { getAllFilteredCharacters, getFilteredCharactersByOwner } from "@/lib/api/characters";
import { SPELL_SCHOOLS } from "@/constants/maps";
import { Classes, SpellAction } from "@prisma/client";
import SpellsListFilters from "./SpellsListFilters";
import SpellPicker, { PickerCharacter } from "./SpellPicker";

export default async function AllSpellsList({
  searchParams,
}: {
  searchParams: Promise<{
    groupBy?: SPELLS_GROUP_BY;
    ritual?: string;
    concentration?: string;
    action?: string;
    level?: string;
    school?: string;
    search?: string;
    class?: string;
  }>;
}) {
  const {
    groupBy = SPELLS_GROUP_BY.LEVEL,
    ritual,
    concentration,
    action,
    level: levelParam,
    school: schoolParam,
    search,
    class: classParam,
  } = await searchParams;
  const ritualOnly = ritual === "true";
  const concentrationOnly = concentration === "true";
  const actionTypes = (action ? action.split(",") : []).filter((a): a is SpellAction =>
    (Object.values(SpellAction) as string[]).includes(a),
  );
  const levels = (levelParam ? levelParam.split(",") : [])
    .filter((l) => /^\d+$/.test(l))
    .map((l) => parseInt(l, 10));
  const schools = (schoolParam ? schoolParam.split(",") : []).filter((s) =>
    (SPELL_SCHOOLS as readonly string[]).includes(s),
  );
  const spellClass =
    classParam && (Object.values(Classes) as string[]).includes(classParam)
      ? (classParam as Classes)
      : undefined;
  const spells = await getAllSpells({
    groupBy,
    ritualOnly,
    concentrationOnly,
    actionTypes,
    levels,
    schools,
    search,
    spellClass,
  });

  const isGrouped = groupBy !== SPELLS_GROUP_BY.NONE;
  const groups = entries(spells).toSorted(([a], [b]) =>
    groupBy === SPELLS_GROUP_BY.LEVEL ? parseInt(a, 10) - parseInt(b, 10) : a.localeCompare(b),
  );
  const totalCount = Object.values(spells).reduce((sum, list) => sum + list.length, 0);

  // Characters the user can add spells to: their own (and DM'd) for players, all
  // for super admins — same scoping as the /characters list.
  const { userMail, isSuperAdmin } = await getSessionData();
  const characterRecords = isSuperAdmin
    ? await getAllFilteredCharacters({})
    : await getFilteredCharactersByOwner({ ownerEmail: userMail });
  const characters: PickerCharacter[] = characterRecords.map((character) => ({
    id: character.id,
    name: character.name,
    className: character.className,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="flex scroll-m-20 items-center gap-2 text-2xl font-semibold leading-none tracking-tight">
          Sorts
          <Badge variant="secondary" className="font-normal tabular-nums">
            {totalCount}
          </Badge>
        </h1>
        <SpellsListFilters />
      </div>

      <SpellPicker
        groups={groups}
        groupBy={groupBy}
        isGrouped={isGrouped}
        characters={characters}
      />
    </div>
  );
}
