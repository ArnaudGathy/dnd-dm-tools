import { useEffect } from "react";
import { FieldPath, UseFormReturn } from "react-hook-form";
import { CharacterCreationForm } from "@/app/(with-nav)/characters/add/CreateCharacterForm";
import {
  clampPointBuyBase,
  POINT_BUY_BASE_MAX,
  POINT_BUY_BASE_MIN,
  POINT_BUY_BUDGET,
  pointBuyCost,
} from "@/app/(with-nav)/characters/add/utils";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ABILITIES_MAP } from "@/constants/maps";
import { shortenAbilityName } from "@/utils/utils";
import { Calculator } from "lucide-react";

export const ABILITY_FIELDS = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
] as const;

type AbilityField = (typeof ABILITY_FIELDS)[number];
type BaseField = `${AbilityField}Base`;
type BonusField = `${AbilityField}Bonus`;

const parseIntOrNull = (value: string | undefined) => {
  const parsed = parseInt(value ?? "", 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const sanitizeDigits = (value: string) => value.replace(/[^0-9]/g, "").slice(0, 2);

const baseField = (stat: AbilityField): BaseField => `${stat}Base`;
const bonusField = (stat: AbilityField): BonusField => `${stat}Bonus`;

/**
 * Ability scores builder for character creation. Each ability is bought with the
 * point-buy system (base 8–15, shared 27-point budget) and can then receive
 * extra points from historique/dons. The uneditable total (base + bonus) is
 * mirrored into the persisted ability field so the rest of the form/backend keeps
 * reading a single final value. Going over budget is blocked at the schema level
 * (see `signUpFormSchema`) and listed in the validation summary, so this view
 * only needs a lightweight running tally.
 */
export default function PointBuyCounter({ form }: { form: UseFormReturn<CharacterCreationForm> }) {
  const bases = ABILITY_FIELDS.map((stat) => form.watch(baseField(stat)));
  const bonuses = ABILITY_FIELDS.map((stat) => form.watch(bonusField(stat)));

  const baseNumbers = bases.map(parseIntOrNull);
  const bonusNumbers = bonuses.map((value) => parseIntOrNull(value) ?? 0);
  const totals = baseNumbers.map((base, index) =>
    base === null ? null : base + bonusNumbers[index],
  );

  const spent = baseNumbers.reduce<number>(
    (sum, base) => sum + (base === null ? 0 : pointBuyCost(base)),
    0,
  );
  const balance = POINT_BUY_BUDGET - spent;
  const isBalanced = balance === 0;

  // Keep the persisted ability fields (the total) in sync with base + bonus.
  const totalsKey = totals.map((total) => total ?? "").join(",");
  useEffect(() => {
    ABILITY_FIELDS.forEach((stat, index) => {
      const total = totals[index];
      const nextValue = total === null ? "" : String(total);
      if (form.getValues(stat) !== nextValue) {
        form.setValue(stat as FieldPath<CharacterCreationForm>, nextValue, {
          shouldValidate: form.formState.isSubmitted,
          shouldDirty: true,
        });
      }
    });
    // totalsKey captures every base/bonus change; other deps are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalsKey]);

  return (
    <div className="flex flex-col gap-3">
      <div
        data-anchor="pointBuyBudget"
        className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm"
      >
        <Calculator className="size-4 shrink-0 text-teal-400" />
        <span>
          Acquisition par points (point buy) : {spent} / {POINT_BUY_BUDGET} points
        </span>
        <span
          className={cn(
            "ml-auto font-bold tabular-nums",
            isBalanced ? "text-teal-400" : "text-amber-400",
          )}
        >
          {isBalanced
            ? "budget dépensé"
            : balance > 0
              ? `${balance} à dépenser`
              : `${-balance} en trop`}
        </span>
      </div>

      <div className="sm:grid-cols-3 grid grid-cols-2 gap-3 md:grid-cols-6">
        {ABILITY_FIELDS.map((stat, index) => (
          <AbilityRow
            key={stat}
            form={form}
            stat={stat}
            base={baseNumbers[index]}
            total={totals[index]}
          />
        ))}
      </div>
    </div>
  );
}

function AbilityRow({
  form,
  stat,
  base,
  total,
}: {
  form: UseFormReturn<CharacterCreationForm>;
  stat: AbilityField;
  base: number | null;
  total: number | null;
}) {
  const baseName = baseField(stat);
  const bonusName = bonusField(stat);
  const baseValue = form.watch(baseName) ?? "";
  const bonusValue = form.watch(bonusName) ?? "";

  const cost = base === null ? null : pointBuyCost(base);

  const setBase = (value: string) => form.setValue(baseName, value, { shouldDirty: true });
  const setBonus = (value: string) => form.setValue(bonusName, value, { shouldDirty: true });

  const clampBaseOnBlur = () => {
    const parsed = parseIntOrNull(baseValue);
    if (parsed !== null) {
      setBase(String(clampPointBuyBase(parsed)));
    }
  };

  return (
    <div
      data-anchor={stat}
      className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3"
    >
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold uppercase tracking-wide" title={ABILITIES_MAP[stat]}>
          {shortenAbilityName(stat)}
        </span>
        {cost !== null && (
          <span className="text-xs tabular-nums text-muted-foreground">{cost} pts</span>
        )}
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Base</span>
        <Input
          value={baseValue}
          inputMode="numeric"
          aria-label={`${ABILITIES_MAP[stat]} — base (${POINT_BUY_BASE_MIN} à ${POINT_BUY_BASE_MAX})`}
          className="text-center font-semibold"
          onChange={(event) => setBase(sanitizeDigits(event.target.value))}
          onBlur={clampBaseOnBlur}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Bonus</span>
        <Input
          value={bonusValue}
          inputMode="numeric"
          placeholder="0"
          aria-label={`${ABILITIES_MAP[stat]} — bonus (historique / don)`}
          className="text-center"
          onChange={(event) => setBonus(sanitizeDigits(event.target.value))}
        />
      </label>

      <div className="mt-1 flex flex-col gap-1">
        <span className="text-xs font-medium text-teal-300">Total</span>
        <div className="rounded-md border border-teal-500/40 bg-teal-500/10 py-1.5 text-center">
          <span
            className="text-lg font-bold tabular-nums text-teal-200"
            aria-label={`${ABILITIES_MAP[stat]} — total`}
          >
            {total ?? "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
