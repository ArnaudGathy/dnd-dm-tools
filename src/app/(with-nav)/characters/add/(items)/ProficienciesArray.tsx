import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

  return (
    <FormItem>
      <div className="flex gap-1">
        <FormLabel>Maîtrises générales</FormLabel>
        <span className="text-primary">*</span>
      </div>

      <div className="flex flex-col gap-1">
        {fields.map((field, index) => (
          <div key={field.id} className="flex h-full gap-2">
            <ArrayDeleteButton
              onClick={() => remove(index)}
              disabled={fields.length < 2}
            />
            <FormField
              control={form.control}
              name={`${fieldName}.${index}.name`}
              render={({ field: inputField }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      {...inputField}
                      value={inputField.value?.toString() ?? ""}
                      placeholder="Maitrise"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>

      <ArrayAddButton
        label="Ajouter une maîtrise"
        onClick={() => append({ name: "" })}
      />
    </FormItem>
  );
}
