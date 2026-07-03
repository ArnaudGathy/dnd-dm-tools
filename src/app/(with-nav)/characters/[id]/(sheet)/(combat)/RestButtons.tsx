"use client";

import { FlameKindling, Tent } from "lucide-react";
import { Button } from "@/components/ui/button";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { PopoverClose } from "@radix-ui/react-popover";

export function RestConfirm({
  title,
  description,
  icon,
  confirmAction,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  confirmAction: () => void;
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
  shortRestAction,
  longRestAction,
}: {
  canShortRest: boolean;
  shortRestAction: () => void;
  longRestAction: () => void;
}) {
  return (
    <>
      {canShortRest && (
        <RestConfirm
          title="Court repos"
          description="Récupère les ressources liées au court repos."
          icon={<FlameKindling />}
          confirmAction={shortRestAction}
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
