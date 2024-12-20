import {
  getCreatureFromId,
  groupEncounters,
  typedEncounters,
} from "@/utils/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { entries, filter, flat, unique, values } from "remeda";
import { Link } from "@/components/ui/Link";
import { notFound } from "next/navigation";
import { StatBlock } from "@/app/creatures/StatBlock";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const creatureId = (await params).id;
  const creature = getCreatureFromId(parseInt(creatureId));

  if (!creature) {
    return notFound();
  }

  const encounteredIn = groupEncounters(
    filter(typedEncounters, (encounter) =>
      unique(flat(values(encounter.ennemies))).includes(creature.id),
    ),
  );

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <StatBlock creature={creature} isCollapsible={false} />
      </div>

      {!!Object.keys(encounteredIn).length && (
        <Card>
          <CardHeader>
            <CardTitle>Rencontré dans :</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {entries(encounteredIn).map(([location, encounters]) => (
                <li key={location}>
                  {location}
                  <ul className="ml-6">
                    {entries(encounters).map(([encounter, encounters]) => (
                      <li key={encounter}>
                        {encounter}
                        <ul className="ml-6">
                          {encounters.map((encounter) => (
                            <li key={encounter.id}>
                              <Link href={`/encounters/${encounter.id}`}>
                                {encounter.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Page;
