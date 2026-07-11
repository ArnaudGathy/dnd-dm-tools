import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

/** Controlled labeled checkbox wired to react-hook-form, aligned with the input row height. */
export default function FormFieldCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  formInstance,
  formFieldName,
  label,
  disabled,
  className,
}: {
  formInstance: UseFormReturn<TFieldValues>;
  formFieldName: TName;
  label: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <FormField
      control={formInstance.control}
      name={formFieldName}
      render={({ field }) => (
        <FormItem className={className} data-anchor={formFieldName}>
          <div className="flex items-center gap-2">
            <FormControl>
              <Checkbox
                checked={!!field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
              />
            </FormControl>
            <FormLabel disabled={disabled} className="cursor-pointer text-sm font-normal">
              {label}
            </FormLabel>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
