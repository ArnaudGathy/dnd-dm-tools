import { StatCell } from "@/components/statblocks/StatCell";
import {
  convertFeetDistanceIntoSquares,
  translateShortenedAbilityName,
} from "@/utils/utils";
import { DamageBlock } from "@/app/spells/[id]/DamageBlock";
import { APISpell } from "@/types/schemas";
import { cn } from "@/lib/utils";

export default function SpellDetails({
  spell,
  tiny,
}: {
  spell: APISpell;
  tiny?: boolean;
}) {
  const responsiveRows = cn(
    "flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-x-8 md:gap-y-4",
    { "gap-0  md:gap-x-4 md:gap-y-2": tiny },
  );

  const shouldShowSpellTypes = !!spell.dc || !!spell.attack_type;
  const shouldShowSpellEffects =
    !!spell.damage?.damage_type || !!spell.area_of_effect;
  const shouldShowSpellDetails =
    shouldShowSpellTypes ||
    shouldShowSpellEffects ||
    spell.damage ||
    spell.heal_at_slot_level;

  if (!shouldShowSpellDetails) {
    return null;
  }

  return (
    <div
      className={cn("flex flex-col gap-2 border-t-2 pt-4", { "gap-0": tiny })}
    >
      {shouldShowSpellTypes && (
        <div className={responsiveRows}>
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

      {shouldShowSpellEffects && (
        <div className={responsiveRows}>
          {spell.damage?.damage_type && (
            <StatCell
              name="Type de dégats"
              stat={spell.damage.damage_type.name}
              isInline
            />
          )}
          {spell.area_of_effect?.type && (
            <StatCell name="Zone" stat={spell.area_of_effect.type} isInline />
          )}
          {spell.area_of_effect?.size && (
            <StatCell
              name="Taille"
              stat={convertFeetDistanceIntoSquares(spell.area_of_effect.size)}
              isInline
            />
          )}
        </div>
      )}

      <DamageBlock
        damages={spell.damage?.damage_at_character_level}
        label={tiny ? "Dégâts/niveau" : "Dégâts par niveau de personnage"}
        tiny={tiny}
      />
      <DamageBlock
        damages={spell.damage?.damage_at_slot_level}
        label={
          tiny
            ? "Dégâts/emplacement"
            : "Dégâts par niveau d'emplacement de sort"
        }
        tiny={tiny}
      />
      <DamageBlock
        damages={spell.heal_at_slot_level}
        label={
          tiny ? "Soins/emplacement" : "Soins par niveau d'emplacement de sort"
        }
        tiny={tiny}
      />
    </div>
  );
}
