import { ReactNode } from "react";
import { Gem, Hand, Speech } from "lucide-react";
import { Chip } from "@/app/(with-nav)/spells/[id]/StatTile";

const COMPONENT_META = [
  { letter: "V", label: "Verbal", icon: Speech },
  { letter: "S", label: "Somatique", icon: Hand },
  { letter: "M", label: "Matériel", icon: Gem },
] as const;

// A priced material component must actually be paid for (unlike free flavour
// components), so the cost is the thing the reader needs to spot. Match monetary
// amounts — "300 po", "1 pc", "2 pièces de cuivre" — while avoiding false hits on
// words like "poudre" (the `\b` after the currency unit guards that).
const PRICE_RE =
  /(\d[\d\s.,]*\s*(?:po|pa|pc|pp)\b|\d+\s*pièces?\s+d[e']\s*(?:cuivre|argent|or|platine))/gi;

// Split on the price pattern (one capturing group → matches land on odd indices)
// so we never call a stateful global regex's .test() in a loop.
const renderMaterial = (text: string): ReactNode =>
  text.split(PRICE_RE).map((segment, index) =>
    index % 2 === 1 ? (
      <span key={index} className="font-semibold text-blue-400">
        {segment}
      </span>
    ) : (
      <span key={index}>{segment}</span>
    ),
  );

export const SpellComponents = ({
  components,
  material,
}: {
  components: string[];
  material?: string;
}) => {
  const present = COMPONENT_META.filter((c) => components.includes(c.letter));
  if (!present.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-start gap-2 font-normal">
      {present.map(({ letter, label, icon: Icon }) => {
        // The material name lives inside the "Matériel" chip so it reads as one
        // finished unit; the chip sizes to its content (up to full width) and wraps
        // its own text, so short materials don't leave a trailing empty bar. Icon,
        // label and material are flat (not nested) so they stay aligned on one line.
        if (letter === "M" && material) {
          return (
            <Chip key={letter} className="max-w-full flex-wrap gap-x-1.5 gap-y-0.5">
              <Gem className="size-3.5 shrink-0" />
              {label}
              <span className="text-muted-foreground">{renderMaterial(material)}</span>
            </Chip>
          );
        }

        return (
          <Chip key={letter}>
            <Icon className="size-3.5" />
            {label}
          </Chip>
        );
      })}
    </div>
  );
};
