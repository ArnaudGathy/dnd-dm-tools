"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Icon from "@/components/ui/icon";
import PipRow from "@/app/(with-nav)/characters/[id]/(sheet)/(combat)/PipRow";
import { UseRessource } from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/useRessouceStorage";

// Above this many charges, pips stop being countable at a glance — use a stepper.
const MAX_PIPS = 8;

/** One resource as a single scannable line: icon, name, and the matching
 *  control — switch (on/off), pips (small pools) or stepper (large pools). */
function ResourceRow({
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

  const { total, available, theme } = ressource;
  const isToggle = total === 0;
  const usePips = !isToggle && total <= MAX_PIPS;

  return (
    <div className="flex min-h-9 items-center gap-2">
      <Icon icon={icon} theme={theme} />
      <span className="min-w-0 flex-1 truncate text-sm font-semibold">{name}</span>

      {isToggle ? (
        <Switch
          checked={available === 1}
          onCheckedChange={(checked) => setRessource({ ...ressource, available: checked ? 1 : 0 })}
          theme={theme}
        />
      ) : usePips ? (
        <PipRow
          className="justify-end"
          total={total}
          available={available}
          theme={theme}
          onSpend={() => setRessource({ ...ressource, available: Math.max(available - 1, 0) })}
          onRegain={() => setRessource({ ...ressource, available: Math.min(available + 1, total) })}
        />
      ) : (
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            theme={theme}
            className="size-6"
            disabled={available === 0}
            onClick={() => setRessource({ ...ressource, available: Math.max(available - 1, 0) })}
          >
            <Minus />
          </Button>
          <span className="min-w-12 text-center text-sm font-bold tabular-nums">
            {available}
            <span className="font-normal text-muted-foreground">{`/${total}`}</span>
          </span>
          <Button
            size="icon"
            theme={theme}
            className="size-6"
            disabled={available === total}
            onClick={() =>
              setRessource({ ...ressource, available: Math.min(available + 1, total) })
            }
          >
            <Plus />
          </Button>
        </div>
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(ResourceRow), { ssr: false });
