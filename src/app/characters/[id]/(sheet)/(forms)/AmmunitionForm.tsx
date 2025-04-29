import InfoCell from "@/app/characters/[id]/(sheet)/(weapons)/InfoCell";
import { AMMUNITION_TYPE_MAP } from "@/constants/maps";
import { Weapon, WeaponDamage } from "@prisma/client";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { Input } from "@/components/ui/input";
import { PopoverClose } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { updateWeaponAmmunitionCount } from "@/lib/actions/weapons";

export default function AmmunitionForm({
  weapon,
}: {
  weapon: Weapon & { damages: WeaponDamage[] };
}) {
  const action = updateWeaponAmmunitionCount.bind(null, weapon.id);

  return (
    weapon.ammunitionType &&
    weapon.ammunitionCount !== null && (
      <InfoCell
        className="my-2"
        name="Munitions"
        value={
          <PopoverComponent
            definition={
              <form
                action={action}
                className="flex w-[60px] flex-col items-center gap-4"
              >
                <Input
                  defaultValue={weapon.ammunitionCount}
                  name="ammunitionCount"
                />
                <PopoverClose asChild>
                  <Button size="lg" type="submit" className="w-full">
                    <Check />
                  </Button>
                </PopoverClose>
              </form>
            }
          >{`${weapon.ammunitionCount} ${AMMUNITION_TYPE_MAP[weapon.ammunitionType]}`}</PopoverComponent>
        }
      />
    )
  );
}
