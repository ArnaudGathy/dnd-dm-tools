import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { InputHTMLAttributes } from "react";
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
  items: Record<string, string>;
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
  ...rest
}: FormFieldSelectProps<TFieldValues, TName>) {
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
              {...field}
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={rest.disabled}
            >
              <FormControl>
                <SelectTrigger className={cn({ "text-muted-foreground": !field.value })}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
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
