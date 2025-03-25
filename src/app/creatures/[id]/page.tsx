import {
  getCreatureFromId,
  getIdFromEnemy,
  groupEncounters,
  typedEncounters,
} from "@/utils/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { entries, filter, flat, map, unique, values } from "remeda";
import { Link } from "@/components/ui/Link";
import { notFound } from "next/navigation";
import { StatBlock } from "@/app/creatures/StatBlock";
import { getSessionData } from "@/lib/utils";
import { getCharactersByCreatureId } from "@/lib/api/characters";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { isAdmin } = await getSessionData();
  const creatureId = (await params).id;
  const creature = getCreatureFromId(parseInt(creatureId));

  if (!creature) {
    return notFound();
  }

  const encounteredIn = groupEncounters(
    filter(typedEncounters, (encounter) =>
      unique(
        map(flat(values(encounter.ennemies)), (enemy) => {
          if (enemy) {
            return getIdFromEnemy(enemy);
          }
          return undefined;
        }),
      ).includes(creature.id),
    ),
  );

  const charactersWithCreatures = await getCharactersByCreatureId(creature.id);

  return (
    <div className="flex gap-4 md:grid md:grid-cols-3">
      <div className="col-span-2">
        <StatBlock creature={creature} />
      </div>

      <div className="hidden flex-col gap-4 md:flex">
        {isAdmin && !!Object.keys(encounteredIn).length && (
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

        {charactersWithCreatures.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Dans la liste de créatures de :</CardTitle>
            </CardHeader>
            <CardContent>
              {
                <ul>
                  {charactersWithCreatures.map(({ name, id }) => (
                    <li key={id}> {name}</li>
                  ))}
                </ul>
              }
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Page;
