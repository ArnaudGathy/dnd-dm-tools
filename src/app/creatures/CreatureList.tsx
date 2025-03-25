import { capitalize, entries } from "remeda";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/components/ui/Link";
import { Creature } from "@/types/types";

export default function CreatureList({
  creaturesGroupedBy,
}: {
  creaturesGroupedBy: Record<string, Creature[]>;
}) {
  const creaturesEntries = entries(creaturesGroupedBy);
  if (creaturesEntries.length === 0) {
    return (
      <div className="mt-4 text-muted-foreground">
        Aucune créatures à afficher.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      {creaturesEntries.map(([name, creatures]) => (
        <Card key={name} className="min-w-full md:min-w-[19%]">
          <CardHeader>
            <CardTitle>{capitalize(name)}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {creatures.map((creature) => {
                return (
                  <li key={creature.id}>
                    <Link href={`/creatures/${creature.id}`}>
                      {creature.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
