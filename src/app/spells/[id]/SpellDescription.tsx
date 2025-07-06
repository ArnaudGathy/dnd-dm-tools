import { Card, CardContent } from "@/components/ui/card";
import { APISpell, SpellSource } from "@/types/schemas";
import { Link } from "@/components/ui/Link";
import { getSpellById } from "@/lib/api/spells";
import SpellHeader from "@/app/spells/[id]/SpellHeader";
import SpellCasting from "@/app/spells/[id]/SpellCasting";
import SpellDetails from "@/app/spells/[id]/SpellDetails";
import { SpellVersion } from "@prisma/client";

export const SpellDescription = async ({ spell }: { spell: APISpell }) => {
  if (!spell.index || !spell.version) {
    throw new Error("Missing spell index or version");
  }

  const spellFromApp = await getSpellById(spell.index, spell.version);

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
                  <div key={index}>{desc}</div>
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
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Source :</span>
                {spell.source === SpellSource.API && (
                  <Link
                    href="https://www.dnd5eapi.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    D&D 5e API
                  </Link>
                )}
                {spell.source === SpellSource.AIDE_DD && (
                  <Link
                    href="https://www.aidedd.org/dnd-filters/sorts.php"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    AideDD (2014)
                  </Link>
                )}
                {spell.source === SpellSource.AIDE_DD_2024 && (
                  <Link
                    href="https://www.aidedd.org/public/spell"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    AideDD (2024)
                  </Link>
                )}
                {spell.source === SpellSource.MIXED && (
                  <div className="flex gap-1">
                    <Link
                      href="https://www.aidedd.org/dnd-filters/sorts.php"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      AideDD (2014)
                    </Link>
                    &
                    <Link
                      href="https://www.dnd5eapi.co/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      D&D 5e API
                    </Link>
                  </div>
                )}
                {spell.source === SpellSource.LOCAL && "Fichier local"}
              </span>

              {spell.name && (
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  Lien AideDD :
                  <Link
                    href={
                      spell.version === SpellVersion.V2024
                        ? `https://www.aidedd.org/public/spell/${spell.index}`
                        : `https://www.aidedd.org/dnd/sorts.php?vo=${spell.index}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1"
                  >
                    {spell.name}
                  </Link>
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
