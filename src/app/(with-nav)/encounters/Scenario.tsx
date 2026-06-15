"use client";

import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { entries } from "remeda";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/components/ui/Link";
import { cn } from "@/lib/utils";
import { Encounter } from "@/types/types";
import { useLocalStorage } from "react-use";
import dynamic from "next/dynamic";

const countEnemies = (encounter: Encounter) =>
  Object.values(encounter.ennemies ?? {}).reduce((sum, list) => sum + (list?.length ?? 0), 0);

const Scenario = ({
  scenarioName,
  encounters,
}: {
  scenarioName: string;
  encounters: Record<string, Encounter[]>;
}) => {
  const [isOpen, setIsOpen] = useLocalStorage(`campaign.${scenarioName}`, true);

  const locations = entries(encounters);
  const totalEncounters = locations.reduce((sum, [, list]) => sum + list.length, 0);

  return (
    <div className="mb-8">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group mb-4 flex w-full items-center gap-2 text-left"
      >
        <h1 className="text-2xl font-semibold leading-none tracking-tight">{scenarioName}</h1>
        <Badge variant="secondary" className="font-normal tabular-nums">
          {totalEncounters}
        </Badge>
        <ChevronDownIcon
          className={cn(
            "size-5 text-muted-foreground transition-transform group-hover:text-foreground",
            !isOpen && "-rotate-90",
          )}
        />
      </button>

      {isOpen && (
        <div className="sm:columns-2 lg:columns-3 gap-4 [column-gap:1rem] 2xl:columns-4">
          {locations.map(([location, locationEncounters]) => (
            <Card key={location} className="mb-4 break-inside-avoid">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg">{location}</CardTitle>
                <Badge variant="outline" className="shrink-0 font-normal tabular-nums">
                  {locationEncounters.length}
                </Badge>
              </CardHeader>
              <CardContent className="px-2 pb-2">
                <ul className="flex flex-col">
                  {locationEncounters.map((encounter) => {
                    const enemyCount = countEnemies(encounter);
                    return (
                      <li key={encounter.id}>
                        <Link
                          href={`/encounters/${encounter.id}`}
                          className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm no-underline transition-colors hover:bg-muted"
                        >
                          <span className="min-w-[3rem] shrink-0 rounded bg-muted px-1.5 py-0.5 text-center font-mono text-xs text-muted-foreground transition-colors group-hover:bg-background group-hover:text-foreground">
                            {encounter.location.mapMarker}
                          </span>
                          <span className="flex-1 text-muted-foreground transition-colors group-hover:text-foreground">
                            {encounter.name}
                          </span>
                          {enemyCount > 0 && (
                            <Badge
                              variant="secondary"
                              className="shrink-0 px-1.5 py-0 font-normal tabular-nums text-muted-foreground"
                            >
                              {enemyCount}
                            </Badge>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(Scenario), { ssr: false });
