import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SparklesIcon, HeartIcon } from "@heroicons/react/16/solid";
import {
  SparklesIcon as SparklesIconOutline,
  HeartIcon as HeartIconOutline,
} from "@heroicons/react/24/outline";
import { Link } from "@/components/ui/Link";
import { capitalize, entries } from "remeda";
import { SpellWithFavorite } from "@/lib/api/spells";
import { FavoriteButton } from "@/app/spells/[id]/FavoriteButton";
import DeleteSpellButton from "@/app/characters/[id]/spells/DeleteSpellButton";
import { SpellVersion } from "@prisma/client";

export const SpellList = ({
  spellsGroupedBy,
  label,
  showFavorites = false,
  characterId,
  isEditMode = false,
}: {
  characterId?: number;
  spellsGroupedBy: Record<string, SpellWithFavorite[]>;
  label: string;
  showFavorites?: boolean;
  isEditMode?: boolean;
}) => {
  const isCharacterList = !!characterId;
  const spellEntries = entries(spellsGroupedBy);
  if (spellEntries.length === 0) {
    return (
      <div className="mt-4 text-muted-foreground">Aucun sort à afficher.</div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        {spellEntries.map(([property, spells]) => (
          <Card
            key={property}
            className="min-w-full md:min-w-[24%] md:max-w-[24%]"
          >
            <CardHeader>
              <CardTitle>{`${label} ${capitalize(property)}`}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {spells.map((spell) => (
                  <li key={spell.id} className="flex items-center gap-2">
                    <div className="flex min-w-4">
                      {isEditMode && characterId ? (
                        <DeleteSpellButton
                          spell={spell}
                          characterId={characterId}
                        />
                      ) : showFavorites && characterId ? (
                        <FavoriteButton
                          onIcon={
                            spell.isRitual ? (
                              <SparklesIcon className="size-4 text-primary" />
                            ) : (
                              <HeartIcon className="size-4 text-primary" />
                            )
                          }
                          offIcon={
                            spell.isRitual ? (
                              <SparklesIconOutline className="size-4 text-emerald-500" />
                            ) : (
                              <HeartIconOutline className="size-4" />
                            )
                          }
                          isFavorite={spell.isFavorite}
                          spellId={spell.id}
                          spellVersion={spell.version}
                          characterId={characterId}
                        />
                      ) : (
                        spell.isRitual && (
                          <SparklesIcon className="size-4 text-emerald-500" />
                        )
                      )}
                    </div>
                    <Link
                      href={`/spells/${spell.id}?v=${spell.version}`}
                      className="truncate"
                    >
                      {spell.name}
                      {spell.version === SpellVersion.V2024 &&
                        !isCharacterList &&
                        " (2024)"}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
