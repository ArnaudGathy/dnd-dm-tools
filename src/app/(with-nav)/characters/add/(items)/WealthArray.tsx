import { UseFormReturn, useFieldArray } from "react-hook-form";
import { CharacterCreationForm } from "@/app/(with-nav)/characters/add/CreateCharacterForm";
import { MONEY_TYPE_MAP } from "@/constants/maps";
import { MoneyType } from "@prisma/client";
import FormFieldInput from "@/components/ui/inputs/FormFieldInput";
import { cn } from "@/lib/utils";

const MONEY_LABEL_COLOR: Record<MoneyType, string> = {
  [MoneyType.GOLD]: "text-amber-400",
  [MoneyType.SILVER]: "text-slate-400",
  [MoneyType.COPPER]: "text-orange-400",
};

export default function WealthArray({ form }: { form: UseFormReturn<CharacterCreationForm> }) {
  const fieldName = "wealth";
  const { fields } = useFieldArray({
    control: form.control,
    name: fieldName,
  });

  return (
    <div className="grid max-w-md grid-cols-3 gap-3" data-anchor={fieldName}>
      {fields.map((field, index) => (
        <FormFieldInput
          key={field.id}
          formInstance={form}
          formFieldName={`${fieldName}.${index}.quantity`}
          label={MONEY_TYPE_MAP[field.type]}
          labelClassName={cn("text-sm font-semibold", MONEY_LABEL_COLOR[field.type])}
          inputMode="numeric"
        />
      ))}
    </div>
  );
}
