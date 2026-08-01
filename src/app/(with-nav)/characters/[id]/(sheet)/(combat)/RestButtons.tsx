"use client";

import { useState } from "react";
import { FlameKindling, Tent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { PopoverClose } from "@radix-ui/react-popover";

/** An extra opt-in toggle shown in the confirmation popover, for rest features
 *  the player triggers on the rest of their choice rather than every time. */
type RestOption = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function RestConfirm({
  title,
  description,
  icon,
  confirmAction,
  option,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  confirmAction: () => void;
  option?: RestOption;
}) {
  return (
    <PopoverComponent
      asChild
      noFocus
      side="top"
      definition={
        <div className="flex max-w-[15rem] flex-col gap-2">
          <span className="text-sm font-bold">{title}</span>
          <span className="text-xs text-muted-foreground">{description}</span>
          {option && (
            <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold">
              <Checkbox checked={option.checked} onCheckedChange={option.onCheckedChange} />
              {option.label}
            </label>
          )}
          <PopoverClose asChild>
            <Button size="xs" onClick={confirmAction}>
              Confirmer
            </Button>
          </PopoverClose>
        </div>
      }
    >
      <Button theme="neutral" size="icon" title={title}>
        {icon}
      </Button>
    </PopoverComponent>
  );
}

/** Header-level rest actions: frequent end-of-scene resets, one confirmation
 *  tap away so a stray touch can't wipe the trackers. */
export default function RestButtons({
  canShortRest,
  shortRestOption,
  shortRestAction,
  longRestAction,
}: {
  canShortRest: boolean;
  shortRestOption?: { label: string };
  shortRestAction: (isOptionChecked: boolean) => void;
  longRestAction: () => void;
}) {
  const [isOptionChecked, setIsOptionChecked] = useState(false);

  return (
    <>
      {canShortRest && (
        <RestConfirm
          title="Court repos"
          description="Récupère les ressources liées au court repos."
          icon={<FlameKindling />}
          option={
            shortRestOption && {
              ...shortRestOption,
              checked: isOptionChecked,
              onCheckedChange: (checked) => setIsOptionChecked(checked === true),
            }
          }
          confirmAction={() => {
            shortRestAction(isOptionChecked);
            setIsOptionChecked(false);
          }}
        />
      )}
      <RestConfirm
        title="Long repos"
        description="Restaure PV, ressources, emplacements de sorts et lancements gratuits."
        icon={<Tent />}
        confirmAction={longRestAction}
      />
    </>
  );
}
