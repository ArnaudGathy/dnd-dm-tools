import { Card, CardContent } from "@/components/ui/card";
import { APISpell, SpellSource } from "@/types/schemas";
import { Link } from "@/components/ui/Link";
import { getSpellById } from "@/lib/api/spells";
import SpellHeader from "@/app/(with-nav)/spells/[id]/SpellHeader";
import SpellCasting from "@/app/(with-nav)/spells/[id]/SpellCasting";
import SpellDetails from "@/app/(with-nav)/spells/[id]/SpellDetails";

export const SpellDescription = async ({ spell }: { spell: APISpell }) => {
  if (!spell.index) {
    throw new Error("Missing spell index");
  }

  const spellFromApp = await getSpellById(spell.index);

  return (
    <div className="col-span-3">
      <Card>
        <SpellHeader spellFromApp={spellFromApp} spellFromAPI={spell} />
        <CardContent>
          <div className="space-y-4">
            <SpellCasting spell={spell} />

            {!!spell.desc?.length && (
              <div className="flex flex-col gap-4 border-t-2 pt-4">
                {spell.desc.map((desc, index) => (
                  <div key={index} className="whitespace-pre-line">
                    {desc}
                  </div>
                ))}
                {!!spell.higher_level?.length && (
                  <div className="flex flex-col gap-2">
                    {spell.higher_level?.map((level, index) => (
                      <div key={index}>{level}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <SpellDetails spell={spell} />

            <div className="flex flex-col gap-2 border-t-2 pt-4">
              {spell.name && (
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  Reférence originale :
                  <Link
                    href={`https://www.aidedd.org/public/spell/${spell.index}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1"
                  >
                    {spell.name}
                  </Link>
                </span>
              )}

              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Source de données :</span>
                {spell.source === SpellSource.AIDE_DD_2024 && (
                  <Link
                    href="https://www.aidedd.org/public/spell"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    AideDD (2024)
                  </Link>
                )}
                {spell.source === SpellSource.LOCAL && "Fichier local"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
