"use client";

import { typedSpells } from "@/utils/utils";
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
import { Spell } from "@/types/schemas";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Party } from "@/types/types";
import { getParty } from "@/utils/localStorageUtils";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { XMarkIcon } from "@heroicons/react/16/solid";
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
          map((id) => find(typedSpells, (spell) => spell.id === id)),
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

const getSpellsByLevel = (party: Party, playerName?: string) => {
  const partySpells = pipe(
    party.characters,
    filter(
      (character) => !playerName || character.name.toLowerCase() === playerName,
    ),
    values(),
    flatMap((character) => character.spells),
    unique(),
  );
  return pipe(
    typedSpells,
    filter((spell) => partySpells.includes(spell.id)),
    sortBy(prop("name")),
    groupBy(prop("level")),
  );
};

const Spells = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const player = searchParams.get("player")?.toLowerCase();

  const party = getParty();

  const [displayBy, setDisplayBy] = useState("player");

  if (!party) {
    return null;
  }

  const spellsByPlayer = getSpellsByPlayer(party, player);
  const spellsByLevel = getSpellsByLevel(party, player);

  const getList = (): { [key: string]: Spell[] } => {
    if (displayBy === "level") {
      return spellsByLevel;
    }

    if (displayBy === "player") {
      return spellsByPlayer;
    }

    return {};
  };

  const getPrefix = () => {
    if (displayBy === "level") {
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
              params.delete("player");
              router.replace(`${pathName}?${params.toString()}`);
            }}
          >
            <XMarkIcon className="size-4" />
          </Button>
        )}
      </div>

      <Tabs defaultValue={displayBy} className="mb-4 w-[400px]">
        <TabsList>
          <TabsTrigger value="player" onClick={() => setDisplayBy("player")}>
            Par joueur
          </TabsTrigger>
          <TabsTrigger value="level" onClick={() => setDisplayBy("level")}>
            Par niveau
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-4 grid-rows-3 gap-4">
        {entries(getList()).map(([name, spells]) => (
          <Card key={name}>
            <CardHeader>
              <CardTitle
                className={clsx({ "cursor-pointer": displayBy === "player" })}
                onClick={() => {
                  if (displayBy === "player") {
                    const params = new URLSearchParams(searchParams);
                    params.set("player", name);
                    router.replace(`${pathName}?${params.toString()}`);
                  }
                }}
              >{`${getPrefix()} ${capitalize(name)}`}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {spells.map((spell) => (
                  <li key={spell.id}>
                    <Link href={`/spells/${spell.id}`}>{spell.name}</Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Spells), { ssr: false });
