"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Encounter } from "@/types/types";
import { clsx } from "clsx";
import { getYoutubeUrlFromId } from "@/utils/utils";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";

const List = ({ list }: { list: string[] }) => {
  return (
    <ul className="list-inside list-disc leading-5">
      {list.map((info) => {
        const shouldEmphasize = info.match(/DD/);
        return (
          <li
            key={info}
            className={clsx("my-2", { "text-indigo-400": shouldEmphasize })}
          >
            {info}
          </li>
        );
      })}
    </ul>
  );
};

export const InfoModule = ({ encounter }: { encounter: Encounter }) => {
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
              <div>
                {encounter.location.mapMarker} - {encounter.name}
              </div>
              <Button size="xs" variant="ghost">
                <Link href={`/encounters/${encounter.id + 1}`}>
                  <ArrowRightIcon className="size-4" />
                </Link>
              </Button>
            </div>

            {encounter.youtubeId && (
              <iframe
                width="100%"
                height="45"
                src={getYoutubeUrlFromId(encounter.youtubeId)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
              ></iframe>
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
