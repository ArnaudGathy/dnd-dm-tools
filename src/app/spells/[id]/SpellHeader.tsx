import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { Spell } from "@prisma/client";
import { APISpell } from "@/types/schemas";
import Link from "next/link";
import { FavoriteButton } from "@/app/spells/[id]/FavoriteButton";
import {
  HeartIcon as HeartIconOutline,
  SparklesIcon as SparklesIconOutline,
} from "@heroicons/react/24/outline";

export default async function SpellHeader({
  spellFromAPI,
  spellFromApp,
  isFavorite,
  characterId,
  tiny,
}: {
  spellFromApp: Spell | null;
  spellFromAPI: APISpell;
  isFavorite?: boolean;
  characterId?: number;
  tiny?: boolean;
}) {
  if (!spellFromAPI.index) {
    throw new Error("Missing spell index");
  }

  const spellName = spellFromApp?.name
    ? spellFromApp.name
    : (spellFromAPI.name ?? spellFromAPI.index);
  const isRitual = spellFromApp?.isRitual ?? spellFromAPI.ritual;

  return (
    <CardHeader>
      {(spellFromApp?.name || spellFromAPI.name) && (
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            {tiny && isFavorite !== undefined && characterId ? (
              <FavoriteButton
                onIcon={
                  isRitual ? (
                    <SparklesIcon className="size-6 text-primary" />
                  ) : (
                    <HeartIcon className="size-6 text-primary" />
                  )
                }
                offIcon={
                  isRitual ? (
                    <SparklesIconOutline className="size-6 text-emerald-500" />
                  ) : (
                    <HeartIconOutline className="size-6" />
                  )
                }
                isFavorite={isFavorite}
                spellId={spellFromApp?.id ?? spellFromAPI.index}
                characterId={characterId}
              />
            ) : (
              isRitual && <SparklesIcon className="size-6 text-emerald-500" />
            )}

            <span className="truncate">
              {tiny ? (
                <Link href={`/spells/${spellFromAPI.index}`}>{spellName}</Link>
              ) : (
                spellName
              )}
            </span>
          </div>
        </CardTitle>
      )}

      {!tiny && (
        <CardDescription className="flex gap-2">
          {spellFromAPI.level !== undefined && (
            <span>Niveau {spellFromAPI.level}</span>
          )}
          {spellFromAPI.school && <span>{spellFromAPI.school.name}</span>}
        </CardDescription>
      )}
    </CardHeader>
  );
}
