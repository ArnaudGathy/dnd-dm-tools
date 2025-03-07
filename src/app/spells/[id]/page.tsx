import { notFound } from "next/navigation";
import {
  getDistanceInSquareOrAsIs,
  getSpellFromId,
  isConcentrationSpell,
  shortenAbilityName,
  typedParties,
} from "@/utils/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { filter, flatMap, pipe, prop, sortBy } from "remeda";
import { StatCell } from "@/app/creatures/StatCell";
import DamageBlock from "@/app/spells/[id]/DamageBlock";
import { EffectsBlock } from "@/app/spells/[id]/EffectsBlock";
import { SparklesIcon } from "@heroicons/react/24/solid";

const SpellDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const spellId = (await params).id;
  const spell = getSpellFromId(parseInt(spellId));

  if (!spell) {
    return notFound();
  }

  const playersWithSpell = pipe(
    typedParties,
    flatMap((party) => party.characters),
    sortBy(prop("name")),
    filter((character) => character.spells.includes(spell.id)),
  );

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2">
              {spell.isRitual && (
                <SparklesIcon className="size-6 text-emerald-500" />
              )}
              {spell.name}
            </CardTitle>
            <CardDescription>Niveau {spell.level}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-8">
                <StatCell
                  name="Incantation"
                  stat={spell.castingTime}
                  highlightClassName={
                    spell.castingTime.includes("action bonus")
                      ? "text-orange-400"
                      : spell.castingTime.includes("réaction")
                        ? "text-purple-400"
                        : undefined
                  }
                  isInline
                />
                <StatCell
                  name="Portée"
                  stat={getDistanceInSquareOrAsIs(spell.range)}
                  isInline
                />
                <StatCell name="Composantes" stat={spell.components} isInline />
                <StatCell
                  name="Durée"
                  stat={spell.duration}
                  isInline
                  highlightClassName={
                    isConcentrationSpell(spell) ? "text-yellow-500" : undefined
                  }
                />
              </div>
              <div className="flex gap-8 border-t-2 pt-4">
                {spell.description}
              </div>
              {spell.combat && (
                <div className="flex flex-col gap-2 border-t-2 pt-4">
                  {spell.combat.type === "save" && (
                    <div className="flex gap-8">
                      <StatCell
                        name="Type de sort"
                        stat={`JdS de ${shortenAbilityName(spell.combat.save)}`}
                        isHighlighted
                        isInline
                      />
                      <StatCell
                        name="Réussite JdS"
                        stat={spell.combat.saveSuccess}
                        isInline
                      />
                      {spell.combat.damage && (
                        <DamageBlock damages={spell.combat.damage} />
                      )}
                    </div>
                  )}
                  {spell.combat.restrictions && (
                    <StatCell
                      name="Restrictions"
                      stat={spell.combat.restrictions.join(", ")}
                    />
                  )}
                  {spell.combat.type === "attack" && (
                    <div className="flex gap-8">
                      <StatCell
                        name="Type de sort"
                        stat="Jet d'attaque vs CA"
                        isHighlighted
                      />
                      {spell.combat.damage && (
                        <DamageBlock damages={spell.combat.damage} />
                      )}
                    </div>
                  )}
                  {spell.combat.type === "status" && (
                    <div className="flex gap-8">
                      <StatCell
                        name="Type de sort"
                        stat="Status"
                        isHighlighted
                      />
                    </div>
                  )}
                  {spell.combat.effects && (
                    <EffectsBlock effects={spell.combat.effects} />
                  )}
                  {spell.combat.recovery && (
                    <StatCell
                      name="Rétablissement cible"
                      stat={spell.combat.recovery}
                    />
                  )}
                  {spell.combat.spellLevelScale && (
                    <StatCell
                      name="Par niveau de sort supplémentaire"
                      stat={spell.combat.spellLevelScale}
                    />
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Sort appris par :</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {playersWithSpell.map((player) => (
              <li key={player.id}>{player.name}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpellDetails;
