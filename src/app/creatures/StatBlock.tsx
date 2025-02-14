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
  replaceMetersWithSquares,
} from "@/utils/utils";
import { entries } from "remeda";
import { useState } from "react";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StatCell } from "@/app/creatures/StatCell";

export const StatBlock = ({
  creature,
  isCollapsible = true,
}: {
  creature: Creature;
  isCollapsible?: boolean;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
              <StatCell name="CA" stat={creature.armorClass} isHighlighted />
              <StatCell
                name="Vit."
                stat={getDistanceInSquares(creature.speed.walk)}
                isHighlighted
              />

              {creature.speed.swim && (
                <StatCell
                  name="Nage"
                  stat={getDistanceInSquares(creature.speed.swim)}
                />
              )}
              {creature.speed.fly && (
                <StatCell
                  name="Vol"
                  stat={getDistanceInSquares(creature.speed.fly)}
                />
              )}
              <StatCell name="PV" stat={getHPAsString(creature)} />
              <StatCell
                name="FP"
                stat={getChallengeRatingAsFraction(creature.challengeRating)}
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
                  />
                );
              })}
            </div>
            <div className="flex flex-col border-t-2 pt-4">
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
                    ["darkvision", "blindSight"].includes(name) &&
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
                {creature.traits.map((trait) => (
                  <StatCell
                    key={trait.name}
                    name={trait.name}
                    stat={trait.description}
                  />
                ))}
              </div>
            )}
            {creature.reactions && (
              <div className="flex flex-col border-t-2 pt-4">
                {creature.reactions.map((reaction) => (
                  <StatCell
                    key={reaction.name}
                    name={reaction.name}
                    stat={reaction.description}
                  />
                ))}
              </div>
            )}
            <div className="flex flex-col gap-2 border-t-2 pt-4">
              {creature.actions.map((action) => {
                if (action.description) {
                  return (
                    <StatCell
                      key={action.name}
                      name={action.name}
                      stat={action.description}
                    />
                  );
                }

                const isUnCommonReach =
                  action.reach && getDistanceInSquares(action.reach) > 1;
                const isUncommonTarget =
                  action.target &&
                  parseInt(action.target.match(/\d/)?.[0] ?? "", 10) > 1;
                const hitDice =
                  action.hit &&
                  (action.hit.match(/(?<=\().*?(?=\))/)?.[0] ?? "");
                const hitType =
                  action.hit &&
                  (action.hit.match(/(?<=\)).*/)?.[0] ?? "").trim();

                const attackDescription = (
                  <>
                    {action.type && (
                      <span className="italic">{action.type}</span>
                    )}
                    {action.modifier && (
                      <span className="text-indigo-400">{action.modifier}</span>
                    )}
                    {action.reach && (
                      <span
                        className={clsx({ "text-primary": isUnCommonReach })}
                      >
                        {replaceMetersWithSquares(action.reach)}
                      </span>
                    )}
                    {action.target && (
                      <span
                        className={clsx({ "text-primary": isUncommonTarget })}
                      >
                        {action.target}
                      </span>
                    )}
                    {action.hit && (
                      <span>
                        <span className="text-indigo-400">{hitDice}</span>{" "}
                        <span>({hitType})</span>
                      </span>
                    )}
                  </>
                );

                return (
                  <StatCell
                    key={action.name}
                    name={action.name}
                    stat={attackDescription}
                  />
                );
              })}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
