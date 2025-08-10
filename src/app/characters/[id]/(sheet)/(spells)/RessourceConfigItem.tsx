import { cn } from "@/lib/utils";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { entries } from "remeda";
import { PopoverClose } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { GripHorizontal, Palette } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Themes } from "@/app/characters/[id]/(sheet)/(spells)/useRessouceStorage";
import { DisplayRessource } from "@/app/characters/[id]/(sheet)/(spells)/Ressources";
import Icon from "@/components/ui/icon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

export default function RessourceConfigItem({
  displayRessource,
  id,
}: {
  id: string;
  displayRessource: DisplayRessource;
}) {
  const [ressource, setRessource] = displayRessource.useRessource;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={cn("flex justify-between gap-2 rounded-md border p-1", {
        ["bg-white/10"]: isDragging,
      })}
      ref={setNodeRef}
      style={style}
    >
      <div
        className={cn("flex items-center gap-2", {
          ["opacity-50"]: !ressource.isEnabled,
        })}
      >
        <div
          className={cn("cursor-auto rounded-md p-1 transition", {
            ["cursor-grab hover:bg-neutral-700"]: ressource.isEnabled,
          })}
          {...attributes}
          {...listeners}
        >
          <GripHorizontal className="size-5" />
        </div>

        <Icon icon={displayRessource.icon} theme={ressource.theme} />
        <span>{displayRessource.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <PopoverComponent
          asChild
          side="top"
          definition={
            <div className="flex max-w-[200px] flex-wrap gap-2">
              {entries(themes).map(([theme, color]) => (
                <PopoverClose key={theme}>
                  <div
                    className={cn(
                      "size-6 cursor-pointer rounded-2xl p-1",
                      color,
                      {
                        ["border-2 border-white"]: theme === ressource.theme,
                      },
                    )}
                    onClick={() => setRessource({ ...ressource, theme })}
                  />
                </PopoverClose>
              ))}
            </div>
          }
        >
          <Button
            size="sm"
            disabled={!ressource.isEnabled}
            theme={ressource.theme}
          >
            <Palette />
          </Button>
        </PopoverComponent>
        <Switch
          checked={ressource.isEnabled}
          onCheckedChange={(checked) =>
            setRessource({
              ...ressource,
              isEnabled: checked,
            })
          }
        />
      </div>
    </div>
  );
}
