import { cn } from "@/lib/utils";
import { Themes } from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/useRessouceStorage";

// Static class maps — Tailwind can't compile dynamic `bg-${theme}-500` names.
const PIP_FILLED: Record<Themes, string> = {
  red: "border-red-400 bg-red-500",
  orange: "border-orange-400 bg-orange-500",
  amber: "border-amber-400 bg-amber-500",
  yellow: "border-yellow-400 bg-yellow-500",
  lime: "border-lime-400 bg-lime-500",
  green: "border-green-400 bg-green-500",
  emerald: "border-emerald-400 bg-emerald-500",
  teal: "border-teal-400 bg-teal-500",
  cyan: "border-cyan-400 bg-cyan-500",
  sky: "border-sky-400 bg-sky-500",
  blue: "border-blue-400 bg-blue-500",
  indigo: "border-indigo-400 bg-indigo-500",
  violet: "border-violet-400 bg-violet-500",
  purple: "border-purple-400 bg-purple-500",
  fuchsia: "border-fuchsia-400 bg-fuchsia-500",
  pink: "border-pink-400 bg-pink-500",
  rose: "border-rose-400 bg-rose-500",
  neutral: "border-neutral-300 bg-neutral-400",
  white: "border-white bg-white",
};

const PIP_EMPTY: Record<Themes, string> = {
  red: "border-red-500/40 hover:border-red-400",
  orange: "border-orange-500/40 hover:border-orange-400",
  amber: "border-amber-500/40 hover:border-amber-400",
  yellow: "border-yellow-500/40 hover:border-yellow-400",
  lime: "border-lime-500/40 hover:border-lime-400",
  green: "border-green-500/40 hover:border-green-400",
  emerald: "border-emerald-500/40 hover:border-emerald-400",
  teal: "border-teal-500/40 hover:border-teal-400",
  cyan: "border-cyan-500/40 hover:border-cyan-400",
  sky: "border-sky-500/40 hover:border-sky-400",
  blue: "border-blue-500/40 hover:border-blue-400",
  indigo: "border-indigo-500/40 hover:border-indigo-400",
  violet: "border-violet-500/40 hover:border-violet-400",
  purple: "border-purple-500/40 hover:border-purple-400",
  fuchsia: "border-fuchsia-500/40 hover:border-fuchsia-400",
  pink: "border-pink-500/40 hover:border-pink-400",
  rose: "border-rose-500/40 hover:border-rose-400",
  neutral: "border-neutral-500/60 hover:border-neutral-400",
  white: "border-white/40 hover:border-white/70",
};

/**
 * The unified "spendable charge" control: a row of pips where filled = still
 * available. Tapping a filled pip spends one charge, tapping an empty pip
 * regains one — the same gesture for class resources and spell slots.
 */
export default function PipRow({
  total,
  available,
  theme,
  onSpend,
  onRegain,
  size = "sm",
  className,
}: {
  total: number;
  available: number;
  theme: Themes;
  onSpend: () => void;
  onRegain: () => void;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {Array.from({ length: total }, (_, index) => {
        const isFilled = index < available;
        return (
          <button
            key={index}
            type="button"
            aria-label={isFilled ? "Dépenser" : "Récupérer"}
            onClick={isFilled ? onSpend : onRegain}
            className={cn(
              "rounded-full border-2 transition-transform hover:scale-110",
              size === "sm" ? "size-4" : "size-5",
              isFilled ? PIP_FILLED[theme] : PIP_EMPTY[theme],
            )}
          />
        );
      })}
    </div>
  );
}
