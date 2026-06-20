import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/components/ui/Link";
import { entries } from "remeda";
import { SPELLS_GROUP_BY, SpellWithFlags } from "@/lib/api/spells";
import { SpellStatusButton } from "@/app/(with-nav)/spells/[id]/SpellStatusButton";
import DeleteSpellButton from "@/app/(with-nav)/characters/[id]/spells/DeleteSpellButton";
import SpellsSettings from "@/app/(with-nav)/characters/[id]/spells/SpellsSettings";
import { CharacterById, cn } from "@/lib/utils";
import { Classes } from "@prisma/client";
import {
  ACTION_TAGS,
  FACT_ICONS,
  isSpellUsable,
  PLANNING_ACCENT,
  PLANNING_MARKERS,
} from "@/app/(with-nav)/characters/[id]/spells/spellStatus";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { ReactNode } from "react";

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

                // Each marker carries its own explanation popover. Recessive grey
                // character config first, then the colourful /spells fact language.
                const markers: { key: string; trigger: ReactNode; explanation: string }[] = [];

                PLANNING_MARKERS.forEach(({ flag, Icon, label, explanation }) => {
                  if (spell[flag]) {
                    markers.push({
                      key: flag,
                      trigger: (
                        <Icon className={cn("size-4", PLANNING_ACCENT)} aria-label={label} />
                      ),
                      explanation,
                    });
                  }
                });

                if (spell.concentration) {
                  const fact = FACT_ICONS.concentration;
                  markers.push({
                    key: "concentration",
                    trigger: (
                      <fact.Icon className={cn("size-4", fact.className)} aria-label={fact.label} />
                    ),
                    explanation: fact.explanation,
                  });
                }
                if (spell.isRitual) {
                  const fact = FACT_ICONS.ritual;
                  markers.push({
                    key: "ritual",
                    trigger: (
                      <fact.Icon className={cn("size-4", fact.className)} aria-label={fact.label} />
                    ),
                    explanation: fact.explanation,
                  });
                }
                const actionTag = spell.actionType ? ACTION_TAGS[spell.actionType] : undefined;
                if (actionTag) {
                  markers.push({
                    key: "action",
                    trigger: (
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[10px] font-medium",
                          actionTag.className,
                        )}
                      >
                        {actionTag.label}
                      </span>
                    ),
                    explanation: actionTag.explanation,
                  });
                }

                return (
                  <li
                    key={spell.id}
                    className="group flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted"
                  >
                    <SpellStatusButton spell={spell} character={character} />

                    <Link
                      href={`/spells/${spell.id}`}
                      className={cn(
                        "flex-1 truncate text-sm no-underline transition-colors group-hover:text-foreground",
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
                      markers.length > 0 && (
                        <span className="flex shrink-0 items-center gap-1.5">
                          {markers.map(({ key, trigger, explanation }) => (
                            <PopoverComponent
                              key={key}
                              className="flex items-center"
                              definition={
                                <div className="max-w-[16rem] text-sm">{explanation}</div>
                              }
                            >
                              {trigger}
                            </PopoverComponent>
                          ))}
                        </span>
                      )
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
