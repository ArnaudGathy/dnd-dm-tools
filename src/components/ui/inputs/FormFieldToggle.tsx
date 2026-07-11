import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

/**
 * Accent applied when the toggle is on. Mirrors the color language of the
 * character sheet's ArmorCard so the form and the sheet read the same:
 * emerald = équipée, indigo = maîtrisée, red = discrétion.
 */
type ToggleAccent = "emerald" | "indigo" | "red" | "amber";

const ACCENT_ON: Record<ToggleAccent, string> = {
  emerald: "border-emerald-400/60 bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/15",
  indigo: "border-indigo-400/60 bg-indigo-400/10 text-indigo-400 hover:bg-indigo-400/15",
  red: "border-red-400/60 bg-red-400/10 text-red-400 hover:bg-red-400/15",
  amber: "border-amber-400/60 bg-amber-400/10 text-amber-400 hover:bg-amber-400/15",
};

/**
 * Icon + label toggle button wired to react-hook-form — a friendlier stand-in
 * for a checkbox on the character forms. Off state is a quiet outlined chip;
 * on state lights up with the given accent (and its icon color).
 */
export default function FormFieldToggle<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  formInstance,
  formFieldName,
  label,
  icon: Icon,
  accent,
  disabled,
  className,
}: {
  formInstance: UseFormReturn<TFieldValues>;
  formFieldName: TName;
  label: string;
  icon: LucideIcon;
  accent: ToggleAccent;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <FormField
      control={formInstance.control}
      name={formFieldName}
      render={({ field }) => (
        <FormItem className={className} data-anchor={formFieldName}>
          <FormControl>
            <Toggle
              variant="outline"
              size="sm"
              pressed={!!field.value}
              onPressedChange={field.onChange}
              disabled={disabled}
              className={cn(
                "h-9 gap-2 border-input font-normal text-muted-foreground data-[state=on]:font-medium",
                !!field.value && ACCENT_ON[accent],
              )}
            >
              <Icon className="size-4" />
              {label}
            </Toggle>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
