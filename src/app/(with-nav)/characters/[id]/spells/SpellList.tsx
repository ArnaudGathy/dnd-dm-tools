import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/components/ui/Link";
import { capitalize, entries } from "remeda";
import { SpellWithFlags } from "@/lib/api/spells";
import { SpellStatusButton } from "@/app/(with-nav)/spells/[id]/SpellStatusButton";
import DeleteSpellButton from "@/app/(with-nav)/characters/[id]/spells/DeleteSpellButton";
import SpellsSettings from "@/app/(with-nav)/characters/[id]/spells/SpellsSettings";
import { CharacterById } from "@/lib/utils";

export const SpellList = ({
  spellsGroupedBy,
  label,
  character,
  isEditMode = false,
}: {
  character: CharacterById;
  spellsGroupedBy: Record<string, SpellWithFlags[]>;
  label: string;
  isEditMode?: boolean;
}) => {
  const spellEntries = entries(spellsGroupedBy);
  if (spellEntries.length === 0) {
    return <div className="mt-4 text-muted-foreground">Aucun sort à afficher.</div>;
  }

  return (
    <div className="flex flex-wrap gap-4">
      {spellEntries.map(([property, spells]) => (
        <Card key={property} className="min-w-full md:min-w-[24%] md:max-w-[24%]">
          <CardHeader>
            <CardTitle>{`${label} ${capitalize(property)}`}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {spells.map((spell) => (
                <li key={spell.id} className="flex items-center gap-2">
                  <div className="flex min-w-4 gap-4">
                    {isEditMode && (
                      <SpellsSettings
                        characterId={character.id}
                        spellId={spell.id}
                        isAlwaysPrepared={spell.isAlwaysPrepared}
                        hasLongRestCast={spell.hasLongRestCast}
                        canBeSwappedOnLongRest={spell.canBeSwappedOnLongRest}
                        canBeSwappedOnLevelUp={spell.canBeSwappedOnLevelUp}
                        isPrepared={spell.isPrepared}
                      />
                    )}
                    <SpellStatusButton spell={spell} character={character} />
                  </div>
                  <Link href={`/spells/${spell.id}`} className="truncate">
                    {spell.name}
                  </Link>
                  {isEditMode && <DeleteSpellButton spell={spell} characterId={character.id} />}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
