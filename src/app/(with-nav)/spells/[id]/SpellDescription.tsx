import { Card, CardContent } from "@/components/ui/card";
import { APISpell, SpellSource } from "@/types/schemas";
import { Link } from "@/components/ui/Link";
import { getSpellById } from "@/lib/api/spells";
import { RichText } from "@/components/statblocks/richText";
import SpellHeader from "@/app/(with-nav)/spells/[id]/SpellHeader";
import SpellCasting from "@/app/(with-nav)/spells/[id]/SpellCasting";
import SpellDetails from "@/app/(with-nav)/spells/[id]/SpellDetails";

export const SpellDescription = async ({ spell }: { spell: APISpell }) => {
  if (!spell.index) {
    throw new Error("Missing spell index");
  }

  const spellFromApp = await getSpellById(spell.index);

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="overflow-hidden p-0">
        <SpellHeader spellFromApp={spellFromApp} spellFromAPI={spell} />

        <CardContent className="flex flex-col gap-6 p-4 md:p-6">
          <SpellCasting spell={spell} />

          {!!spell.desc?.length && (
            <section className="flex flex-col gap-4 border-t pt-6">
              <div className="flex flex-col gap-4 leading-relaxed text-foreground/90">
                {spell.desc.map((desc, index) => (
                  <p key={index} className="whitespace-pre-line">
                    <RichText
                      text={desc}
                      averagePrefix={false}
                      textClassName="text-foreground/90"
                      interaction="popover"
                    />
                  </p>
                ))}
              </div>

              {!!spell.higher_level?.length && (
                <div className="flex flex-col gap-1 rounded-md border border-l-2 border-l-primary bg-secondary/20 p-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    À plus haut niveau
                  </span>
                  {spell.higher_level.map((level, index) => (
                    <p key={index} className="text-sm leading-relaxed">
                      <RichText
                        text={level}
                        averagePrefix={false}
                        textClassName="text-foreground/90"
                        interaction="popover"
                      />
                    </p>
                  ))}
                </div>
              )}
            </section>
          )}

          <SpellDetails spell={spell} />

          <footer className="flex flex-col gap-1 border-t pt-4 text-xs text-muted-foreground">
            {!!spell.classes?.length && (
              <span className="mb-1">
                <span className="font-medium uppercase tracking-wide">Classes</span>
                {" · "}
                {spell.classes.map((c) => c.name).join(" · ")}
              </span>
            )}

            {spell.name && (
              <span className="flex items-center gap-2">
                Référence originale :
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

            <span className="flex items-center gap-2">
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
          </footer>
        </CardContent>
      </Card>
    </div>
  );
};
