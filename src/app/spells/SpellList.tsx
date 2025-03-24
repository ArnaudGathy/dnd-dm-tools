import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SparklesIcon } from "@heroicons/react/16/solid";
import { Link } from "@/components/ui/Link";
import { Spell } from "@prisma/client";
import { capitalize, entries } from "remeda";

export const SpellList = ({
  spellsGroupedBy,
  label,
}: {
  spellsGroupedBy: Record<string, Spell[]>;
  label: string;
}) => {
  const spellEntries = entries(spellsGroupedBy);
  if (spellEntries.length === 0) {
    return (
      <div className="mt-4 text-muted-foreground">Aucun sort à afficher.</div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-wrap gap-4">
          {spellEntries.map(([property, spells]) => (
            <Card key={property} className="min-w-full md:min-w-[24%]">
              <CardHeader>
                <CardTitle>{`${label} ${capitalize(property)}`}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  {spells.map((spell) => (
                    <li key={spell.id} className="flex items-center gap-2">
                      <div className="w-4">
                        {spell.isRitual && (
                          <SparklesIcon className="size-4 text-emerald-500" />
                        )}
                      </div>
                      <Link href={`/spells/${spell.id}`}>{spell.name}</Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
