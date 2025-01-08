import { typedCreatures } from "@/utils/utils";
import { entries, groupBy, prop, sortBy } from "remeda";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/components/ui/Link";

const creaturesGroupedByFirstLetter = groupBy(
  sortBy(typedCreatures, prop("name")),
  (creature) => creature.name[0],
);

const Home = () => {
  return (
    <div>
      <h1 className={"mb-4 scroll-m-20 text-2xl font-bold tracking-tight"}>
        Liste des créatures
      </h1>

      <div className="grid grid-cols-5 grid-rows-6 gap-4">
        {entries(creaturesGroupedByFirstLetter).map(([letter, creatures]) => {
          return (
            <Card key={letter}>
              <CardHeader>
                <CardTitle>{letter}</CardTitle>
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
          );
        })}
      </div>
    </div>
  );
};

export default Home;
