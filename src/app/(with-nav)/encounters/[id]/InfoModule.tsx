"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Encounter } from "@/types/types";
import { clsx } from "clsx";
import { getYoutubeUrlFromId } from "@/utils/utils";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import { PlayIcon } from "@heroicons/react/24/outline";

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

export const InfoModule = ({ encounter }: { encounter: Encounter }) => {
  const [iframeExpanded, setIframeExpanded] = useState(true);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between">
              {encounter.id - 1 > 0 && (
                <Button size="xs" variant="ghost">
                  <Link href={`/encounters/${encounter.id - 1}`}>
                    <ArrowLeftIcon className="size-4" />
                  </Link>
                </Button>
              )}
              <div className="flex items-center gap-2">
                {encounter.location.mapMarker} - {encounter.name}
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
              <Button size="xs" variant="ghost">
                <Link href={`/encounters/${encounter.id + 1}`}>
                  <ArrowRightIcon className="size-4" />
                </Link>
              </Button>
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
