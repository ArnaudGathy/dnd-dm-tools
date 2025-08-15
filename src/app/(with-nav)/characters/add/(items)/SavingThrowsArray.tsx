import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { CharacterCreationForm } from "@/app/(with-nav)/characters/add/CreateCharacterForm";
import { ABILITY_NAME_MAP_TO_FR } from "@/constants/maps";
import { Abilities } from "@prisma/client";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { entries } from "remeda";
import ArrayAddButton from "@/app/(with-nav)/characters/add/(items)/ArrayAddButton";
import ArrayDeleteButton from "@/app/(with-nav)/characters/add/(items)/ArrayDeleteButton";

export default function SavingThrowsArray({
  form,
}: {
  form: UseFormReturn<CharacterCreationForm>;
}) {
  const fieldName = "savingThrows";
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: fieldName,
  });

  const savingThrows = form.watch("savingThrows");

  const existingAbilities = savingThrows.map(
    (savingThrow: { ability: Abilities; isProficient: boolean }) =>
      savingThrow.ability,
  );
  const availableAbilities = Object.values(Abilities).filter(
    (ability) => !existingAbilities.includes(ability),
  );

  return (
    <FormItem>
      <div className="flex gap-1">
        <FormLabel>Maîtrises des jets de sauvegardes</FormLabel>
        <span className="text-primary">*</span>
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-1">
            <ArrayDeleteButton
              onClick={() => remove(index)}
              disabled={fields.length < 2}
            />
            <FormField
              control={form.control}
              name={`${fieldName}.${index}`}
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <Select
                      defaultValue={field.value?.ability}
                      onValueChange={(val) =>
                        field.onChange({
                          ability: val as Abilities,
                          isProficient: true,
                        })
                      }
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn({
                            "text-muted-foreground": !field.value,
                          })}
                        >
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {entries(ABILITY_NAME_MAP_TO_FR).map(
                          ([value, label]) => (
                            <SelectItem
                              key={value}
                              value={value}
                              disabled={
                                !!savingThrows.find(
                                  (item) => item.ability === value,
                                )
                              }
                            >
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
        ))}
      </div>

      <ArrayAddButton
        label="Ajouter une maîtrise"
        disabled={savingThrows.length === 6}
        onClick={() =>
          append({ ability: availableAbilities[0], isProficient: true })
        }
      />
    </FormItem>
  );
}
