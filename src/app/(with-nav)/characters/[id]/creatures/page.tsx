import {
  CREATURES_FILTER_BY,
  CREATURES_GROUP_BY,
  getCharacterCreatures,
} from "@/lib/api/creatures";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/components/ui/Link";
import { entries } from "remeda";
import { getValidCharacter } from "@/lib/utils";
import CreatureFavoriteIcon from "@/app/(with-nav)/characters/[id]/creatures/CreatureFavoriteIcon";
import EditModeButton from "@/app/(with-nav)/characters/[id]/spells/EditModeButton";
import AddCreatureForm from "@/app/(with-nav)/characters/[id]/creatures/AddCreatureForm";
import DeleteCreatureButton from "@/app/(with-nav)/characters/[id]/creatures/DeleteCreatureButton";
import CreaturesFilters from "./CreaturesFilters";

export default async function CreatureList({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    groupBy: CREATURES_GROUP_BY;
    filterBy: CREATURES_FILTER_BY;
    editMode?: "true";
  }>;
}) {
  const { id } = await params;
  const awaitedSearchParams = await searchParams;

  const character = await getValidCharacter(id);

  const groupBy = awaitedSearchParams.groupBy ?? CREATURES_GROUP_BY.CR;
  const filterBy = awaitedSearchParams.filterBy;
  const isEditMode = awaitedSearchParams.editMode === "true";

  const creatures = await getCharacterCreatures({
    characterId: parseInt(id, 10),
    groupBy,
    filterBy,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-fit flex-col gap-4">
        <div className="flex justify-between">
          <h1 className={"scroll-m-20 text-2xl font-bold tracking-tight"}>
            {`Créatures de ${character.name}`}
          </h1>
          <EditModeButton />
        </div>

        {isEditMode && (
          <AddCreatureForm characterId={character.id.toString()} />
        )}
        <CreaturesFilters />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {Object.keys(creatures).length === 0 ? (
          <div>Aucune créatures à afficher.</div>
        ) : (
          entries(creatures).map(([groupingValue, values]) => (
            <Card key={groupingValue}>
              <CardHeader>
                <CardTitle>
                  {groupBy === CREATURES_GROUP_BY.ALPHABETICAL
                    ? groupingValue.toUpperCase()
                    : `FP ${groupingValue}`}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col">
                {values.map((creature) => (
                  <div key={creature.id} className="flex items-center gap-2">
                    <CreatureFavoriteIcon
                      character={character}
                      creature={creature}
                    />
                    <Link href={`/creatures/${creature.id}`}>
                      {creature.name}
                    </Link>
                    {isEditMode && (
                      <DeleteCreatureButton
                        characterId={character.id}
                        creature={creature}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
