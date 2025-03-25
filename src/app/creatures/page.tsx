import CreatureList from "@/app/creatures/CreatureList";
import { filter, groupBy, sort } from "remeda";
import { typedCreatures } from "@/utils/utils";
import CreatureFilters from "@/app/creatures/CreatureFilters";

const getCreaturesGroupedByFirstLetter = ({ search }: { search: string }) =>
  groupBy(
    sort(
      filter(typedCreatures, (creature) =>
        creature.name.toLowerCase().includes(search.toLowerCase()),
      ),
      (c1, c2) => c1.name.localeCompare(c2.name),
    ),
    (creature) => creature.name[0],
  );

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;

  return (
    <div className="flex flex-col gap-4">
      <h1 className={"scroll-m-20 text-2xl font-bold tracking-tight"}>
        Liste des créatures
      </h1>
      <CreatureFilters />
      <CreatureList
        creaturesGroupedBy={getCreaturesGroupedByFirstLetter({
          search: search ?? "",
        })}
      />
    </div>
  );
}
