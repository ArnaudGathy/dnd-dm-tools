import { UseFormReturn, useFieldArray } from "react-hook-form";
import { CharacterCreationForm } from "@/app/(with-nav)/characters/add/CreateCharacterForm";
import ArrayAddButton from "@/app/(with-nav)/characters/add/(items)/ArrayAddButton";
import FormFieldInput from "@/components/ui/inputs/FormFieldInput";
import { ItemCard } from "@/app/(with-nav)/characters/add/(items)/itemUI";

export default function CapacitiesArray({ form }: { form: UseFormReturn<CharacterCreationForm> }) {
  const fieldName = "capacities";
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: fieldName,
  });
  const rootError = form.formState.errors.capacities?.root?.message;
  const capacities = form.watch(fieldName);

  return (
    <div className="flex flex-col gap-3" data-anchor={fieldName}>
      <p className="text-sm text-muted-foreground">
        Les capacités de classe, de race, de don ou d&apos;historique du personnage.
      </p>
      {fields.map((field, index) => {
        const capacityName = capacities[index]?.name;
        return (
          <ItemCard
            key={field.id}
            title={
              capacityName ? `Capacité ${index + 1} — ${capacityName}` : `Capacité ${index + 1}`
            }
            onDelete={() => remove(index)}
            deleteDisabled={fields.length < 2}
          >
            <FormFieldInput
              formInstance={form}
              formFieldName={`${fieldName}.${index}.name`}
              label="Nom"
              labelClassName="text-sm"
              required
            />
            <FormFieldInput
              formInstance={form}
              formFieldName={`${fieldName}.${index}.description`}
              label="Description"
              labelClassName="text-sm"
              textarea
            />
          </ItemCard>
        );
      })}

      {rootError && <p className="text-sm font-medium text-destructive">{rootError}</p>}

      <ArrayAddButton
        label="Ajouter une capacité"
        onClick={() => append({ name: "", description: "" })}
      />
    </div>
  );
}
