import { cn } from "@/lib/utils";
import { entries } from "remeda";
import { Eye, EyeOff, GripVertical } from "lucide-react";
import { Themes } from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/useRessouceStorage";
import Icon from "@/components/ui/icon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DisplayRessource } from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/useRessourceData";

const themes = {
  red: "bg-red-500",
  orange: "bg-orange-500",
  amber: "bg-amber-500",
  yellow: "bg-yellow-500",
  lime: "bg-lime-500",
  green: "bg-green-500",
  emerald: "bg-emerald-500",
  teal: "bg-teal-500",
  cyan: "bg-cyan-500",
  sky: "bg-sky-500",
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
  purple: "bg-purple-500",
  fuchsia: "bg-fuchsia-500",
  pink: "bg-pink-500",
  rose: "bg-rose-500",
  neutral: "bg-neutral-500",
  white: "bg-white",
} satisfies Record<Themes, string>;

/** One row of the resource display config: grip · icon · name · color dot ·
 *  visibility eye. Tapping the dot expands an inline swatch strip under the
 *  row (no nested popover) — the row updates live as swatches are tried. */
export default function RessourceConfigItem({
  displayRessource,
  id,
  isColorOpen,
  onToggleColorAction,
}: {
  id: string;
  displayRessource: DisplayRessource;
  isColorOpen: boolean;
  onToggleColorAction: () => void;
}) {
  const [ressource, setRessource] = displayRessource.useRessource;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative rounded-lg transition-colors",
        isDragging ? "z-10 bg-muted shadow-lg" : "hover:bg-muted/60",
      )}
    >
      <div className="flex items-center gap-1.5 py-1 pl-0.5 pr-1.5">
        <button
          type="button"
          title="Réordonner"
          className="shrink-0 cursor-grab touch-none rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>

        <span
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2",
            !ressource.isEnabled && "opacity-40",
          )}
        >
          <Icon icon={displayRessource.icon} theme={ressource.theme} />
          <span className="truncate text-sm font-semibold">{displayRessource.name}</span>
        </span>

        <button
          type="button"
          title="Changer la couleur"
          className={cn(
            "size-5 shrink-0 rounded-full transition-transform hover:scale-110",
            themes[ressource.theme],
            isColorOpen && "ring-2 ring-white/80 ring-offset-2 ring-offset-popover",
            !ressource.isEnabled && "pointer-events-none opacity-30",
          )}
          onClick={onToggleColorAction}
        />

        <button
          type="button"
          title={ressource.isEnabled ? "Masquer cette ressource" : "Afficher cette ressource"}
          className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
          onClick={() => setRessource({ ...ressource, isEnabled: !ressource.isEnabled })}
        >
          {ressource.isEnabled ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
        </button>
      </div>

      {isColorOpen && ressource.isEnabled && (
        <div className="flex flex-wrap gap-1.5 px-2.5 pb-2.5 pt-1">
          {entries(themes).map(([theme, colorClassName]) => (
            <button
              key={theme}
              type="button"
              title={theme}
              className={cn(
                "size-5 rounded-full transition-transform hover:scale-110",
                colorClassName,
                theme === ressource.theme && "ring-2 ring-white ring-offset-2 ring-offset-popover",
              )}
              onClick={() => setRessource({ ...ressource, theme })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
