"use client";

import InfoCell from "@/app/(with-nav)/characters/[id]/(sheet)/(weapons)/InfoCell";
import { AMMUNITION_TYPE_MAP } from "@/constants/maps";
import { Weapon, WeaponDamage } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, LoaderCircle } from "lucide-react";
import { updateWeaponAmmunitionCount } from "@/lib/actions/weapons";
import { useState } from "react";

export default function AmmunitionForm({
  weapon,
}: {
  weapon: Weapon & { damages: WeaponDamage[] };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ammunitionCount, setAmmunitionCount] = useState(weapon.ammunitionCount ?? undefined);

  const handleSubmit = async () => {
    setIsLoading(true);
    await updateWeaponAmmunitionCount(weapon.id, ammunitionCount);
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    weapon.ammunitionType &&
    weapon.ammunitionCount !== null && (
      <InfoCell
        className="my-2"
        name="Munitions"
        value={
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger onClick={() => setIsOpen(true)}>
              {`${weapon.ammunitionCount} ${AMMUNITION_TYPE_MAP[weapon.ammunitionType]}`}
            </PopoverTrigger>
            <PopoverContent className="w-fit">
              <div className="flex w-[100px] flex-col items-center gap-4">
                <span>De 0 à 20</span>
                <Input
                  name="ammunitionCount"
                  value={ammunitionCount}
                  onChange={(e) => setAmmunitionCount(Number(e.target.value))}
                />
                <Button
                  size="lg"
                  type="submit"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? <LoaderCircle className="animate-spin" /> : <Check />}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        }
      />
    )
  );
}
