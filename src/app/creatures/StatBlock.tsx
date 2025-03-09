"use client";

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
  getModifier,
  getDistanceInSquares,
  shortenAbilityName,
  translatedSenses,
  getHPAsString,
  getChallengeRatingAsFraction,
  translateSkill,
  typedSpells,
} from "@/utils/utils";
import { entries } from "remeda";
import { useState } from "react";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  BookOpenIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StatCell } from "@/app/creatures/StatCell";
import { ActionBlock } from "@/app/creatures/ActionBlock";

const typesMap = {
  attack: "A",
  save: "S",
  status: "E",
};

const CategoryTitle = ({ children }: { children: React.ReactNode }) => {
  return <h5 className="mb-2 text-neutral-300 underline">{children}</h5>;
};

export const StatBlock = ({
  creature,
  isCollapsible = true,
}: {
  creature: Creature;
  isCollapsible?: boolean;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const creatureSpells = (creature.spells ?? []).map((s) => typedSpells[s - 1]);

  return (
    <Card id={creature.id.toString()}>
      <CardHeader>
        <CardTitle className="flex justify-between">
          {creature.name}
          <div className="space-x-2">
            <Link
              href={`../statblocks/${creature.id}.png`}
              target="_blank"
              prefetch={false}
            >
              <Button variant="secondary" size="xs">
                <PhotoIcon className="size-6" />
              </Button>
            </Link>

            {isCollapsible && (
              <Button
                variant={isCollapsed ? "outline" : "secondary"}
                onClick={() => setIsCollapsed((cur) => !cur)}
                size="xs"
              >
                {isCollapsed ? (
                  <ArrowsPointingOutIcon className="size-6" />
                ) : (
                  <ArrowsPointingInIcon className="size-6" />
                )}
              </Button>
            )}
          </div>
        </CardTitle>
        {!isCollapsed && (
          <CardDescription
            className={clsx({ "border-b-2 pb-4": !isCollapsed })}
          >
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
        )}
      </CardHeader>
      {!isCollapsed && (
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-8">
              <StatCell
                name="CA"
                stat={creature.armorClass}
                isHighlighted
                isInline
              />
              <StatCell
                name="Vit."
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
                  name="Escal."
                  stat={getDistanceInSquares(creature.speed.climb)}
                  isInline
                />
              )}
              <StatCell name="PV" stat={getHPAsString(creature)} isInline />
              <StatCell
                name="FP"
                stat={getChallengeRatingAsFraction(creature.challengeRating)}
                isInline
              />
            </div>
            <div className="flex gap-8 border-t-2 pt-4">
              {entries(creature.abilities).map(([name, value]) => {
                const modifier = getModifier(value);
                return (
                  <StatCell
                    key={name}
                    name={shortenAbilityName(name)}
                    stat={
                      <span>
                        <span className="text-muted-foreground">{value}</span>{" "}
                        {Math.sign(modifier) === 1 ? `+${modifier}` : modifier}
                      </span>
                    }
                    isInline
                  />
                );
              })}
            </div>
            <div className="flex flex-col border-t-2 pt-4">
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
                  highlightClassName="text-purple-400"
                />
              )}
              {creature.vulnerabilities && (
                <StatCell
                  name="Vulnérabilités (x2)"
                  stat={creature.vulnerabilities.join(", ")}
                  highlightClassName="text-orange-400"
                />
              )}
              {creature.resistances && (
                <StatCell
                  name="Résistances (x0,5)"
                  stat={creature.resistances.join(", ")}
                  highlightClassName="text-orange-400"
                />
              )}
              {creature.immunities && (
                <StatCell
                  name="Immunités (x0)"
                  stat={creature.immunities.join(", ")}
                  highlightClassName="text-orange-400"
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
              <div className="flex flex-col border-t-2 pt-4">
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
            <div className="flex flex-col border-t-2 pt-4">
              <CategoryTitle>Actions</CategoryTitle>
              {creature.actions.map((action) => (
                <ActionBlock key={action.name} action={action} />
              ))}
            </div>

            {creature.legendaryActions && (
              <div className="flex flex-col border-t-2 pt-4">
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
              <div className="flex flex-col border-t-2 pt-4">
                <CategoryTitle>
                  Actions de repaire ({`1x par tour`})
                </CategoryTitle>
                {creature.lairActions.map((action) => (
                  <ActionBlock key={action.name} action={action} />
                ))}
              </div>
            )}

            {creature.bonusActions && (
              <div className="flex flex-col border-t-2 pt-4">
                <CategoryTitle>Actions bonus</CategoryTitle>
                {creature.bonusActions.map((action) => (
                  <ActionBlock key={action.name} action={action} />
                ))}
              </div>
            )}

            {creature.reactions && (
              <div className="flex flex-col border-t-2 pt-4">
                <CategoryTitle>Réactions</CategoryTitle>
                {creature.reactions.map((action) => (
                  <ActionBlock key={action.name} action={action} />
                ))}
              </div>
            )}

            {creature.spellStats && (
              <div className="flex flex-col border-t-2 pt-4">
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
                        <div>
                          <Link href={`/spells/${spell.id}`} target="_blank">
                            <BookOpenIcon className="size-5" />
                          </Link>
                        </div>
                        <div>{spell.level}</div>
                        <div className="min-w-[150px] text-muted-foreground">
                          {spell.name}
                        </div>
                        {spell.combat?.type && (
                          <div
                            className={clsx("min-w-[15px]", {
                              ["text-pink-500"]: spell.combat.type === "save",
                              ["text-red-500"]: spell.combat.type === "attack",
                              ["text-yellow-500"]:
                                spell.combat.type === "status",
                            })}
                          >
                            {typesMap[spell.combat.type]}
                          </div>
                        )}
                        {spell.combat?.summary && (
                          <div>{spell.combat.summary}</div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
