"use client";

import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/16/solid";
import { entries } from "remeda";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/components/ui/Link";
import { Encounter } from "@/types/types";
import { useLocalStorage } from "react-use";
import dynamic from "next/dynamic";

const Scenario = ({
  scenarioName,
  encounters,
}: {
  scenarioName: string;
  encounters: Record<string, Encounter[]>;
}) => {
  const [isOpen, setIsOpen] = useLocalStorage(`campaign.${scenarioName}`, true);

  return (
    <div key={scenarioName}>
      <h1 className="mb-4 space-x-2 text-2xl font-semibold leading-none tracking-tight">
        <span>{scenarioName}</span>
        <Button size="xs" variant="ghost" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronDownIcon className="size-4" /> : <ChevronUpIcon className="size-4" />}
        </Button>
      </h1>
      {isOpen && (
        <div className="mb-8 grid grid-cols-4 gap-4">
          {!!encounters &&
            entries(encounters).map(([location, encounters]) => (
              <Card key={location}>
                <CardHeader>
                  <CardTitle>{location}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    {encounters.map((encounter) => (
                      <li key={encounter.id}>
                        <Link href={`/encounters/${encounter.id}`}>
                          {encounter.location.mapMarker} - {encounter.name}
                        </Link>
                      </li>
                    ))}
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
