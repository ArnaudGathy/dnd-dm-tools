import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ALIGNMENT_MAP } from "@/constants/maps";
import { Alignment } from "@prisma/client";

/**
 * The 9 alignments laid out as the classic D&D chart: law axis as columns
 * (Loyal → Chaotique), moral axis as rows (Bon → Mauvais).
 */
const ALIGNMENT_CHART: { moral: "good" | "neutral" | "evil"; cells: Alignment[] }[] = [
  {
    moral: "good",
    cells: [Alignment.LAWFUL_GOOD, Alignment.NEUTRAL_GOOD, Alignment.CHAOTIC_GOOD],
  },
  {
    moral: "neutral",
    cells: [Alignment.LAWFUL_NEUTRAL, Alignment.NEUTRAL, Alignment.CHAOTIC_NEUTRAL],
  },
  {
    moral: "evil",
    cells: [Alignment.LAWFUL_EVIL, Alignment.NEUTRAL_EVIL, Alignment.CHAOTIC_EVIL],
  },
];

/** Per-row moral tint: good = emerald, neutral = slate, evil = red. */
const MORAL_CLASSES = {
  good: {
    idle: "bg-emerald-500/[0.04] hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-200",
    selected: "border-emerald-500/70 bg-emerald-500/15 text-emerald-300",
  },
  neutral: {
    idle: "bg-slate-500/[0.04] hover:border-slate-400/40 hover:bg-slate-500/10 hover:text-slate-200",
    selected: "border-slate-400/70 bg-slate-500/15 text-slate-200",
  },
  evil: {
    idle: "bg-red-500/[0.04] hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-200",
    selected: "border-red-500/70 bg-red-500/15 text-red-300",
  },
};

type FormFieldAlignmentChartProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  formInstance: UseFormReturn<TFieldValues>;
  formFieldName: TName;
  label?: string;
  description?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
};

export default function FormFieldAlignmentChart<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  formInstance,
  formFieldName,
  label,
  description,
  className,
  required,
  disabled,
}: FormFieldAlignmentChartProps<TFieldValues, TName>) {
  return (
    <FormField
      control={formInstance.control}
      name={formFieldName}
      render={({ field }) => (
        <FormItem className={cn("w-full", className)} data-anchor={formFieldName}>
          {label && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <FormLabel disabled={disabled}>{label}</FormLabel>
                {required && <span className="leading-none text-primary">*</span>}
              </div>
              {description && (
                <FormDescription className="leading-3">{description}</FormDescription>
              )}
            </div>
          )}
          <FormControl>
            <div
              role="radiogroup"
              aria-label={label ?? "Alignement"}
              className="grid grid-cols-3 gap-1.5"
            >
              {ALIGNMENT_CHART.flatMap(({ moral, cells }) =>
                cells.map((alignment) => {
                  const isSelected = field.value === alignment;
                  const moralClasses = MORAL_CLASSES[moral];
                  // "Loyal Bon" renders on two lines; true neutral is just "Neutre".
                  const words = ALIGNMENT_MAP[alignment].split(" ");
                  return (
                    <button
                      key={alignment}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={disabled}
                      onClick={() => field.onChange(alignment)}
                      onBlur={field.onBlur}
                      className={cn(
                        "flex h-12 flex-col items-center justify-center rounded-md border border-border leading-tight transition-colors",
                        "sm:text-xs text-[11px] text-muted-foreground",
                        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                        "disabled:pointer-events-none disabled:opacity-50",
                        isSelected ? cn("font-semibold", moralClasses.selected) : moralClasses.idle,
                      )}
                    >
                      {words.map((word) => (
                        <span key={word}>{word}</span>
                      ))}
                    </button>
                  );
                }),
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
