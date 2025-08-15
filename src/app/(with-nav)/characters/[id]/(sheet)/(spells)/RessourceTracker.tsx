"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { ReactNode } from "react";
import { UseRessource } from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/useRessouceStorage";
import dynamic from "next/dynamic";
import { Switch } from "@/components/ui/switch";

function RessourceTracker({
  name,
  icon,
  useRessource,
}: {
  name: string;
  icon: ReactNode;
  useRessource: UseRessource;
}) {
  const [ressource, setRessource] = useRessource;

  if (!ressource) {
    return null;
  }

  const isToggleRessource = ressource.total === 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex min-h-12 items-center gap-2">
          <Icon icon={icon} theme={ressource.theme} />
          <span className="self-center font-semibold">{name}</span>
        </div>
      </div>

      {isToggleRessource ? (
        <div className="flex items-center gap-2 self-center">
          <Switch
            checked={ressource.available === 1}
            onCheckedChange={(checked) =>
              setRessource({ ...ressource, available: checked ? 1 : 0 })
            }
            theme={ressource.theme}
          />
        </div>
      ) : (
        <div className="self-center text-4xl font-semibold tabular-nums">
          {ressource.available}
          <span className="text-base text-muted-foreground">{` / ${ressource.total}`}</span>
        </div>
      )}

      {!isToggleRessource && (
        <div className="flex gap-2">
          <Button
            className="w-full"
            theme={ressource.theme}
            disabled={ressource.available === 0}
            onClick={() =>
              setRessource({
                ...ressource,
                available: Math.max(ressource.available - 1, 0),
              })
            }
          >
            <Minus />
          </Button>
          <Button
            className="w-full"
            theme={ressource.theme}
            disabled={ressource.available === ressource.total}
            onClick={() =>
              setRessource({
                ...ressource,
                available: Math.min(ressource.available + 1, ressource.total),
              })
            }
          >
            <Plus />
          </Button>
        </div>
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(RessourceTracker), { ssr: false });
