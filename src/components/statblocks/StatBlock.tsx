import { Creature } from "@/types/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { clsx } from "clsx";
import {
  getDistanceInSquares,
  translatedSenses,
  getHPAsString,
  getChallengeRatingAsFraction,
  translateSkill,
} from "@/utils/utils";
import { entries, groupBy, isNumber } from "remeda";
import Link from "next/link";
import { Feather, Footprints, Heart, Mountain, Shield, Skull, Waves } from "lucide-react";
import { TagList } from "@/components/statblocks/TagList";
import { StatSection } from "@/components/statblocks/StatSection";
import { NamedEntry, statLabelClassName } from "@/components/statblocks/NamedEntry";
import { Pill } from "@/components/statblocks/Pill";
import { VitalStat } from "@/components/statblocks/VitalStat";
import { ActionBlock } from "@/components/statblocks/ActionBlock";
import { getSpellByIds } from "@/lib/api/spells";
import Abilities from "@/components/statblocks/Abilities";
import { cn } from "@/lib/utils";

const isNonEmptyArray = <T,>(value: T[] | undefined | null): value is T[] =>
  Array.isArray(value) && value.length > 0;
const isNonEmptyRecord = (value: object | undefined | null): boolean =>
  !!value && Object.keys(value).length > 0;

export const StatBlock = async ({ creature }: { creature: Creature }) => {
  const creatureSpellsFromDb = await getSpellByIds((creature.spells ?? []).map((s) => s.id));
  const creatureSpells = creatureSpellsFromDb.map((s) => {
    const spell = creature.spells?.find((sp) => sp.id === s.id);
    return {
      ...s,
      ...(spell ?? {}),
    };
  });
  const spellsByLevel = entries(groupBy(creatureSpells, (s) => s.level)).sort(
    ([a], [b]) => Number(a) - Number(b),
  );

  const linkToAideDD =
    isNumber(creature.id) || creature.id.includes("_")
      ? undefined
      : `https://www.aidedd.org/public/monster/${creature.id}`;

  return (
    <Card id={creature.id.toString()}>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{creature.name}</span>
          {linkToAideDD && (
            <Link
              href={linkToAideDD}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-xs text-muted-foreground underline"
            >
              AideDD
            </Link>
          )}
        </CardTitle>
        <CardDescription>
          {creature.type} de taille{" "}
          <span
            className={clsx("text-base", {
              "text-primary": !["TP", "P", "M", "Medium", "Small", "Tiny"].includes(creature.size),
            })}
          >
            {creature.size}
          </span>
          , {creature.alignment ?? "Sans alignement"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <VitalStat
                label="CA"
                value={creature.armorClass}
                icon={Shield}
                iconClassName="text-sky-400"
                valueClassName="text-sky-400"
              />
              <VitalStat
                label="PV"
                value={getHPAsString(creature)}
                icon={Heart}
                iconClassName="text-red-400"
                valueClassName="text-red-400"
              />
              <VitalStat
                label="FP"
                value={getChallengeRatingAsFraction(creature.challengeRating)}
                icon={Skull}
                iconClassName="text-amber-400"
                valueClassName="text-amber-400"
              />
              {creature.speed ? (
                <>
                  <VitalStat
                    label="Marche"
                    value={getDistanceInSquares(creature.speed.walk)}
                    icon={Footprints}
                  />
                  {creature.speed.swim && (
                    <VitalStat
                      label="Nage"
                      value={getDistanceInSquares(creature.speed.swim)}
                      icon={Waves}
                    />
                  )}
                  {creature.speed.fly && (
                    <VitalStat
                      label="Vol"
                      value={getDistanceInSquares(creature.speed.fly)}
                      icon={Feather}
                    />
                  )}
                  {creature.speed.climb && (
                    <VitalStat
                      label="Escalade"
                      value={getDistanceInSquares(creature.speed.climb)}
                      icon={Mountain}
                    />
                  )}
                </>
              ) : (
                <VitalStat label="Déplacement" value="Aucun" icon={Footprints} />
              )}
            </div>

            {creature.behavior && <NamedEntry name="Comportement">{creature.behavior}</NamedEntry>}
          </div>

          {(creature.abilities || isNonEmptyRecord(creature.skills)) && (
            <div className="flex flex-col gap-3 border-t-2 pt-4">
              {creature.abilities && (
                <div className="flex flex-wrap gap-2">
                  <Abilities abilities={creature.abilities} savingThrows={creature.savingThrows} />
                </div>
              )}
              {isNonEmptyRecord(creature.skills) && (
                <NamedEntry name="Compétences">
                  <TagList
                    items={entries(creature.skills!).map((t) => `${translateSkill(t[0])} ${t[1]}`)}
                  />
                </NamedEntry>
              )}
            </div>
          )}

          {(isNonEmptyArray(creature.vulnerabilities) ||
            isNonEmptyArray(creature.resistances) ||
            isNonEmptyArray(creature.immunities) ||
            isNonEmptyArray(creature.languages) ||
            isNonEmptyRecord(creature.senses)) && (
            <StatSection title="Général" contentClassName="gap-3">
              {isNonEmptyArray(creature.vulnerabilities) && (
                <NamedEntry name="Vulnérabilités (x2)">
                  <TagList
                    items={creature.vulnerabilities}
                    colorizeDamage
                    accentClassName="border-orange-400/50 text-orange-300"
                  />
                </NamedEntry>
              )}
              {isNonEmptyArray(creature.resistances) && (
                <NamedEntry name="Résistances (x0,5)">
                  <TagList
                    items={creature.resistances}
                    colorizeDamage
                    accentClassName="border-emerald-400/50 text-emerald-300"
                  />
                </NamedEntry>
              )}
              {isNonEmptyArray(creature.immunities) && (
                <NamedEntry name="Immunités (x0)">
                  <TagList
                    items={creature.immunities}
                    colorizeDamage
                    accentClassName="border-emerald-400/50 text-emerald-300"
                  />
                </NamedEntry>
              )}

              {isNonEmptyArray(creature.languages) && (
                <NamedEntry name="Langues">
                  <TagList items={creature.languages} />
                </NamedEntry>
              )}
              {isNonEmptyRecord(creature.senses) &&
                entries(creature.senses!).map(([name, value]) => {
                  let stat = value;
                  if (
                    ["darkvision", "blindSight", "trueSight", "tremorsense"].includes(name) &&
                    typeof value === "string"
                  ) {
                    stat = `${getDistanceInSquares(value)} cases`;
                  }

                  return (
                    <NamedEntry key={name} name={translatedSenses(name)}>
                      {stat}
                    </NamedEntry>
                  );
                })}
            </StatSection>
          )}

          {isNonEmptyArray(creature.traits) && (
            <StatSection title="Traits">
              {creature.traits.map((trait) => (
                <NamedEntry key={trait.name} name={trait.name}>
                  {trait.description}
                </NamedEntry>
              ))}
            </StatSection>
          )}

          {isNonEmptyArray(creature.actions) && (
            <StatSection title="Actions" accentClassName="text-green-400">
              {creature.actions.map((action) => (
                <ActionBlock key={action.name} action={action} />
              ))}
            </StatSection>
          )}

          {isNonEmptyArray(creature.legendaryActions) && (
            <StatSection
              title="Actions légendaires"
              subtitle={`${creature.legendaryActionsSlots} par tour`}
              accentClassName="text-amber-400"
            >
              {creature.legendaryActions.map((action) => (
                <ActionBlock key={action.name} action={action} />
              ))}
            </StatSection>
          )}

          {isNonEmptyArray(creature.lairActions) && (
            <StatSection
              title="Actions de repaire"
              subtitle="1x par tour"
              accentClassName="text-teal-400"
            >
              {creature.lairActions.map((action) => (
                <ActionBlock key={action.name} action={action} />
              ))}
            </StatSection>
          )}

          {isNonEmptyArray(creature.bonusActions) && (
            <StatSection title="Actions bonus" accentClassName="text-orange-400">
              {creature.bonusActions.map((action) => (
                <ActionBlock key={action.name} action={action} />
              ))}
            </StatSection>
          )}

          {isNonEmptyArray(creature.reactions) && (
            <StatSection title="Réactions" accentClassName="text-purple-400">
              {creature.reactions.map((action) => (
                <ActionBlock key={action.name} action={action} />
              ))}
            </StatSection>
          )}

          {creature.spellStats && (
            <StatSection title="Sorts" accentClassName="text-sky-400">
              <div className="mb-2 flex flex-wrap items-center gap-x-8 gap-y-2">
                <div className="flex items-center gap-2">
                  <span className={statLabelClassName}>Attaque des sorts</span>
                  <span className="font-semibold text-sky-500">
                    +{creature.spellStats.attackMod}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={statLabelClassName}>DD des sorts</span>
                  <span className="font-semibold text-sky-500">{creature.spellStats.spellDC}</span>
                </div>
                {isNonEmptyRecord(creature.spellStats.slots) && (
                  <div className="flex items-center gap-2">
                    <span className={cn(statLabelClassName, "mr-1")}>Emplacements</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {entries(creature.spellStats.slots!).map(([level, slots]) => (
                        <Pill key={level} className="gap-1 px-2 py-0.5">
                          <span className="text-sky-500">N{level}</span>
                          <span className="font-semibold">×{slots}</span>
                        </Pill>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {isNonEmptyArray(creature.spells) && (
                <div className="flex flex-col gap-3">
                  {spellsByLevel.map(([level, spells]) => (
                    <div key={level} className="flex gap-3">
                      <span className="mt-0.5 w-4 shrink-0 text-sm font-semibold uppercase tracking-wide text-sky-500">
                        {`N${level}`}
                      </span>
                      <div className="flex flex-1 flex-col gap-1">
                        {spells.map((spell) => (
                          <div
                            key={spell.id}
                            className="flex flex-col gap-x-3 md:flex-row md:items-baseline"
                          >
                            <Link
                              href={`/spells/${spell.id}`}
                              target="_blank"
                              className="w-[180px] shrink-0 truncate text-muted-foreground underline"
                            >
                              {spell.name}
                            </Link>
                            {spell.summary && <span className="text-sm">{spell.summary}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </StatSection>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
