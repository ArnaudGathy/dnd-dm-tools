import { getDamageTypeStyleFromLabel } from "@/utils/stats/weapons";
import { Pill } from "@/components/statblocks/Pill";

export const TagList = ({
  items,
  colorizeDamage = false,
  accentClassName,
}: {
  items: string[];
  colorizeDamage?: boolean;
  // Tailwind border/text classes applied to non-damage tags so a whole row reads as its
  // category at a glance (e.g. resistances, immunities). Damage-typed tags keep their own color.
  accentClassName?: string;
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const style = colorizeDamage ? getDamageTypeStyleFromLabel(item) : undefined;
        const Icon = style?.icon;

        return (
          <Pill
            key={item}
            className={style ? undefined : accentClassName}
            style={style ? { borderColor: style.color } : undefined}
          >
            {Icon && <Icon className="size-3.5 shrink-0" style={{ color: style.color }} />}
            <span style={style ? { color: style.color } : undefined}>{item}</span>
          </Pill>
        );
      })}
    </div>
  );
};
