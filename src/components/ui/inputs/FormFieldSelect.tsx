import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { InputHTMLAttributes, ReactNode } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { entries } from "remeda";

type FormFieldSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = InputHTMLAttributes<HTMLInputElement> & {
  formInstance: UseFormReturn<TFieldValues>;
  formFieldName: TName;
  label?: string;
  description?: string;
  className?: string;
  items: Record<string, ReactNode>;
};

export default function FormFieldSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  formInstance,
  description,
  className,
  formFieldName,
  label,
  placeholder,
  items,
  required,
  allowNoValue,
  noValueLabel = "Aucun",
  ...rest
}: FormFieldSelectProps<TFieldValues, TName> & {
  allowNoValue?: boolean;
  noValueLabel?: string;
}) {
  return (
    <FormField
      control={formInstance.control}
      name={formFieldName}
      render={({ field }) => {
        return (
          <FormItem className={cn("w-full", className)}>
            {label && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <FormLabel disabled={rest.disabled}>{label}</FormLabel>
                  {required && <span className="text-primary">*</span>}
                </div>
                <div>
                  {description && (
                    <FormDescription className="leading-3">{description}</FormDescription>
                  )}
                </div>
              </div>
            )}
            <Select
              onValueChange={(val) => {
                if (allowNoValue && val === "no-value") {
                  field.onChange(null);
                } else {
                  field.onChange(val);
                }
              }}
              value={field.value ?? (allowNoValue ? "no-value" : undefined)}
              disabled={rest.disabled}
              name={field.name}
            >
              <FormControl>
                <SelectTrigger className={cn({ "text-muted-foreground": !field.value })}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {allowNoValue && <SelectItem value="no-value">{noValueLabel}</SelectItem>}
                {entries(items).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
