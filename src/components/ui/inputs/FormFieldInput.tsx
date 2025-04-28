import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, FieldValues, FieldPath } from "react-hook-form";
import { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

type FormFieldInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = InputHTMLAttributes<HTMLInputElement> & {
  formInstance: UseFormReturn<TFieldValues>;
  formFieldName: TName;
  label: string;
  description?: string;
  className?: string;
  relativeElement?: ReactNode;
  textarea?: boolean;
};

export default function FormFieldInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  formInstance,
  formFieldName,
  relativeElement,
  label,
  description,
  className,
  textarea,
  ...rest
}: FormFieldInputProps<TFieldValues, TName>) {
  return (
    <FormField
      control={formInstance.control}
      name={formFieldName}
      render={({ field }) => {
        return (
          <FormItem className={className}>
            {label && (
              <div className="flex items-center justify-between">
                <div
                  className={cn("flex gap-1", { relative: !!relativeElement })}
                >
                  <FormLabel disabled={rest.disabled}>{label}</FormLabel>
                  {rest.required && (
                    <span className="leading-3 text-primary">*</span>
                  )}
                  {relativeElement}
                </div>
                {description && (
                  <FormDescription
                    className="leading-3"
                    disabled={rest.disabled}
                  >
                    {description}
                  </FormDescription>
                )}
              </div>
            )}
            <FormControl>
              {textarea ? (
                <Textarea
                  {...field}
                  required={rest.required}
                  value={field.value?.toString() ?? ""}
                  className="h-[100px]"
                />
              ) : (
                <Input
                  {...rest}
                  {...field}
                  value={field.value?.toString() ?? ""}
                />
              )}
            </FormControl>
            <FormMessage className="text-left" />
          </FormItem>
        );
      }}
    />
  );
}
