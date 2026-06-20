import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/components/ui/Link";
import { entries } from "remeda";
import { SPELLS_GROUP_BY, SpellWithFlags } from "@/lib/api/spells";
import { SpellStatusButton } from "@/app/(with-nav)/spells/[id]/SpellStatusButton";
import DeleteSpellButton from "@/app/(with-nav)/characters/[id]/spells/DeleteSpellButton";
import SpellsSettings from "@/app/(with-nav)/characters/[id]/spells/SpellsSettings";
import { CharacterById, cn } from "@/lib/utils";
import { Classes, SpellAction } from "@prisma/client";
import { MessageCircleMore, RefreshCcw, Sparkle, WandSparkles } from "lucide-react";
import { isSpellUsable } from "@/app/(with-nav)/characters/[id]/spells/spellStatus";

// Named tag for the two notable casting times — a plain Action gets no tag.
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

export const SpellList = ({
  spellsGroupedBy,
  groupBy,
  character,
  isEditMode = false,
}: {
  character: CharacterById;
  spellsGroupedBy: Record<string, SpellWithFlags[]>;
  groupBy: SPELLS_GROUP_BY;
  isEditMode?: boolean;
}) => {
  const isWizard = character.className === Classes.WIZARD;
  const byLevel = groupBy === SPELLS_GROUP_BY.LEVEL;

  const spellEntries = entries(spellsGroupedBy).toSorted(([a], [b]) =>
    byLevel ? parseInt(a, 10) - parseInt(b, 10) : a.localeCompare(b, "fr"),
  );

  if (spellEntries.length === 0) {
    return <div className="text-muted-foreground">Aucun sort à afficher.</div>;
  }

  return (
    <div className="columns-1 gap-4 [column-gap:1rem] md:columns-2 2xl:columns-4">
      {spellEntries.map(([property, spells]) => (
        <Card key={property} className="mb-4 break-inside-avoid">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-lg">
              {byLevel ? `Niveau ${property}` : property.toUpperCase()}
            </CardTitle>
            <Badge variant="outline" className="shrink-0 font-normal tabular-nums">
              {spells.length}
            </Badge>
          </CardHeader>
          <CardContent className="px-2 pb-2">
            <ul className="flex flex-col">
              {spells.map((spell) => {
                const usable = isSpellUsable(spell, isWizard);
                const actionTag = spell.actionType ? ACTION_TAG[spell.actionType] : undefined;
                const swap = spell.canBeSwappedOnLongRest
                  ? { className: "text-rose-500", title: "Échangeable / long repos" }
                  : spell.canBeSwappedOnLevelUp
                    ? { className: "text-purple-500", title: "Échangeable / level up" }
                    : undefined;

                return (
                  <li key={spell.id} className="flex items-center gap-2 rounded-md px-2 py-1.5">
                    <SpellStatusButton spell={spell} character={character} />

                    <Link
                      href={`/spells/${spell.id}`}
                      className={cn(
                        "flex-1 truncate text-sm no-underline transition-colors hover:text-foreground hover:underline",
                        usable ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {spell.name}
                    </Link>

                    {isEditMode ? (
                      <span className="flex shrink-0 items-center gap-1">
                        <SpellsSettings
                          characterId={character.id}
                          spellId={spell.id}
                          isAlwaysPrepared={spell.isAlwaysPrepared}
                          hasLongRestCast={spell.hasLongRestCast}
                          canBeSwappedOnLongRest={spell.canBeSwappedOnLongRest}
                          canBeSwappedOnLevelUp={spell.canBeSwappedOnLevelUp}
                          isPrepared={spell.isPrepared}
                        />
                        <DeleteSpellButton spell={spell} characterId={character.id} />
                      </span>
                    ) : (
                      <span className="flex shrink-0 items-center gap-1.5">
                        {spell.concentration && (
                          <MessageCircleMore
                            className="size-4 text-yellow-500"
                            aria-label="Concentration"
                          />
                        )}
                        {spell.isRitual && (
                          <Sparkle className="size-4 text-emerald-500" aria-label="Rituel" />
                        )}
                        {spell.hasLongRestCast && (
                          <WandSparkles
                            className="size-4 text-lime-500"
                            aria-label="1 lancement / long repos"
                          />
                        )}
                        {swap && (
                          <RefreshCcw
                            className={cn("size-4", swap.className)}
                            aria-label={swap.title}
                          />
                        )}
                        {actionTag && (
                          <span
                            className={cn(
                              "rounded px-1.5 py-0.5 text-[10px] font-medium",
                              actionTag.className,
                            )}
                          >
                            {actionTag.label}
                          </span>
                        )}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
