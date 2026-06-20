import { Spell } from "@prisma/client";
import { APISpell } from "@/types/schemas";
import { getSessionData } from "@/lib/utils";
import ClearSpellCacheButton from "@/components/spells/ClearSpellCacheButton";

export default async function SpellHeader({
  spellFromAPI,
  spellFromApp,
}: {
  spellFromApp: Spell | null;
  spellFromAPI: APISpell;
  characterId?: number;
}) {
  if (!spellFromAPI.index) {
    throw new Error("Missing spell index");
  }

  const { isAdmin } = await getSessionData();

  const spellName = spellFromApp?.name
    ? spellFromApp.name
    : (spellFromAPI.name ?? spellFromAPI.index);
  const eyebrow = [
    spellFromAPI.school?.name,
    spellFromAPI.level !== undefined && `Niveau ${spellFromAPI.level}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex items-start justify-between gap-4 border-l-2 border-primary bg-secondary/20 px-4 py-3 md:px-6">
      <div className="flex min-w-0 flex-col gap-0.5">
        {eyebrow && (
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {eyebrow}
          </span>
        )}
        <h1 className="truncate text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
          {spellName}
        </h1>
      </div>

      {isAdmin && <ClearSpellCacheButton spellId={spellFromAPI.index} />}
    </div>
  );
}
