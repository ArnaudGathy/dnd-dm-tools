import { Fragment } from "react";
import { CharacterById, cn } from "@/lib/utils";
import { Asterisk, Crosshair, Sparkles, Swords } from "lucide-react";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { ABILITY_NAME_MAP_TO_FR, WEAPON_DAMAGE_TYPE_MAP_SENTENCE } from "@/constants/maps";
import { convertFeetDistanceIntoSquares } from "@/utils/utils";
import {
  getDamageTypeIconAndColor,
  getWeaponAttackBonus,
  getWeaponDamage,
} from "@/utils/stats/weapons";
import AmmunitionForm from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/AmmunitionForm";
import StatBreakdown, {
  breakdownContentClassName,
} from "@/app/(with-nav)/characters/[id]/(sheet)/StatBreakdown";
import { addSignToNumber } from "@/utils/utils";

export const weaponChipClassName =
  "inline-flex items-center gap-1 rounded-md bg-background/40 px-2 py-1 text-xs font-medium text-foreground/80";

/**
 * One weapon as an attack card: the two numbers needed to roll (attack bonus,
 * damage) front and center, logistics (range, ammo, effects) as quiet chips.
 */
export default function WeaponCard({
  character,
  weapon,
}: {
  character: CharacterById;
  weapon: CharacterById["weapons"][number];
}) {
  const attackDetails = getWeaponAttackBonus(character, weapon);

  return (
    <div className="flex flex-col gap-2.5 rounded-lg bg-muted p-3">
      <div className="flex items-start justify-between gap-2">
        <span className="text-base font-bold leading-tight">{weapon.name}</span>
        <span className="flex shrink-0 items-center text-xs text-muted-foreground">
          {ABILITY_NAME_MAP_TO_FR[weapon.abilityModifier]}
          {weapon.isProficient && (
            <PopoverComponent
              contentClassName={breakdownContentClassName}
              definition={
                <StatBreakdown
                  accent="indigo"
                  icon={Asterisk}
                  title="Arme maîtrisée"
                  note="Le bonus de maîtrise est appliqué au jet d'attaque."
                />
              }
            >
              <Asterisk className="size-4 text-indigo-400" />
            </PopoverComponent>
          )}
        </span>
      </div>

      <div className="flex items-stretch gap-2">
        <PopoverComponent
          className="flex w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-md bg-background/50 py-1.5 transition-colors hover:bg-background/70"
          contentClassName={breakdownContentClassName}
          definition={
            <StatBreakdown
              accent="red"
              icon={Crosshair}
              title="Bonus d'attaque"
              rows={[
                {
                  label: ABILITY_NAME_MAP_TO_FR[attackDetails.modifierName],
                  value: addSignToNumber(attackDetails.abilityModifier),
                },
                {
                  label: "Maîtrise",
                  value:
                    attackDetails.proficiencyBonus > 0
                      ? addSignToNumber(attackDetails.proficiencyBonus)
                      : "non",
                },
                attackDetails.attackBonus > 0 && {
                  label: "Bonus",
                  value: addSignToNumber(attackDetails.attackBonus),
                },
              ]}
              total={attackDetails.total}
            />
          }
        >
          <span className="text-2xl font-bold tabular-nums leading-none">
            {attackDetails.total}
          </span>
          <span className="text-tiny font-semibold uppercase tracking-wide text-muted-foreground">
            Attaque
          </span>
        </PopoverComponent>

        <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-1 rounded-md bg-background/30 px-2.5 py-1.5">
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            {weapon.damages.map((damage, index) => {
              const isLast = index === weapon.damages.length - 1;
              const { icon: Icon, color } = getDamageTypeIconAndColor(damage.type);
              const damageDetails = getWeaponDamage(character, damage, weapon);

              return (
                <Fragment key={damage.id}>
                  <PopoverComponent
                    className="flex items-center gap-1"
                    contentClassName={breakdownContentClassName}
                    definition={
                      <StatBreakdown
                        accent="red"
                        icon={Icon}
                        title={`Dégâts ${WEAPON_DAMAGE_TYPE_MAP_SENTENCE[damage.type]}`}
                        rows={[
                          { label: "Dés", value: damageDetails.dices },
                          !!damageDetails.modifierName && {
                            label: ABILITY_NAME_MAP_TO_FR[damageDetails.modifierName],
                            value: addSignToNumber(damageDetails.abilityModifier),
                          },
                          damageDetails.flatBonus > 0 && {
                            label: "Bonus",
                            value: addSignToNumber(damageDetails.flatBonus),
                          },
                        ]}
                        total={<span style={{ color }}>{damageDetails.totalString}</span>}
                      />
                    }
                  >
                    <span
                      className="border-b-2 text-lg font-bold tabular-nums leading-tight"
                      style={{ borderBottomColor: color }}
                    >
                      {damageDetails.totalString}
                    </span>
                    <Icon className="size-4 stroke-[2.5px]" style={{ color }} />
                  </PopoverComponent>
                  {!isLast && <span className="text-muted-foreground">+</span>}
                </Fragment>
              );
            })}
          </div>
          <span className="text-tiny font-semibold uppercase tracking-wide text-muted-foreground">
            Dégâts
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 empty:hidden">
        {weapon.reach && (
          <span className={weaponChipClassName}>
            <Swords className="size-3.5 text-muted-foreground" />
            <span className={cn({ "text-indigo-400": weapon.reach > 5 })}>
              {`${convertFeetDistanceIntoSquares(weapon.reach)} ${weapon.reach > 5 ? "cases" : "case"}`}
            </span>
          </span>
        )}
        {weapon.range && weapon.longRange && (
          <span className={weaponChipClassName}>
            <Crosshair className="size-3.5 text-muted-foreground" />
            {`${convertFeetDistanceIntoSquares(weapon.range)} – ${convertFeetDistanceIntoSquares(weapon.longRange)} cases`}
          </span>
        )}
        <AmmunitionForm weapon={weapon} />
      </div>

      {weapon.extraEffects && (
        <div className="flex items-start gap-1.5 text-sm leading-snug text-muted-foreground">
          <Sparkles className="mt-0.5 size-3.5 shrink-0 text-amber-400" />
          {weapon.extraEffects}
        </div>
      )}
    </div>
  );
}
