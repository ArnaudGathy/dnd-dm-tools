import { ReactNode } from "react";
import { convertFromFeetToSquares } from "@/utils/utils";
import { APISpell } from "@/types/schemas";
import { StatTile } from "@/app/(with-nav)/spells/[id]/StatTile";
import { SpellComponents } from "@/app/(with-nav)/spells/[id]/SpellComponents";
import { Crosshair, Hourglass, Zap } from "lucide-react";

// Render the casting time with each property color-coded inline: bonus → orange,
// reaction → purple (the whole base phrase), and the "Rituel" option → emerald.
// This carries the bonus/reaction/ritual info that used to live in header tags.
const renderCastingTime = (raw: string): ReactNode => {
  const lower = raw.toLowerCase();
  const baseTone = lower.includes("bonus")
    ? "text-orange-400"
    : lower.includes("reaction") || lower.includes("réaction")
      ? "text-purple-400"
      : undefined;

  return raw.split(/(\bRituel\b)/i).map((part, index) =>
    /^rituel$/i.test(part) ? (
      <span key={index} className="text-emerald-400">
        {part}
      </span>
    ) : (
      <span key={index} className={baseTone}>
        {part}
      </span>
    ),
  );
};

export default function SpellCasting({ spell }: { spell: APISpell }) {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-[2fr_1fr_2fr]">
      {spell.casting_time && (
        <StatTile
          icon={<Zap className="size-3.5" />}
          label="Incantation"
          value={renderCastingTime(spell.casting_time)}
        />
      )}
      {spell.range && (
        <StatTile
          icon={<Crosshair className="size-3.5" />}
          label="Portée"
          value={convertFromFeetToSquares(spell.range)}
        />
      )}
      {spell.duration && (
        <StatTile
          icon={<Hourglass className="size-3.5" />}
          label="Durée"
          value={spell.duration}
          valueClassName={spell.concentration ? "text-yellow-500" : undefined}
        />
      )}

      {!!spell.components?.length && (
        <StatTile
          className="col-span-2 md:col-span-3"
          label="Composants"
          value={<SpellComponents components={spell.components} material={spell.material} />}
        />
      )}
    </div>
  );
}
