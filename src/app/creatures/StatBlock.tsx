import { Creature } from "@/types/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { clsx } from "clsx";
import {
  getDistanceInSquares,
  shortenAbilityName,
  translatedSenses,
  getHPAsString,
  getChallengeRatingAsFraction,
  translateSkill,
} from "@/utils/utils";
import { entries } from "remeda";
import Link from "next/link";
import { StatCell } from "@/app/creatures/StatCell";
import { ActionBlock } from "@/app/creatures/ActionBlock";
import { getSpellByIds } from "@/lib/api/spells";
import Abilities from "@/app/creatures/Abilities";
import { cn } from "@/lib/utils";

const CategoryTitle = ({ children }: { children: React.ReactNode }) => {
  return <h5 className="text-neutral-300 underline md:mb-2">{children}</h5>;
};

export const StatBlock = async ({ creature }: { creature: Creature }) => {
  const creatureSpellsFromDb = await getSpellByIds(
    (creature.spells ?? []).map((s) => s.id),
  );
  const creatureSpells = creatureSpellsFromDb.map((s, index) => ({
    ...s,
    ...(creature.spells?.[index] ?? {}),
  }));

  const blockClassName = "flex flex-col gap-2 border-t-2 pt-4 md:gap-0";

  return (
    <Card id={creature.id.toString()}>
      <CardHeader>
        <CardTitle className="flex justify-between">{creature.name}</CardTitle>
        <CardDescription>
          {creature.type} de taille{" "}
          <span
            className={clsx("text-base", {
              "text-primary": !["TP", "P", "M"].includes(creature.size),
            })}
          >
            {creature.size}
          </span>
          , {creature.alignment}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex gap-8">
              <StatCell name="PV" stat={getHPAsString(creature)} isInline />
              <StatCell
                name="CA"
                stat={creature.armorClass}
                isHighlighted
                isInline
              />
              <StatCell
                name="FP"
                stat={getChallengeRatingAsFraction(creature.challengeRating)}
                isInline
              />
            </div>

            <div className="flex gap-8">
              <StatCell
                name="Marche"
                stat={getDistanceInSquares(creature.speed.walk)}
                isHighlighted
                isInline
              />

              {creature.speed.swim && (
                <StatCell
                  name="Nage"
                  stat={getDistanceInSquares(creature.speed.swim)}
                  isInline
                />
              )}
              {creature.speed.fly && (
                <StatCell
                  name="Vol"
                  stat={getDistanceInSquares(creature.speed.fly)}
                  isInline
                />
              )}
              {creature.speed.climb && (
                <StatCell
                  name="Escalade"
                  stat={getDistanceInSquares(creature.speed.climb)}
                  isInline
                />
              )}
            </div>
          </div>

          <div className="flex flex-wrap justify-between border-t-2 pt-4 md:justify-start md:gap-4">
            <Abilities abilities={creature.abilities} />
          </div>

          <div className={blockClassName}>
            <CategoryTitle>Général</CategoryTitle>
            {creature.skills && (
              <StatCell
                name="Compétences"
                stat={entries(creature.skills)
                  .map((t) => `${translateSkill(t[0])} ${t[1]}`)
                  .join(", ")}
              />
            )}
            {creature.savingThrows && (
              <StatCell
                name="Jets de sauvegarde"
                stat={entries(creature.savingThrows)
                  .map((t) => `${shortenAbilityName(t[0])} ${t[1]}`)
                  .join(", ")}
                highlightClassName="text-pink-400"
              />
            )}
            {creature.vulnerabilities && (
              <StatCell
                name="Vulnérabilités (x2)"
                stat={creature.vulnerabilities.join(", ")}
                highlightClassName="text-emerald-400"
              />
            )}
            {creature.resistances && (
              <StatCell
                name="Résistances (x0,5)"
                stat={creature.resistances.join(", ")}
                highlightClassName="text-emerald-400"
              />
            )}
            {creature.immunities && (
              <StatCell
                name="Immunités (x0)"
                stat={creature.immunities.join(", ")}
                highlightClassName="text-emerald-400"
              />
            )}

            {creature.languages && (
              <StatCell name="Langues" stat={creature.languages.join(", ")} />
            )}
            {creature.senses &&
              entries(creature.senses).map(([name, value]) => {
                let stat = value;
                if (
                  ["darkvision", "blindSight", "trueSight"].includes(name) &&
                  typeof value === "string"
                ) {
                  stat = `${getDistanceInSquares(value)} cases`;
                }

                return (
                  <StatCell
                    key={name}
                    name={translatedSenses(name)}
                    stat={stat}
                  />
                );
              })}
          </div>

          {creature.traits && (
            <div className={blockClassName}>
              <CategoryTitle>Traits</CategoryTitle>
              {creature.traits.map((trait) => (
                <StatCell
                  key={trait.name}
                  name={trait.name}
                  stat={trait.description}
                />
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
                Actions légendaires (
                {`${creature.legendaryActionsSlots} par tour`})
              </CategoryTitle>
              {creature.legendaryActions.map((action) => (
                <ActionBlock key={action.name} action={action} />
              ))}
            </div>
          )}

          {creature.lairActions && (
            <div className={blockClassName}>
              <CategoryTitle>
                Actions de repaire ({`1x par tour`})
              </CategoryTitle>
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
              <div className="mb-2 flex gap-8">
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
                {creature.spellStats.slots &&
                  entries(creature.spellStats.slots).map(([level, slots]) => (
                    <StatCell
                      key={level}
                      name={`Slots ${level}`}
                      stat={slots}
                      isInline
                    />
                  ))}
              </div>
              {!!creature.spells &&
                creatureSpells.map((spell) => {
                  if (!spell) {
                    return null;
                  }

                  return (
                    <div key={spell.id} className="flex items-center gap-2">
                      <div className="text-sky-500">{`${spell.level}`}</div>
                      <Link
                        href={`/spells/${spell.id}?v=${spell.version}`}
                        target="_blank"
                        className="w-[175px] overflow-hidden truncate text-muted-foreground underline"
                      >
                        {spell.name}
                      </Link>
                      {spell.summary && <span>{spell.summary}</span>}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
