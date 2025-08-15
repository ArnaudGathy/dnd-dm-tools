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
import { Textarea } from "@/components/ui/textarea";

export default function CapacitiesArray({
  form,
}: {
  form: UseFormReturn<CharacterCreationForm>;
}) {
  const fieldName = "capacities";
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: fieldName,
  });

  return (
    <FormItem>
      <div className="flex gap-1">
        <FormLabel>Capacités</FormLabel>
        <span className="text-primary">*</span>
      </div>

      <div className="flex flex-col gap-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex w-full flex-col gap-1">
            <div className="flex gap-1">
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
                        placeholder="Nom"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name={`${fieldName}.${index}.description`}
              render={({ field: inputField }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      {...inputField}
                      value={inputField.value?.toString() ?? ""}
                      placeholder="Description"
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
        label="Ajouter une capacité"
        onClick={() => append({ name: "", description: "" })}
      />
    </FormItem>
  );
}
