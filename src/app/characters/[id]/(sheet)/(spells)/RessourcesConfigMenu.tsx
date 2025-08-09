import { Button } from "@/components/ui/button";
import { Palette, Settings, Tent } from "lucide-react";
import { FlameKindling } from "lucide-react";
import PopoverComponent from "@/components/ui/PopoverComponent";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { entries } from "remeda";
import { Themes } from "@/app/characters/[id]/(sheet)/(spells)/useRessouceStorage";
import { DisplayRessource } from "@/app/characters/[id]/(sheet)/(spells)/Ressources";
import { PopoverClose } from "@/components/ui/popover";

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

export default function RessourcesConfigMenu({
  ressources,
  shortRest,
  longRest,
}: {
  ressources: DisplayRessource[];
  shortRest: () => void;
  longRest: () => void;
}) {
  return (
    <div>
      <PopoverComponent
        asChild
        side="top"
        definition={
          <div className="flex min-w-[350px] flex-col gap-4">
            <div>
              <span className="mb-2 block text-lg font-bold">
                Réinitialiser
              </span>
              <div className="flex gap-2">
                <Button size="sm" onClick={longRest}>
                  <Tent /> Long repos
                </Button>
                <Button theme="neutral" size="sm" onClick={shortRest}>
                  <FlameKindling /> Court repos
                </Button>
              </div>
            </div>

            <div>
              <span className="mb-2 block text-lg font-bold">
                Configuration
              </span>
              <div className="flex flex-col gap-2">
                {ressources.map(({ name, useRessource }) => {
                  const [ressource, setRessource] = useRessource;

                  return (
                    <div key={name} className="flex justify-between gap-2">
                      <div
                        className={cn("flex items-center gap-2", {
                          ["opacity-50"]: !ressource.isEnabled,
                        })}
                      >
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
                                        ["border-2 border-white"]:
                                          theme === ressource.theme,
                                      },
                                    )}
                                    onClick={() =>
                                      setRessource({ ...ressource, theme })
                                    }
                                  />
                                </PopoverClose>
                              ))}
                            </div>
                          }
                        >
                          <Button
                            size="icon"
                            disabled={!ressource.isEnabled}
                            theme={ressource.theme}
                          >
                            <Palette />
                          </Button>
                        </PopoverComponent>
                        <span>{name}</span>
                      </div>
                      <div className="flex items-center gap-2">
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
                })}
              </div>
            </div>
          </div>
        }
      >
        <Button theme="neutral">
          <Settings />
        </Button>
      </PopoverComponent>
    </div>
  );
}
