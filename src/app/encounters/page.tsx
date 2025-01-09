import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { entries } from "remeda";
import { groupEncounters, typedEncounters } from "@/utils/utils";
import { Link } from "@/components/ui/Link";

const groupedEncounters = groupEncounters(typedEncounters);

const Encounters = () => {
  return (
    <div className="grid grid-rows-2 gap-4">
      {entries(groupedEncounters).map(([scenario, encounters]) => (
        <div key={scenario}>
          <h1 className="mb-6 text-2xl font-semibold leading-none tracking-tight">
            {scenario}
          </h1>
          <div className="grid grid-cols-4 gap-4">
            {!!encounters &&
              entries(encounters).map(([location, encounters]) => (
                <Card key={location}>
                  <CardHeader>
                    <CardTitle>{location}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul>
                      {encounters.map((encounter) => (
                        <li key={encounter.id}>
                          <Link href={`/encounters/${encounter.id}`}>
                            {encounter.location.mapMarker} - {encounter.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Encounters;
