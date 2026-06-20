import { Separator } from "@/components/ui/separator";
import { Settings, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ACTION_TAGS,
  FACT_ICONS,
  PLANNING_ACCENT,
  PLANNING_MARKERS,
} from "@/app/(with-nav)/characters/[id]/spells/spellStatus";

export default function SpellsLegend() {
  return (
    <div className="flex max-w-xs flex-col gap-1.5 text-sm">
      <div className="text-base font-semibold">Disponibilité</div>
      <div className="text-muted-foreground">
        Cliquer sur la pastille pour préparer / oublier un sort.
      </div>
      <div className="flex items-center gap-2">
        <span className="flex size-5 items-center justify-center">
          <span className="size-3 rounded-full bg-sky-500" />
        </span>
        Préparé — compte dans le budget
      </div>
      <div className="flex items-center gap-2">
        <span className="flex size-5 items-center justify-center">
          <Star className="size-3.5 fill-amber-500 text-amber-500" />
        </span>
        Toujours disponible — gratuit, verrouillé
      </div>
      <div className="flex items-center gap-2">
        <span className="flex size-5 items-center justify-center">
          <span className="size-3 rounded-full border-2 border-muted-foreground/40" />
        </span>
        Non préparé
      </div>

      <Separator className="my-2" />

      <div className="text-base font-semibold">Ma configuration</div>
      <div className="text-muted-foreground">Propre à ce personnage, défini via le rouage.</div>
      {PLANNING_MARKERS.map(({ flag, Icon, label }) => (
        <div key={flag} className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center">
            <Icon className={cn("size-4", PLANNING_ACCENT)} />
          </span>
          {label}
        </div>
      ))}

      <Separator className="my-2" />

      <div className="text-base font-semibold">Propriétés du sort</div>
      <div className="text-muted-foreground">Inhérent au sort lui-même.</div>
      {Object.values(FACT_ICONS).map((fact) => (
        <div key={fact.label} className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center">
            <fact.Icon className={cn("size-4", fact.className)} />
          </span>
          {fact.label}
        </div>
      ))}
      {Object.values(ACTION_TAGS).map((tag) => (
        <div key={tag.label} className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center">
            <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", tag.className)}>
              {tag.label}
            </span>
          </span>
          {tag.explanation}
        </div>
      ))}

      <Separator className="my-2" />

      <div className="text-base font-semibold">Mode édition</div>
      <div className="flex items-center gap-2">
        <span className="flex size-5 items-center justify-center">
          <Settings className="size-4 text-muted-foreground" />
        </span>
        Configurer un sort
      </div>
      <div className="flex items-center gap-2">
        <span className="flex size-5 items-center justify-center">
          <X className="size-4 text-muted-foreground" />
        </span>
        Supprimer un sort
      </div>
    </div>
  );
}
