import {
  getCreatureFromId,
  getIdFromEnemy,
  groupEncounters,
  typedEncounters,
  typedParties,
} from "@/utils/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  entries,
  filter,
  flat,
  flatMap,
  map,
  pipe,
  unique,
  values,
} from "remeda";
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

  const inPlayerList = pipe(
    typedParties,
    flatMap((party) => party.characters),
    filter(
      (character) =>
        !!character.creatures && character.creatures.includes(creature.id),
    ),
  );

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <StatBlock creature={creature} isCollapsible={false} />
      </div>

      <div className="grid grid-cols-1 grid-rows-2 gap-4">
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

        {!!Object.keys(inPlayerList).length && (
          <Card>
            <CardHeader>
              <CardTitle>Dans la liste de créatures de :</CardTitle>
            </CardHeader>
            <CardContent>
              {
                <ul>
                  {inPlayerList.map((player) => (
                    <li key={player.name}> {player.name}</li>
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
