"use client";

import InfoCell from "@/app/(with-nav)/characters/[id]/(sheet)/(weapons)/InfoCell";
import { AMMUNITION_TYPE_MAP } from "@/constants/maps";
import { Weapon, WeaponDamage } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Box, Check, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { weaponChipClassName } from "@/app/(with-nav)/characters/[id]/(sheet)/(combat)/WeaponCard";
import { updateWeaponAmmunitionCount } from "@/lib/actions/weapons";
import { useState } from "react";

export default function AmmunitionForm({
  weapon,
  asChip = false,
}: {
  weapon: Weapon & { damages: WeaponDamage[] };
  /** Render as a compact editable chip (combat tab) instead of a labeled row. */
  asChip?: boolean;
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

  if (!weapon.ammunitionType || weapon.ammunitionCount === null) {
    return null;
  }

  const label = `${weapon.ammunitionCount} ${AMMUNITION_TYPE_MAP[weapon.ammunitionType]}`;
  const popoverContent = (
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
  );

  if (asChip) {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger
          onClick={() => setIsOpen(true)}
          className={cn(weaponChipClassName, "transition-colors hover:bg-background/60")}
        >
          <Box className="size-3.5 text-muted-foreground" />
          {label}
        </PopoverTrigger>
        {popoverContent}
      </Popover>
    );
  }

  return (
    <InfoCell
      className="my-2"
      name="Munitions"
      value={
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger onClick={() => setIsOpen(true)}>{label}</PopoverTrigger>
          {popoverContent}
        </Popover>
      }
    />
  );
}
