import { WEAPON_DAMAGE_TYPE_MAP, WEAPON_DICE_MAP } from "@/constants/maps";
import { Fragment } from "react";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { cn } from "@/lib/utils";
import InfoCell from "@/app/characters/[id]/(sheet)/(weapons)/InfoCell";
import { Weapon, WeaponDamage } from "@prisma/client";
import { getDamageTypeIconAndColor } from "@/app/characters/[id]/(sheet)/(weapons)/utils";

export default function Damages({
  weapon,
}: {
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

            return (
              <Fragment key={damage.id}>
                <PopoverComponent
                  definition={`Dégats ${WEAPON_DAMAGE_TYPE_MAP[damage.type]}`}
                >
                  <div
                    className="flex h-6 items-center gap-0.5 border-b-2"
                    style={{ borderBottomColor: color }}
                  >
                    <div className={cn("w-full text-center")}>
                      {`${damage.numberOfDices}${WEAPON_DICE_MAP[damage.dice]}${damage.flatBonus ? `+${damage.flatBonus}` : ""}`}
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
