import { getCharacterSpells } from "@/lib/api/spells";
import { SpellsSearchParams } from "@/app/characters/[id]/spells/page";
import { getSpell } from "@/lib/external-apis/externalAPIs";
import { Card, CardContent } from "@/components/ui/card";
import SpellHeader from "@/app/spells/[id]/SpellHeader";
import SpellCasting from "@/app/spells/[id]/SpellCasting";
import SpellDetails from "@/app/spells/[id]/SpellDetails";

export default async function SpellCardsList({
  searchParams,
  characterId,
}: {
  searchParams: SpellsSearchParams;
  characterId: number;
}) {
  const spellList = await getCharacterSpells({
    search: searchParams.search,
    characterId: characterId,
  });

  const spellDetails = await Promise.all(
    spellList.map(async (spell) => {
      const spellFromApi = await getSpell(spell.spellId);
      return {
        spellFromApp: spell.spell,
        spellFromAPI: spellFromApi,
      };
    }),
  );

  return (
    <div className="flex w-full flex-col gap-4 md:grid md:grid-cols-3">
      {spellDetails.map(({ spellFromApp, spellFromAPI }) => {
        if (!spellFromAPI?.index) {
          return null;
        }

        return (
          <Card key={spellFromAPI.index} className="">
            <SpellHeader
              spellFromApp={spellFromApp}
              spellFromAPI={spellFromAPI}
              tiny
            />
            <CardContent>
              <div className="space-y-4">
                <SpellCasting spell={spellFromAPI} tiny />
                <SpellDetails spell={spellFromAPI} tiny />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
