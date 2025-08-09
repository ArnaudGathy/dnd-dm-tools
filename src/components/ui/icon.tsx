import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { Themes } from "@/app/characters/[id]/(sheet)/(spells)/useRessouceStorage";

const themeText: Record<Themes, string> = {
  red: "text-red-500",
  orange: "text-orange-500",
  amber: "text-amber-500",
  yellow: "text-yellow-500",
  lime: "text-lime-500",
  green: "text-green-500",
  emerald: "text-emerald-500",
  teal: "text-teal-500",
  cyan: "text-cyan-500",
  sky: "text-sky-500",
  blue: "text-blue-500",
  indigo: "text-indigo-500",
  violet: "text-violet-500",
  purple: "text-purple-500",
  fuchsia: "text-fuchsia-500",
  pink: "text-pink-500",
  rose: "text-rose-500",
  neutral: "text-neutral-500",
  white: "text-white",
};

export default function Icon({
  icon,
  theme,
}: {
  icon: ReactNode;
  theme?: Themes;
}) {
  return (
    <div className={cn("rounded-lg p-1.5", "bg-neutral-700")}>
      <Slot
        className={cn(
          "size-4",
          theme ? themeText[theme] : "text-primary-foreground",
        )}
      >
        {icon}
      </Slot>
    </div>
  );
}
