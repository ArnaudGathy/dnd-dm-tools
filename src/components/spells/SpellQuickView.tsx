"use client";

import { APISpell } from "@/types/schemas";
import SpellCasting from "@/app/(with-nav)/spells/[id]/SpellCasting";
import SpellDetails from "@/app/(with-nav)/spells/[id]/SpellDetails";
import { RichText } from "@/components/statblocks/richText";

/** Compact full-description view of a spell, used inside popovers (encounter
 *  tracker quick access, character sheet combat tab) instead of navigating to
 *  the /spells/[id] page. */
export default function SpellQuickView({ spell }: { spell: APISpell }) {
  const eyebrow = [spell.school?.name, spell.level !== undefined && `Niveau ${spell.level}`]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        {eyebrow && (
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {eyebrow}
          </span>
        )}
        <h3 className="text-xl font-semibold leading-tight tracking-tight">
          {spell.name ?? spell.index}
        </h3>
      </div>

      <SpellCasting spell={spell} />

      {!!spell.desc?.length && (
        <div className="flex flex-col gap-3 border-t pt-4 leading-relaxed text-foreground/90">
          {spell.desc.map((desc, index) => (
            <p key={index} className="whitespace-pre-line text-sm">
              <RichText
                text={desc}
                averagePrefix={false}
                textClassName="text-foreground/90"
                interaction="tooltip"
              />
            </p>
          ))}

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
                    interaction="tooltip"
                  />
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      <SpellDetails spell={spell} />
    </div>
  );
}
