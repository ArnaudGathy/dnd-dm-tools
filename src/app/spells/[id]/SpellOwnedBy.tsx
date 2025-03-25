import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APISpell } from "@/types/schemas";
import { getCharactersBySpellId } from "@/lib/api/spells";

export const SpellOwnedBy = async ({ spell }: { spell: APISpell }) => {
  if (!spell.index) {
    return null;
  }

  const playersWithSpell = await getCharactersBySpellId(spell.index);

  if (!playersWithSpell.length) {
    return null;
  }

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
