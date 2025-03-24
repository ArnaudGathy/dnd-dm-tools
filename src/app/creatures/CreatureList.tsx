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
import { SearchField } from "@/components/SearchField";

enum SORT_BY {
  PLAYER = "player",
  NAME = "name",
}

const getCreaturesGroupedByFirstLetter = ({ search }: { search: string }) =>
  groupBy(
    sortBy(
      filter(typedCreatures, (creature) =>
        creature.name.toLowerCase().includes(search.toLowerCase()),
      ),
      prop("name"),
    ),
    (creature) => creature.name[0],
  );

const getCreatureByPlayer = ({
  party,
  playerName,
  search,
}: {
  party: Party;
  playerName?: string;
  search: string;
}) => {
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
              typedCreatures.find(
                (creature) =>
                  creature.id === creatureId &&
                  creature.name.toLowerCase().includes(search.toLowerCase()),
              ),
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

const CreatureList = ({ isAuthorized }: { isAuthorized: boolean }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const playerName = searchParams.get("player")?.toLowerCase();
  const sortBy = searchParams.get("sortBy");

  const [search, setSearch] = useState("");

  const getDefaultSort = () => {
    if (!isAuthorized) {
      return SORT_BY.PLAYER;
    }

    if (sortBy) {
      return sortBy;
    }

    return SORT_BY.NAME;
  };

  const [displayBy, setDisplayBy] = useState(getDefaultSort());

  const party = getParty();

  const getList = (): { [key: string]: Creature[] } | null => {
    if (displayBy === SORT_BY.PLAYER && party) {
      return getCreatureByPlayer({ party, playerName, search });
    }
    if (displayBy === SORT_BY.NAME && isAuthorized) {
      return getCreaturesGroupedByFirstLetter({ search });
    }
    return null;
  };

  const creatures = getList();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <h1 className="scroll-m-20 text-2xl font-bold tracking-tight">
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

      <div className="flex gap-4">
        {(isAuthorized || party) && (
          <Tabs defaultValue={displayBy}>
            <TabsList>
              {party && (
                <TabsTrigger
                  value={SORT_BY.PLAYER}
                  onClick={() => setDisplayBy(SORT_BY.PLAYER)}
                >
                  Par joueur
                </TabsTrigger>
              )}
              {isAuthorized && (
                <TabsTrigger
                  value={SORT_BY.NAME}
                  onClick={() => setDisplayBy(SORT_BY.NAME)}
                >
                  Alphabétique
                </TabsTrigger>
              )}
            </TabsList>
          </Tabs>
        )}

        <SearchField search={search} setSearch={setSearch} />
      </div>

      {!!creatures && !!entries(creatures).length ? (
        <div className="flex flex-wrap gap-4">
          {entries(creatures).map(([name, creatures]) => (
            <Card key={name} className="min-w-full md:min-w-[19%]">
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
        <div className="text-muted-foreground">
          Aucune créature à afficher. Vérifier que vous avez bien sélectionné un
          groupe en haut à droite de l&#39;application.
        </div>
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(CreatureList), { ssr: false });
