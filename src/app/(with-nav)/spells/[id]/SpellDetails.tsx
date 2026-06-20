import { convertFeetDistanceIntoSquares, translateShortenedAbilityName } from "@/utils/utils";
import { DamageBlock } from "@/app/(with-nav)/spells/[id]/DamageBlock";
import { StatTile } from "@/app/(with-nav)/spells/[id]/StatTile";
import { APISpell } from "@/types/schemas";

export default function SpellDetails({ spell }: { spell: APISpell }) {
  const shouldShowSpellTypes = !!spell.dc || !!spell.attack_type;
  const shouldShowSpellEffects = !!spell.damage?.damage_type || !!spell.area_of_effect;
  const shouldShowSpellDetails =
    shouldShowSpellTypes || shouldShowSpellEffects || spell.damage || spell.heal_at_slot_level;

  if (!shouldShowSpellDetails) {
    return null;
  }

  return (
    <section className="flex flex-col gap-3 border-t pt-6">
      <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Effets
      </h2>

      {(shouldShowSpellTypes || shouldShowSpellEffects) && (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {spell.dc?.dc_type && (
            <StatTile
              label="Jet de sauvegarde"
              value={`JdS de ${spell.dc.dc_type.index ? translateShortenedAbilityName(spell.dc.dc_type.index) : ""}`}
              valueClassName="text-indigo-400"
            />
          )}
          {spell.dc?.dc_success && <StatTile label="Réussite JdS" value={spell.dc.dc_success} />}
          {spell.attack_type && (
            <StatTile label="Attaque" value={spell.attack_type} valueClassName="text-indigo-400" />
          )}
          {spell.damage?.damage_type && (
            <StatTile label="Type de dégâts" value={spell.damage.damage_type.name} />
          )}
          {spell.area_of_effect?.type && (
            <StatTile label="Zone" value={spell.area_of_effect.type} />
          )}
          {spell.area_of_effect?.size && (
            <StatTile
              label="Taille"
              value={convertFeetDistanceIntoSquares(spell.area_of_effect.size)}
            />
          )}
        </div>
      )}

      <DamageBlock
        damages={spell.damage?.damage_at_character_level}
        label="Dégâts par niveau de personnage"
      />
      <DamageBlock
        damages={spell.damage?.damage_at_slot_level}
        label="Dégâts par niveau d'emplacement de sort"
      />
      <DamageBlock
        damages={spell.heal_at_slot_level}
        label="Soins par niveau d'emplacement de sort"
      />
    </section>
  );
}
