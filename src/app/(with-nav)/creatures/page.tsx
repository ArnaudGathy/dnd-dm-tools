import { CREATURES_GROUP_BY, getAllAvailableCreatures } from "@/lib/api/creatures";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/components/ui/Link";
import { entries } from "remeda";
import { restrictToAdmins } from "@/lib/utils";
import { getChallengeRatingAsFraction } from "@/utils/utils";
import CreaturesListFilters from "./CreaturesListFilters";

export default async function AllCreaturesList({
  searchParams,
}: {
  searchParams: Promise<{ groupBy?: CREATURES_GROUP_BY }>;
}) {
  await restrictToAdmins();

  const { groupBy = CREATURES_GROUP_BY.ALPHABETICAL } = await searchParams;
  const creatures = await getAllAvailableCreatures({ groupBy });

  const groups = entries(creatures).toSorted(([a], [b]) =>
    groupBy === CREATURES_GROUP_BY.CR ? parseFloat(a) - parseFloat(b) : a.localeCompare(b),
  );
  const totalCount = Object.values(creatures).reduce((sum, list) => sum + list.length, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="sm:flex-row sm:items-center sm:justify-between flex flex-col gap-4">
        <h1 className="flex scroll-m-20 items-center gap-2 text-2xl font-semibold leading-none tracking-tight">
          Créatures
          <Badge variant="secondary" className="font-normal tabular-nums">
            {totalCount}
          </Badge>
        </h1>
        <CreaturesListFilters />
      </div>

      {groups.length === 0 ? (
        <div className="text-muted-foreground">Aucune créature à afficher.</div>
      ) : (
        <div className="sm:columns-2 lg:columns-3 gap-4 [column-gap:1rem] 2xl:columns-4">
          {groups.map(([groupingValue, values]) => (
            <Card key={groupingValue} className="mb-4 break-inside-avoid">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg">
                  {groupBy === CREATURES_GROUP_BY.ALPHABETICAL
                    ? groupingValue.toUpperCase()
                    : `FP ${getChallengeRatingAsFraction(parseFloat(groupingValue))}`}
                </CardTitle>
                <Badge variant="outline" className="shrink-0 font-normal tabular-nums">
                  {values.length}
                </Badge>
              </CardHeader>
              <CardContent className="px-2 pb-2">
                <ul className="flex flex-col">
                  {values.map((creature) => (
                    <li key={creature.id}>
                      <Link
                        href={`/creatures/${creature.id}`}
                        className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm no-underline transition-colors hover:bg-muted"
                      >
                        <span className="min-w-[1.75rem] shrink-0 rounded bg-muted px-1.5 py-0.5 text-center font-mono text-xs text-muted-foreground transition-colors group-hover:bg-background group-hover:text-foreground">
                          {getChallengeRatingAsFraction(creature.challengeRating)}
                        </span>
                        <span className="flex-1 truncate text-muted-foreground transition-colors group-hover:text-foreground">
                          {creature.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
