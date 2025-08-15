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
import { MONEY_TYPE_MAP } from "@/constants/maps";
import { MoneyType } from "@prisma/client";

export default function WealthArray({
  form,
}: {
  form: UseFormReturn<CharacterCreationForm>;
}) {
  const fieldName = "wealth";
  const { fields } = useFieldArray({
    control: form.control,
    name: fieldName,
  });

  return (
    <FormItem className="w-1/2">
      <div className="flex gap-1">
        <FormLabel>Monnaies</FormLabel>
        <span className="text-primary">*</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {fields.map((field, index) => {
          const labelColor =
            field.type === MoneyType.SILVER
              ? "text-slate-400"
              : field.type === MoneyType.COPPER
                ? "text-orange-400"
                : "text-amber-400";

          return (
            <div key={field.id} className="flex w-full flex-col gap-1">
              <FormLabel className={labelColor}>
                {MONEY_TYPE_MAP[field.type]}
              </FormLabel>
              <FormField
                control={form.control}
                name={`${fieldName}.${index}.quantity`}
                render={({ field: inputField }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        {...inputField}
                        value={inputField.value?.toString() ?? ""}
                        placeholder="Qté"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          );
        })}
      </div>
    </FormItem>
  );
}
