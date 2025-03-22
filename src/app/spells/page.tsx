"use client";

import {
  capitalize,
  entries,
  filter,
  find,
  flatMap,
  groupBy,
  isDefined,
  map,
  pipe,
  prop,
  reduce,
  sortBy,
  unique,
  values,
} from "remeda";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/components/ui/Link";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Party, Spell } from "@/types/types";
import { getParty } from "@/utils/localStorageUtils";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { SparklesIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { typedSummarySpells } from "@/utils/utils";

enum SORT_BY {
  PLAYER = "player",
  LEVEL = "level",
}

const getSpellsByPlayer = (party: Party, playerName?: string) =>
  pipe(
    party.characters,
    filter(
      (character) => !playerName || character.name.toLowerCase() === playerName,
    ),
    sortBy(prop("name")),
    reduce((spellsByPlayer: { [key: string]: Spell[] }, player) => {
      if (!spellsByPlayer[player.name]) {
        const spellList = pipe(
          player.spells,
          map((id) => find(typedSummarySpells, (spell) => spell.id === id)),
          filter(isDefined),
          sortBy(prop("name")),
        );

        if (spellList.length > 0) {
          return {
            ...spellsByPlayer,
            [player.name.toLowerCase()]: spellList,
          };
        }
      }
      return spellsByPlayer;
    }, {}),
  );

const getSpellsByLevel = ({
  party,
  playerName,
}: {
  party?: Party;
  playerName?: string;
}) => {
  const partySpells = party
    ? pipe(
        party.characters,
        filter(
          (character) =>
            !playerName || character.name.toLowerCase() === playerName,
        ),
        values(),
        flatMap((character) => character.spells),
        unique(),
      )
    : typedSummarySpells.map((spell) => spell.id);

  return pipe(
    typedSummarySpells,
    filter((spell) => partySpells.includes(spell.id)),
    sortBy(prop("name")),
    groupBy(prop("level")),
  );
};

const Spells = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const player = searchParams.get(SORT_BY.PLAYER)?.toLowerCase();
  const sortBy = searchParams.get("sortBy");

  const party = getParty();

  const [displayBy, setDisplayBy] = useState(sortBy ?? SORT_BY.LEVEL);

  const getList = (): { [key: string]: Spell[] } | null => {
    if (displayBy === SORT_BY.LEVEL) {
      return getSpellsByLevel({ party, playerName: player });
    }
    if (displayBy === SORT_BY.PLAYER && !!party) {
      return getSpellsByPlayer(party, player);
    }
    return null;
  };

  const listOfSpells = getList();

  const getPrefix = () => {
    if (displayBy === SORT_BY.LEVEL) {
      return "Niveau ";
    }
    return "";
  };

  return (
    <div>
      <div className="flex gap-4">
        <h1 className={"mb-4 scroll-m-20 text-2xl font-bold tracking-tight"}>
          Liste des sorts {player ? `de ${capitalize(player)}` : ""}
        </h1>
        {player && (
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
          {!!party && (
            <TabsTrigger
              value={SORT_BY.PLAYER}
              onClick={() => setDisplayBy(SORT_BY.PLAYER)}
            >
              Par joueur
            </TabsTrigger>
          )}
          <TabsTrigger
            value={SORT_BY.LEVEL}
            onClick={() => setDisplayBy(SORT_BY.LEVEL)}
          >
            Par niveau
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {!!listOfSpells && !!entries(listOfSpells).length ? (
        <div className="grid grid-cols-4 grid-rows-3 gap-4">
          {entries(listOfSpells).map(([name, spells]) => (
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
                >{`${getPrefix()} ${capitalize(name)}`}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  {spells.map((spell) => (
                    <li key={spell.id} className="flex items-center gap-2">
                      <div className="w-4">
                        {spell.isRitual && (
                          <SparklesIcon className="size-4 text-emerald-500" />
                        )}
                      </div>
                      <Link href={`/spells/${spell.id}`}>{spell.name}</Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-8 text-muted-foreground">
          Aucun sort à afficher. Vérifier que vous avez bien sélectionné un
          groupe en haut à droite de l&#39;application.
        </div>
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(Spells), { ssr: false });
