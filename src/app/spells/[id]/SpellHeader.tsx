import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { Spell } from "@prisma/client";
import { APISpell } from "@/types/schemas";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Link } from "@/components/ui/Link";

export default function SpellHeader({
  spellFromAPI,
  spellFromApp,
  tiny,
}: {
  spellFromApp: Spell;
  spellFromAPI: APISpell;
  tiny?: boolean;
}) {
  return (
    <CardHeader>
      {(spellFromApp.name || spellFromAPI.name) && (
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {(spellFromApp.isRitual ?? spellFromAPI.ritual) && (
              <SparklesIcon className="size-6 text-emerald-500" />
            )}
            {spellFromApp.name ? (
              <div>{spellFromApp.name}</div>
            ) : (
              <div>{spellFromAPI.name ?? spellFromAPI.index}</div>
            )}
          </div>
          {tiny && (
            <div>
              <Link href={`/spells/${spellFromAPI.index}`}>
                <Button size="xs" variant="secondary">
                  <ExternalLink />
                </Button>
              </Link>
            </div>
          )}
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
