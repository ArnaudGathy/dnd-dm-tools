"use client";

import { typedCreatures } from "@/utils/utils";
import {
  capitalize,
  entries,
  filter,
  groupBy,
  isDefined,
  map,
  pipe,
  prop,
  reduce,
  sortBy,
} from "remeda";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/components/ui/Link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getParty } from "@/utils/localStorageUtils";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Creature, Party } from "@/types/types";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { XMarkIcon } from "@heroicons/react/16/solid";

enum SORT_BY {
  PLAYER = "player",
  NAME = "name",
}

const creaturesGroupedByFirstLetter = groupBy(
  sortBy(typedCreatures, prop("name")),
  (creature) => creature.name[0],
);

const getCreatureByPlayer = (party: Party, playerName?: string) => {
  return pipe(
    party.characters,
    filter(
      (character) => !playerName || character.name.toLowerCase() === playerName,
    ),
    reduce((acc, next) => {
      if (next.creatures) {
        return {
          ...acc,
          [next.name]: pipe(
            next.creatures,
            map((creatureId) =>
              typedCreatures.find((creature) => creature.id === creatureId),
            ),
            filter(isDefined),
            sortBy(prop("name")),
          ),
        };
      }
      return acc;
    }, {}),
  );
};

const Home = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const playerName = searchParams.get("player")?.toLowerCase();
  const sortBy = searchParams.get("sortBy");

  const [displayBy, setDisplayBy] = useState(sortBy ?? SORT_BY.NAME);

  const party = getParty();

  const getList = (): { [key: string]: Creature[] } | null => {
    if (displayBy === SORT_BY.PLAYER && party) {
      return getCreatureByPlayer(party, playerName);
    }
    if (displayBy === SORT_BY.NAME) {
      return creaturesGroupedByFirstLetter;
    }
    return null;
  };

  const creatures = getList();

  return (
    <div>
      <div className="flex gap-4">
        <h1 className={"mb-4 scroll-m-20 text-2xl font-bold tracking-tight"}>
          Liste des créatures {playerName ? `de ${capitalize(playerName)}` : ""}
        </h1>
        {playerName && (
          <Button
            size="xs"
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.delete(SORT_BY.PLAYER);
              router.replace(`${pathName}?${params.toString()}`);
            }}
          >
            <XMarkIcon className="size-4" />
          </Button>
        )}
      </div>

      <Tabs defaultValue={displayBy} className="mb-4 w-[400px]">
        <TabsList>
          <TabsTrigger
            value={SORT_BY.NAME}
            onClick={() => setDisplayBy(SORT_BY.NAME)}
          >
            Par nom
          </TabsTrigger>
          {party && (
            <TabsTrigger
              value={SORT_BY.PLAYER}
              onClick={() => setDisplayBy(SORT_BY.PLAYER)}
            >
              Par joueur
            </TabsTrigger>
          )}
        </TabsList>
      </Tabs>

      {!!creatures && !!entries(creatures).length ? (
        <div className="grid grid-cols-5 grid-rows-6 gap-4">
          {entries(creatures).map(([name, creatures]) => (
            <Card key={name}>
              <CardHeader>
                <CardTitle
                  className={clsx({
                    "cursor-pointer": displayBy === SORT_BY.PLAYER,
                  })}
                  onClick={() => {
                    if (displayBy === SORT_BY.PLAYER) {
                      const params = new URLSearchParams(searchParams);
                      params.set(SORT_BY.PLAYER, name);
                      router.replace(`${pathName}?${params.toString()}`);
                    }
                  }}
                >
                  {capitalize(name)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  {creatures.map((creature) => {
                    return (
                      <li key={creature.id}>
                        <Link href={`/creatures/${creature.id}`}>
                          {creature.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-8 text-muted-foreground">
          Aucune créature à afficher. Vérifier que vous avez bien sélectionné un
          groupe en haut à droite de l&#39;application.
        </div>
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(Home), { ssr: false });
