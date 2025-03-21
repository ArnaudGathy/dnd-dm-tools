import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { filter, flatMap, pipe, prop, sortBy } from "remeda";
import { typedParties } from "@/utils/utils";
import { APISpell } from "@/types/schemas";

export const SpellOwnedBy = ({ spell }: { spell: APISpell }) => {
  const playersWithSpell = pipe(
    typedParties,
    flatMap((party) => party.characters),
    sortBy(prop("name")),
    filter(
      (character) => !!spell.index && character.spells.includes(spell.index),
    ),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sort appris par :</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {playersWithSpell.map((player) => (
            <li key={player.id}>{player.name}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
