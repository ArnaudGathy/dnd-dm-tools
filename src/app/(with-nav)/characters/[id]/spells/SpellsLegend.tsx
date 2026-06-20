import { Separator } from "@/components/ui/separator";
import { MessageCircleMore, RefreshCcw, Settings, Sparkle, WandSparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CATEGORY_CONFIG,
  SpellCategory,
} from "@/app/(with-nav)/characters/[id]/spells/spellStatus";

const categoryOrder: SpellCategory[] = [
  "prepared",
  "always",
  "longRest",
  "ritual",
  "swapLongRest",
  "swapLevelUp",
];

const chips = [
  { Icon: MessageCircleMore, className: "text-yellow-500", label: "Concentration" },
  { Icon: Sparkle, className: "text-emerald-500", label: "Rituel" },
  { Icon: WandSparkles, className: "text-lime-500", label: "1 lancement / long repos" },
  { Icon: RefreshCcw, className: "text-rose-500", label: "Échangeable (couleur = quand)" },
];

export default function SpellsLegend() {
  return (
    <div className="flex max-w-xs flex-col gap-1 text-sm">
      <div className="text-base font-semibold">Statut</div>
      <div className="text-muted-foreground">
        Cliquer sur la pastille pour préparer / oublier un sort.
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span className="flex size-5 items-center justify-center rounded-full">
          <span className="size-3 rounded-full bg-sky-500" />
        </span>
        Préparé — utilisable
      </div>
      <div className="flex items-center gap-2">
        <span className="flex size-5 items-center justify-center rounded-full">
          <span className="size-3 rounded-full border-2 border-muted-foreground/40" />
        </span>
        Non préparé
      </div>

      <Separator className="my-2" />

      <div className="text-base font-semibold">Couleur de la pastille</div>
      <div className="text-muted-foreground">La couleur indique pourquoi le sort est prêt.</div>
      {categoryOrder.map((category) => (
        <div key={category} className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded-full">
            <span className={cn("size-3 rounded-full", CATEGORY_CONFIG[category].fill)} />
          </span>
          {CATEGORY_CONFIG[category].label}
        </div>
      ))}

      <Separator className="my-2" />

      <div className="text-base font-semibold">Indicateurs</div>
      {chips.map(({ Icon, className, label }) => (
        <div key={label} className="flex items-center gap-2">
          <Icon className={cn("size-4", className)} />
          {label}
        </div>
      ))}
      <div className="flex items-center gap-2">
        <span className="rounded bg-orange-500/15 px-1.5 py-0.5 text-[10px] font-medium text-orange-600 dark:text-orange-400">
          Bonus
        </span>
        <span className="rounded bg-purple-500/15 px-1.5 py-0.5 text-[10px] font-medium text-purple-600 dark:text-purple-400">
          Réaction
        </span>
        Type d&apos;action
      </div>

      <Separator className="my-2" />

      <div className="text-base font-semibold">Mode édition</div>
      <div className="flex items-center gap-2">
        <Settings className="size-4 text-muted-foreground" /> Configurer un sort
      </div>
      <div className="flex items-center gap-2">
        <X className="size-4 text-muted-foreground" /> Supprimer un sort
      </div>
    </div>
  );
}
