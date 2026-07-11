import { useFieldArray, UseFormReturn } from "react-hook-form";
import { CharacterCreationForm } from "@/app/(with-nav)/characters/add/CreateCharacterForm";
import { ABILITY_NAME_MAP_TO_FR, ABILITIES_MAP, ABILITIES_MAP_TO_NAME } from "@/constants/maps";
import { Abilities } from "@prisma/client";
import { cn } from "@/lib/utils";
import { entries } from "remeda";

/**
 * The six abilities as toggle chips — tap to grant/revoke the saving-throw
 * proficiency. Same data shape as before (presence in the array = proficient).
 */
export default function SavingThrowsArray({
  form,
}: {
  form: UseFormReturn<CharacterCreationForm>;
}) {
  const fieldName = "savingThrows";
  const { append, remove } = useFieldArray({
    control: form.control,
    name: fieldName,
  });

  const savingThrows = form.watch(fieldName);
  const rootError = form.formState.errors.savingThrows?.root?.message;

  const toggle = (ability: Abilities) => {
    const index = savingThrows.findIndex((entry) => entry.ability === ability);
    if (index === -1) {
      append({ ability, isProficient: true });
    } else if (savingThrows.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="flex flex-col gap-2" data-anchor={fieldName}>
      <p className="text-sm text-muted-foreground">
        Sélectionnez les caractéristiques dont les jets de sauvegarde sont maîtrisés (deux).
      </p>
      <div className="flex flex-wrap gap-2">
        {entries(ABILITY_NAME_MAP_TO_FR).map(([ability, shortLabel]) => {
          const isActive = savingThrows.some((entry) => entry.ability === ability);
          return (
            <button
              key={ability}
              type="button"
              onClick={() => toggle(ability)}
              aria-pressed={isActive}
              className={cn(
                "rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors",
                isActive
                  ? "border-teal-500/60 bg-teal-500/15 text-teal-300"
                  : "border-border bg-muted/40 text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground",
              )}
            >
              <span className="hidden md:inline">
                {ABILITIES_MAP[ABILITIES_MAP_TO_NAME[ability]]}
              </span>
              <span className="md:hidden">{shortLabel}</span>
            </button>
          );
        })}
      </div>
      {rootError && <p className="text-sm font-medium text-destructive">{rootError}</p>}
    </div>
  );
}
