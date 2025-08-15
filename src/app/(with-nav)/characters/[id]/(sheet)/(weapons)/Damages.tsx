import {
  ABILITY_NAME_MAP_TO_FR,
  WEAPON_DAMAGE_TYPE_MAP_SENTENCE,
} from "@/constants/maps";
import { Fragment } from "react";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { cn } from "@/lib/utils";
import InfoCell from "@/app/(with-nav)/characters/[id]/(sheet)/(weapons)/InfoCell";
import { Character, Weapon, WeaponDamage } from "@prisma/client";
import {
  getDamageTypeIconAndColor,
  getWeaponDamage,
} from "@/utils/stats/weapons";

export default function Damages({
  weapon,
  character,
}: {
  character: Character;
  weapon: Weapon & { damages: WeaponDamage[] };
}) {
  return (
    <InfoCell
      name="Dégâts"
      value={
        <div className="flex gap-2">
          {weapon.damages.map((damage, index) => {
            const isLast = index === weapon.damages.length - 1;
            const { icon: Icon, color } = getDamageTypeIconAndColor(
              damage.type,
            );
            const weaponDamageDetails = getWeaponDamage(
              character,
              damage,
              weapon,
            );
            const hasBonusDamage =
              weaponDamageDetails.modifierName !== null ||
              weaponDamageDetails.flatBonus > 0;

            return (
              <Fragment key={damage.id}>
                <PopoverComponent
                  definition={
                    <div>
                      {hasBonusDamage && (
                        <span className="font-bold">Bonus de dégâts :</span>
                      )}
                      {weaponDamageDetails.modifierName && (
                        <div>
                          <span>{`${ABILITY_NAME_MAP_TO_FR[weaponDamageDetails.modifierName]} : `}</span>
                          <span>{weaponDamageDetails.abilityModifier}</span>
                        </div>
                      )}
                      {weaponDamageDetails.flatBonus > 0 && (
                        <div>
                          <span>Bonus : </span>
                          <span>{weaponDamageDetails.flatBonus}</span>
                        </div>
                      )}
                      <div
                        style={{ color }}
                      >{`Dégats ${WEAPON_DAMAGE_TYPE_MAP_SENTENCE[damage.type]}`}</div>
                    </div>
                  }
                >
                  <div
                    className="flex h-6 items-center gap-0.5 border-b-2"
                    style={{ borderBottomColor: color }}
                  >
                    <div className={cn("w-full text-center")}>
                      {weaponDamageDetails.totalString}
                    </div>
                    <div className={`flex items-center`} style={{ color }}>
                      <Icon className="size-4 stroke-[2.5]" />
                    </div>
                  </div>
                </PopoverComponent>
                {!isLast && <div className="text-muted-foreground">+</div>}
              </Fragment>
            );
          })}
        </div>
      }
    />
  );
}
