import { entries } from "remeda";
import { getModifier, shortenAbilityName } from "@/utils/utils";
import { AbilityNameType } from "@/types/types";

export default function Abilities({
  abilities,
  savingThrows,
}: {
  abilities: Record<AbilityNameType, number>;
  savingThrows?: Partial<Record<AbilityNameType, string | undefined>>;
}) {
  // Saves are 1:1 with abilities, so show each ability's check modifier (the big number) and
  // its saving-throw bonus together. The save line is always shown and always pink — using
  // the listed value, or the ability modifier when no save data exists.
  return entries(abilities).map(([name, value]) => {
    const modifier = getModifier(value);
    const modifierLabel = modifier >= 0 ? `+${modifier}` : `${modifier}`;
    const saveLabel = savingThrows?.[name] ?? modifierLabel;

    return (
      <div key={name} className="flex min-w-[84px] flex-col gap-1 rounded-lg bg-muted px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {shortenAbilityName(name)}
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-semibold leading-none text-indigo-400">
            {modifierLabel}
          </span>
          <span className="text-xs text-muted-foreground">{value}</span>
        </div>
        <div className="flex items-baseline gap-1 text-xs font-medium text-pink-300">
          <span>{saveLabel}</span>
          <span>JdS</span>
        </div>
      </div>
    );
  });
}
