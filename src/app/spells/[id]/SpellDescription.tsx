import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { StatCell } from "@/app/creatures/StatCell";
import {
  convertFeetDistanceIntoSquares,
  convertFromFeetToSquares,
  translateShortenedAbilityName,
  typedSummarySpells,
} from "@/utils/utils";
import { APISpell, SpellSource } from "@/types/schemas";
import { entries } from "remeda";
import { LinkIcon } from "@heroicons/react/16/solid";
import { Link } from "@/components/ui/Link";

export const SpellDescription = ({ spell }: { spell: APISpell }) => {
  const spellFromApp = typedSummarySpells.find(
    (typedSpell) => typedSpell.id === spell.index,
  );

  return (
    <div className="col-span-3">
      <Card>
        <CardHeader>
          {(spellFromApp?.name || spell.name) && (
            <CardTitle className="flex gap-2">
              {(spellFromApp?.isRitual ?? spell.ritual) && (
                <SparklesIcon className="size-6 text-emerald-500" />
              )}
              {spellFromApp?.name ? (
                <div className="flex items-center gap-2">
                  {spellFromApp?.name}
                  {spell.name && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      <Link
                        href={`https://www.aidedd.org/dnd/sorts.php?vo=${spell.index}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1"
                      >
                        ({spell.name} <LinkIcon className="size-4" />)
                      </Link>
                    </span>
                  )}
                </div>
              ) : (
                <div>{spell.name ?? spell.index}</div>
              )}
            </CardTitle>
          )}

          <CardDescription className="flex gap-2">
            {spell.level !== undefined && <span>Level {spell.level}</span>}
            {spell.school && <span>{spell.school.name}</span>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-8">
              {spell.casting_time && (
                <StatCell
                  name="Incantation"
                  stat={spell.casting_time}
                  highlightClassName={
                    spell.casting_time.includes("bonus action")
                      ? "text-orange-400"
                      : spell.casting_time.includes("reaction")
                        ? "text-purple-400"
                        : undefined
                  }
                  isInline
                />
              )}
              {spell.range && (
                <StatCell
                  name="Portée"
                  stat={convertFromFeetToSquares(spell.range)}
                  isInline
                />
              )}
              {spell.duration && (
                <StatCell
                  name="Durée"
                  stat={`${spell.duration}${spell.concentration ? " (c)" : ""}`}
                  isInline
                  highlightClassName={
                    spell.concentration ? "text-yellow-500" : undefined
                  }
                />
              )}
            </div>

            <div className="flex gap-8">
              {spell.components && (
                <StatCell
                  name="Composants"
                  stat={`${spell.components.join(", ")}${spell.material ? ` + ${spell.material}` : ""}`}
                  isInline
                />
              )}
            </div>

            {!!spell.desc?.length && (
              <div className="flex flex-col gap-4 border-t-2 pt-4">
                {spell.desc.map((desc, index) => (
                  <div key={index}>{desc}</div>
                ))}
                {!!spell.higher_level?.length && (
                  <div className="flex flex-col gap-2">
                    {spell.higher_level?.map((level, index) => (
                      <div key={index}>{level}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2 border-t-2 pt-4">
              {(!!spell.dc || !!spell.attack_type) && (
                <div className="flex gap-8">
                  {spell.dc && (
                    <>
                      {spell.dc.dc_type && (
                        <StatCell
                          name="Type de sort"
                          stat={`JdS de ${spell.dc.dc_type?.index ? translateShortenedAbilityName(spell.dc.dc_type?.index) : ""}`}
                          isHighlighted
                          isInline
                        />
                      )}
                      {spell.dc.dc_success && (
                        <StatCell
                          name="Réussite JdS"
                          stat={spell.dc.dc_success}
                          isInline
                        />
                      )}
                    </>
                  )}

                  {spell.attack_type && (
                    <StatCell
                      name="Type de sort"
                      stat={`Attaque : ${spell.attack_type}`}
                      isHighlighted
                      isInline
                    />
                  )}
                </div>
              )}

              <div className="flex gap-8">
                {spell.damage?.damage_type && (
                  <StatCell
                    name="Type de dégats"
                    stat={spell.damage.damage_type.name}
                    isInline
                  />
                )}
                {spell.area_of_effect?.type && (
                  <StatCell
                    name="Zone"
                    stat={spell.area_of_effect.type}
                    isInline
                  />
                )}
                {spell.area_of_effect?.size && (
                  <StatCell
                    name="Taille"
                    stat={convertFeetDistanceIntoSquares(
                      spell.area_of_effect.size,
                    )}
                    isInline
                  />
                )}
              </div>

              {spell.damage?.damage_at_character_level && (
                <div className="flex flex-col gap-2">
                  <div>
                    <span className="text-muted-foreground">
                      {"Dégâts par niveau de personnage"}
                    </span>
                  </div>
                  <div className="flex gap-8">
                    {entries(spell.damage.damage_at_character_level).map(
                      ([level, damage]) => (
                        <StatCell
                          key={level}
                          name={level}
                          stat={damage}
                          isInline
                        />
                      ),
                    )}
                  </div>
                </div>
              )}

              {spell.damage?.damage_at_slot_level && (
                <div className="flex flex-col gap-1">
                  <div>
                    <span className="text-muted-foreground">
                      {"Dégâts par niveau d'emplacement de sort"}
                    </span>
                  </div>
                  <div className="flex gap-8">
                    {entries(spell.damage.damage_at_slot_level).map(
                      ([level, damage]) => (
                        <StatCell
                          key={level}
                          name={level}
                          stat={damage}
                          isInline
                        />
                      ),
                    )}
                  </div>
                </div>
              )}

              {spell.heal_at_slot_level && (
                <div className="flex flex-col gap-1">
                  <div>
                    <span className="text-muted-foreground">
                      {"Soins par niveau d'emplacement de sort"}
                    </span>
                  </div>
                  <div className="flex gap-8">
                    {entries(spell.heal_at_slot_level).map(([level, heal]) => (
                      <StatCell key={level} name={level} stat={heal} isInline />
                    ))}
                  </div>
                </div>
              )}

              <span className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <span>Source :</span>
                {spell.source === SpellSource.API && (
                  <Link
                    href="https://www.dnd5eapi.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    D&D 5e API
                  </Link>
                )}
                {spell.source === SpellSource.AIDE_DD && (
                  <Link
                    href="https://www.aidedd.org/dnd-filters/sorts.php"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    AideDD (incomplet)
                  </Link>
                )}
                {spell.source === SpellSource.LOCAL && "Fichier local"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
