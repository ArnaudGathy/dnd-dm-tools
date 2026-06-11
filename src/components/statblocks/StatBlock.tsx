import { Creature } from "@/types/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { clsx } from "clsx";
import {
  getDistanceInSquares,
  shortenAbilityName,
  translatedSenses,
  getHPAsString,
  getChallengeRatingAsFraction,
  translateSkill,
} from "@/utils/utils";
import { entries, groupBy, isDefined, isNumber } from "remeda";
import Link from "next/link";
import { StatCell } from "@/components/statblocks/StatCell";
import { TagList } from "@/components/statblocks/TagList";
import { ActionBlock } from "@/components/statblocks/ActionBlock";
import { getSpellByIds } from "@/lib/api/spells";
import Abilities from "@/components/statblocks/Abilities";
import { cn } from "@/lib/utils";

const CategoryTitle = ({ children }: { children: React.ReactNode }) => {
  return <h5 className="text-neutral-300 underline md:mb-2">{children}</h5>;
};

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

  const blockClassName = "flex flex-col gap-2 border-t-2 pt-4 md:gap-0";
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
          <div className="flex flex-col gap-2">
            <div className="flex gap-8">
              <StatCell name="PV" stat={getHPAsString(creature)} isInline />
              <StatCell name="CA" stat={creature.armorClass} isHighlighted isInline />
              <StatCell
                name="FP"
                stat={getChallengeRatingAsFraction(creature.challengeRating)}
                isInline
              />
            </div>

            {creature.speed ? (
              <div className="flex gap-8">
                <StatCell
                  name="Marche"
                  stat={getDistanceInSquares(creature.speed.walk)}
                  isHighlighted
                  isInline
                />

                {creature.speed.swim && (
                  <StatCell name="Nage" stat={getDistanceInSquares(creature.speed.swim)} isInline />
                )}
                {creature.speed.fly && (
                  <StatCell name="Vol" stat={getDistanceInSquares(creature.speed.fly)} isInline />
                )}
                {creature.speed.climb && (
                  <StatCell
                    name="Escalade"
                    stat={getDistanceInSquares(creature.speed.climb)}
                    isInline
                  />
                )}
              </div>
            ) : (
              <StatCell name="Déplacements" stat="Aucun" isInline />
            )}

            {creature.behavior && (
              <StatCell name="Comportement" stat={creature.behavior} isInline />
            )}
          </div>

          {creature.abilities && (
            <div className="flex flex-wrap justify-between border-t-2 pt-4 md:justify-start md:gap-4">
              <Abilities abilities={creature.abilities} />
            </div>
          )}

          <div className={cn(blockClassName, "gap-3 md:gap-3")}>
            <CategoryTitle>Général</CategoryTitle>
            {creature.skills && (
              <StatCell
                name="Compétences"
                stat={
                  <TagList
                    items={entries(creature.skills).map((t) => `${translateSkill(t[0])} ${t[1]}`)}
                  />
                }
              />
            )}
            {creature.savingThrows && (
              <StatCell
                name="Jets de sauvegarde"
                stat={
                  <TagList
                    accentClassName="border-pink-400/50 text-pink-300"
                    items={entries(creature.savingThrows)
                      .map((t) => (t[1] ? `${shortenAbilityName(t[0])} ${t[1]}` : undefined))
                      .filter(isDefined)}
                  />
                }
              />
            )}
            {creature.vulnerabilities && (
              <StatCell
                name="Vulnérabilités (x2)"
                stat={
                  <TagList
                    items={creature.vulnerabilities}
                    colorizeDamage
                    accentClassName="border-orange-400/50 text-orange-300"
                  />
                }
              />
            )}
            {creature.resistances && (
              <StatCell
                name="Résistances (x0,5)"
                stat={
                  <TagList
                    items={creature.resistances}
                    colorizeDamage
                    accentClassName="border-emerald-400/50 text-emerald-300"
                  />
                }
              />
            )}
            {creature.immunities && (
              <StatCell
                name="Immunités (x0)"
                stat={
                  <TagList
                    items={creature.immunities}
                    colorizeDamage
                    accentClassName="border-emerald-400/50 text-emerald-300"
                  />
                }
              />
            )}

            {creature.languages && (
              <StatCell name="Langues" stat={<TagList items={creature.languages} />} />
            )}
            {creature.senses &&
              entries(creature.senses).map(([name, value]) => {
                let stat = value;
                if (
                  ["darkvision", "blindSight", "trueSight", "tremorsense"].includes(name) &&
                  typeof value === "string"
                ) {
                  stat = `${getDistanceInSquares(value)} cases`;
                }

                return <StatCell key={name} name={translatedSenses(name)} stat={stat} />;
              })}
          </div>

          {creature.traits && (
            <div className={blockClassName}>
              <CategoryTitle>Traits</CategoryTitle>
              {creature.traits.map((trait) => (
                <StatCell key={trait.name} name={trait.name} stat={trait.description} />
              ))}
            </div>
          )}
          <div className={blockClassName}>
            <CategoryTitle>Actions</CategoryTitle>
            {creature.actions.map((action) => (
              <ActionBlock key={action.name} action={action} />
            ))}
          </div>

          {creature.legendaryActions && (
            <div className={blockClassName}>
              <CategoryTitle>
                Actions légendaires ({`${creature.legendaryActionsSlots} par tour`})
              </CategoryTitle>
              {creature.legendaryActions.map((action) => (
                <ActionBlock key={action.name} action={action} />
              ))}
            </div>
          )}

          {creature.lairActions && (
            <div className={blockClassName}>
              <CategoryTitle>Actions de repaire ({`1x par tour`})</CategoryTitle>
              {creature.lairActions.map((action) => (
                <ActionBlock key={action.name} action={action} />
              ))}
            </div>
          )}

          {creature.bonusActions && (
            <div className={cn(blockClassName, "text-orange-400")}>
              <CategoryTitle>Actions bonus</CategoryTitle>
              {creature.bonusActions.map((action) => (
                <ActionBlock key={action.name} action={action} />
              ))}
            </div>
          )}

          {creature.reactions && (
            <div className={cn(blockClassName, "text-purple-400")}>
              <CategoryTitle>Réactions</CategoryTitle>
              {creature.reactions.map((action) => (
                <ActionBlock key={action.name} action={action} />
              ))}
            </div>
          )}

          {creature.spellStats && (
            <div className={blockClassName}>
              <CategoryTitle>Sorts</CategoryTitle>
              <div className="mb-2 flex flex-wrap items-center gap-x-8 gap-y-2">
                <StatCell
                  name="Attaque des sorts"
                  stat={`+${creature.spellStats.attackMod}`}
                  isInline
                  isHighlighted
                />
                <StatCell
                  name="DD des sorts"
                  stat={creature.spellStats.spellDC}
                  isInline
                  isHighlighted
                />
                {creature.spellStats.slots && (
                  <div className="flex items-center gap-2">
                    <span className="mr-1 text-muted-foreground">Emplacements</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {entries(creature.spellStats.slots).map(([level, slots]) => (
                        <span
                          key={level}
                          className="inline-flex items-center gap-1 rounded border border-neutral-700 px-1.5 py-0.5 text-sm"
                        >
                          <span className="text-sky-500">N{level}</span>
                          <span className="font-semibold">×{slots}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {!!creature.spells && (
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
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
