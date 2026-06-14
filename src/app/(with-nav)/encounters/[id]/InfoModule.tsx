"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Encounter } from "@/types/types";
import { clsx } from "clsx";
import { getYoutubeUrlFromId } from "@/utils/utils";
import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import { PlayIcon } from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const List = ({ list }: { list: string[] }) => {
  return (
    <ul className="list-inside list-disc leading-5">
      {list.map((info) => {
        const shouldEmphasize = info.match(/DD/);
        return (
          <li key={info} className={clsx("my-2", { "text-green-600": shouldEmphasize })}>
            {info}
          </li>
        );
      })}
    </ul>
  );
};

export const InfoModule = ({
  encounter,
  locationEncounters,
}: {
  encounter: Encounter;
  locationEncounters: Encounter[];
}) => {
  const [iframeExpanded, setIframeExpanded] = useState(true);
  const hasSiblings = locationEncounters.length > 1;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2">
                {hasSiblings ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1 outline-none hover:text-muted-foreground">
                      {encounter.location.mapMarker} - {encounter.name}
                      <ChevronDownIcon className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="max-h-80 overflow-y-auto">
                      {locationEncounters.map((sibling) => (
                        <DropdownMenuItem
                          key={sibling.id}
                          asChild
                          disabled={sibling.id === encounter.id}
                        >
                          <Link href={`/encounters/${sibling.id}`}>
                            {sibling.location.mapMarker} - {sibling.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    {encounter.location.mapMarker} - {encounter.name}
                  </>
                )}
                <div>
                  <Button
                    size="xs"
                    variant="link"
                    onClick={() => setIframeExpanded((v) => !v)}
                    className="mb-1 flex items-center gap-1 text-xs text-muted-foreground"
                  >
                    <PlayIcon /> Player
                  </Button>
                </div>
              </div>
            </div>

            {encounter.youtubeId && (
              <div
                className={clsx(
                  "overflow-hidden transition-all duration-300",
                  iframeExpanded ? "h-[200px]" : "h-0",
                )}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={getYoutubeUrlFromId(encounter.youtubeId)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
              </div>
            )}
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="flex gap-4">
        {!!encounter.informations?.length && (
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent>
              <List list={encounter.informations} />
            </CardContent>
          </Card>
        )}

        {!!encounter.loots?.length && (
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Loots</CardTitle>
            </CardHeader>
            <CardContent>
              <List list={encounter.loots} />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};
