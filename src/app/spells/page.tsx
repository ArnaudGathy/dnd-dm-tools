"use client";

import { typedSpells } from "@/utils/utils";
import {
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
import { useSearchParams } from "next/navigation";

const getSpellsByPlayer = (party: Party) =>
  pipe(
    party.characters,
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

const getSpellsByLevel = (party: Party) => {
  const partySpells = pipe(
    party.characters,
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
  const player = searchParams.get("player")?.toLowerCase();

  const party = getParty();

  const [displayBy, setDisplayBy] = useState("player");

  if (!party) {
    return null;
  }

  const spellsByPlayer = getSpellsByPlayer(party);
  const spellsByLevel = getSpellsByLevel(party);

  const getList = (): { [key: string]: Spell[] } => {
    if (displayBy === "level") {
      return spellsByLevel;
    }

    if (displayBy === "player") {
      if (player) {
        return { [player]: spellsByPlayer[player] };
      }
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
      <h1 className={"mb-4 scroll-m-20 text-2xl font-bold tracking-tight"}>
        Liste des sorts
      </h1>

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
              <CardTitle>
                {getPrefix()} <span className="capitalize">{name}</span>
              </CardTitle>
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
