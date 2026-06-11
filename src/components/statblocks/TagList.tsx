import { getDamageTypeStyleFromLabel } from "@/utils/stats/weapons";
import { cn } from "@/lib/utils";

export const TagList = ({
  items,
  colorizeDamage = false,
  accentClassName,
}: {
  items: string[];
  colorizeDamage?: boolean;
  // Tailwind border/text classes applied to non-damage tags so a whole row reads as its
  // category at a glance (e.g. saves, resistances). Damage-typed tags keep their own color.
  accentClassName?: string;
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const style = colorizeDamage ? getDamageTypeStyleFromLabel(item) : undefined;
        const Icon = style?.icon;

        return (
          <span
            key={item}
            className={cn(
              "inline-flex items-center gap-1.5 whitespace-normal rounded-md border bg-neutral-800/40 px-2 py-1 text-sm leading-none",
              style ? "border-neutral-700" : (accentClassName ?? "border-neutral-700"),
            )}
            style={style ? { borderColor: style.color } : undefined}
          >
            {Icon && <Icon className="size-3.5 shrink-0" style={{ color: style?.color }} />}
            <span style={style ? { color: style.color } : undefined}>{item}</span>
          </span>
        );
      })}
    </div>
  );
};
