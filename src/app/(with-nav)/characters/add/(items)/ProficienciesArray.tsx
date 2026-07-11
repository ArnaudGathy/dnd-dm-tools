import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { CharacterCreationForm } from "@/app/(with-nav)/characters/add/CreateCharacterForm";
import ArrayAddButton from "@/app/(with-nav)/characters/add/(items)/ArrayAddButton";
import ArrayDeleteButton from "@/app/(with-nav)/characters/add/(items)/ArrayDeleteButton";

export default function ProficienciesArray({
  form,
}: {
  form: UseFormReturn<CharacterCreationForm>;
}) {
  const fieldName = "proficiencies";
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: fieldName,
  });
  const rootError = form.formState.errors.proficiencies?.root?.message;

  return (
    <div className="flex flex-col gap-2" data-anchor={fieldName}>
      <p className="text-sm text-muted-foreground">
        Langues, armures, armes, outils, etc... Une ligne par maîtrise ou groupe de maitrise.
      </p>
      <div className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <FormField
              control={form.control}
              name={`${fieldName}.${index}.name`}
              render={({ field: inputField }) => (
                <FormItem className="flex-1" data-anchor={`${fieldName}.${index}.name`}>
                  <FormControl>
                    <Input
                      {...inputField}
                      value={inputField.value?.toString() ?? ""}
                      placeholder="Ex : Langues : commun, elfique"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ArrayDeleteButton
              onClick={() => remove(index)}
              disabled={fields.length < 2}
              label={`Supprimer la maîtrise ${index + 1}`}
            />
          </div>
        ))}
      </div>

      {rootError && <p className="text-sm font-medium text-destructive">{rootError}</p>}

      <ArrayAddButton label="Ajouter une maîtrise" onClick={() => append({ name: "" })} />
    </div>
  );
}
