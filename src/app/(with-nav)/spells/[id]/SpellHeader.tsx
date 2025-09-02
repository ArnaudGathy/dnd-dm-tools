import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { Spell } from "@prisma/client";
import { APISpell } from "@/types/schemas";
import Link from "next/link";

export default async function SpellHeader({
  spellFromAPI,
  spellFromApp,
  tiny,
}: {
  spellFromApp: Spell | null;
  spellFromAPI: APISpell;
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
            {isRitual && <SparklesIcon className="size-6 text-emerald-500" />}

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

      <CardDescription className="flex gap-2">
        {spellFromAPI.level !== undefined && (
          <span>Niveau {spellFromAPI.level}</span>
        )}
        {!tiny && spellFromAPI.school && (
          <span>{spellFromAPI.school.name}</span>
        )}
      </CardDescription>
    </CardHeader>
  );
}
