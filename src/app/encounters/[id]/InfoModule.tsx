"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Encounter } from "@/types/types";
import { useState } from "react";
import { clsx } from "clsx";
import {
  BanknotesIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { getYoutubeUrlFromId } from "@/utils/utils";

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
  const [showInfo, setShowInfo] = useState(true);
  const [showLoots, setShowLoots] = useState(true);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between">
              <div>
                {encounter.location.mapMarker} - {encounter.name}
              </div>
              <div className="flex gap-2">
                {encounter.loots && (
                  <Button
                    variant={showLoots ? "secondary" : "outline"}
                    onClick={() => setShowLoots((cur) => !cur)}
                  >
                    <BanknotesIcon className="size-6" />
                    Loot
                  </Button>
                )}
                <Button
                  variant={showInfo ? "secondary" : "outline"}
                  onClick={() => setShowInfo((cur) => !cur)}
                >
                  <InformationCircleIcon className="size-6" />
                  Info
                </Button>
              </div>
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

      {(showInfo || showLoots) && (
        <div className="flex gap-4">
          {showInfo && (
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent>
                <List list={encounter.informations} />
              </CardContent>
            </Card>
          )}

          {showLoots && encounter.loots && (
            <Card className={clsx("flex-1", { "max-w-[50%]": showInfo })}>
              <CardHeader>
                <CardTitle>Loots</CardTitle>
              </CardHeader>
              <CardContent>
                <List list={encounter.loots} />
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </>
  );
};
