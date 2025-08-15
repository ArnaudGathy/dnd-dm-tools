import { getCharacterSpells } from "@/lib/api/spells";
import { Card, CardContent } from "@/components/ui/card";
import SpellHeader from "@/app/(with-nav)/spells/[id]/SpellHeader";
import SpellCasting from "@/app/(with-nav)/spells/[id]/SpellCasting";
import SpellDetails from "@/app/(with-nav)/spells/[id]/SpellDetails";
import { SpellsSearchParams } from "@/app/(with-nav)/spells/SpellsFilters";
import { getSpellDetails } from "@/lib/external-apis/aidedd";

export default async function SpellCardsList({
  searchParams,
  characterId,
}: {
  searchParams: SpellsSearchParams;
  characterId: number;
}) {
  const { search, filterBy } = searchParams;
  const spellList = await getCharacterSpells({
    search,
    filterBy,
    characterId: characterId,
  });

  const spellDetails = await Promise.all(
    spellList.map(async (spell) => {
      const spellFromApi = await getSpellDetails(spell.spellId);
      return {
        spellFromApp: spell.spell,
        spellFromAPI: spellFromApi,
        isFavorite: spell.isFavorite,
      };
    }),
  );

  return (
    <div className="flex w-full flex-col gap-4 md:grid md:grid-cols-3">
      {spellDetails.map(({ spellFromApp, spellFromAPI, isFavorite }) => {
        if (!spellFromAPI?.index) {
          return null;
        }

        return (
          <Card key={spellFromAPI.index} className="">
            <SpellHeader
              spellFromApp={spellFromApp}
              spellFromAPI={spellFromAPI}
              isFavorite={isFavorite}
              characterId={characterId}
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
