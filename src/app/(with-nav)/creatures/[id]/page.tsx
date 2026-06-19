import { getCreature } from "@/lib/external-apis/aidedd";
import { StatBlock } from "@/components/statblocks/StatBlock";
import { getSessionData } from "@/lib/utils";
import { getEncountersForCreatureId } from "@/utils/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/components/ui/Link";

export default async function Creature({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const creature = await getCreature(id);

  const { isAdmin } = await getSessionData();
  const encounters = isAdmin ? getEncountersForCreatureId(id) : [];

  return (
    <div className="flex gap-4">
      <StatBlock creature={creature} />

      {isAdmin && encounters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{`Rencontres (${encounters.length})`}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {encounters.map((encounter) => (
              <Link key={encounter.id} href={`/encounters/${encounter.id}`}>
                {`${encounter.location.name} (${encounter.location.mapMarker}) — ${encounter.name}`}
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
