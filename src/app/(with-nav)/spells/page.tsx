import { SPELLS_GROUP_BY, getAllSpells } from "@/lib/api/spells";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/components/ui/Link";
import { entries } from "remeda";
import { cn } from "@/lib/utils";
import { SPELL_SCHOOLS } from "@/constants/maps";
import { Classes, SpellAction } from "@prisma/client";
import SpellsListFilters from "./SpellsListFilters";
import { Sparkle, MessageCircleMore } from "lucide-react";

// Named tag shown for the two notable casting times — a standard Action gets no
// tag since most spells are basic actions (only the exceptions are flagged).
const ACTION_TAG: Partial<Record<SpellAction, { label: string; className: string }>> = {
  [SpellAction.BONUS_ACTION]: {
    label: "Bonus",
    className: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  },
  [SpellAction.REACTION]: {
    label: "Réaction",
    className: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  },
};

type SpellRowData = {
  id: string;
  name: string;
  level: number;
  isRitual: boolean;
  concentration: boolean;
  actionType: SpellAction | null;
};

// A single clickable spell row (level badge · name · concentration/ritual icons ·
// casting-time tag). Shared by the grouped cards and the flat (ungrouped) list.
function SpellRow({ spell }: { spell: SpellRowData }) {
  const actionTag = spell.actionType ? ACTION_TAG[spell.actionType] : undefined;
  const icons = [
    spell.concentration
      ? { Icon: MessageCircleMore, className: "text-yellow-500", title: "Concentration" }
      : undefined,
    spell.isRitual ? { Icon: Sparkle, className: "text-emerald-500", title: "Rituel" } : undefined,
  ].filter((icon) => icon !== undefined);

  return (
    <li className="break-inside-avoid">
      <Link
        href={`/spells/${spell.id}`}
        className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm no-underline transition-colors hover:bg-muted"
      >
        <span className="min-w-[1.75rem] shrink-0 rounded bg-muted px-1.5 py-0.5 text-center font-mono text-xs text-muted-foreground transition-colors group-hover:bg-background group-hover:text-foreground">
          {spell.level}
        </span>
        <span className="flex-1 truncate text-muted-foreground transition-colors group-hover:text-foreground">
          {spell.name}
        </span>
        {icons.map(({ Icon, className, title }) => (
          <span key={title} title={title} className="flex shrink-0">
            <Icon className={cn("size-4", className)} />
          </span>
        ))}
        {actionTag && (
          <span
            className={cn(
              "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium",
              actionTag.className,
            )}
          >
            {actionTag.label}
          </span>
        )}
      </Link>
    </li>
  );
}

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

      {groups.length === 0 ? (
        <div className="text-muted-foreground">Aucun sort à afficher.</div>
      ) : isGrouped ? (
        <div className="sm:columns-2 lg:columns-3 gap-4 [column-gap:1rem] 2xl:columns-4">
          {groups.map(([groupingValue, values]) => (
            <Card key={groupingValue} className="mb-4 break-inside-avoid">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg">
                  {groupBy === SPELLS_GROUP_BY.LEVEL
                    ? `Niveau ${groupingValue}`
                    : groupingValue.toUpperCase()}
                </CardTitle>
                <Badge variant="outline" className="shrink-0 font-normal tabular-nums">
                  {values.length}
                </Badge>
              </CardHeader>
              <CardContent className="px-2 pb-2">
                <ul className="flex flex-col">
                  {values.map((spell) => (
                    <SpellRow key={spell.id} spell={spell} />
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Ungrouped: one flat, alphabetical list flowing across columns.
        <Card>
          <CardContent className="px-2 pb-2 pt-6">
            <ul className="sm:columns-2 lg:columns-3 [column-gap:0.5rem] 2xl:columns-4">
              {groups[0][1].map((spell) => (
                <SpellRow key={spell.id} spell={spell} />
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
