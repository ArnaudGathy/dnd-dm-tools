import CreatureList from "@/app/creatures/CreatureList";
import CreatureFilters from "@/app/creatures/CreatureFilters";
import { typedCreatures } from "@/utils/utils";
import { filter, groupBy, isDefined, map, pipe, sort } from "remeda";
import { Creature } from "@/types/types";
import { getValidCharacter } from "@/lib/utils";

const getCreatures = ({
  creatureIdList = [],
  search,
}: {
  creatureIdList?: number[];
  search: string;
}) => {
  return pipe(
    creatureIdList,
    map((id) =>
      typedCreatures.find(
        (c) =>
          c.id === id && c.name.toLowerCase().includes(search.toLowerCase()),
      ),
    ),
    filter(isDefined),
    sort((c1, c2) => c1.name.localeCompare(c2.name)),
  );
};

const groupCreatureByFirstLetter = (creatureList: Creature[]) => {
  return groupBy(creatureList, (c) => c.name.charAt(0).toLowerCase());
};

export default async function Creatures({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ search?: string }>;
}) {
  const { id } = await params;
  const { search } = await searchParams;

  const character = await getValidCharacter(id);

  const creatures = getCreatures({
    creatureIdList: character.creatures,
    search: search ?? "",
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className={"scroll-m-20 text-2xl font-bold tracking-tight"}>
        {`Liste des créatures de ${character.name}`}
      </h1>
      <CreatureFilters />
      <CreatureList
        creaturesGroupedBy={groupCreatureByFirstLetter(creatures)}
      />
    </div>
  );
}
