"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";
import { Themes } from "@/app/(with-nav)/characters/[id]/(sheet)/(spells)/useRessouceStorage";

const themeBg: Record<Themes, string> = {
  red: "data-[state=checked]:bg-red-500 data-[state=unchecked]:bg-red-500/15",
  orange:
    "data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-orange-500/15",
  amber:
    "data-[state=checked]:bg-amber-500 data-[state=unchecked]:bg-amber-500/15",
  yellow:
    "data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-yellow-500/15",
  lime: "data-[state=checked]:bg-lime-500 data-[state=unchecked]:bg-lime-500/15",
  green:
    "data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-green-500/15",
  emerald:
    "data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-emerald-500/15",
  teal: "data-[state=checked]:bg-teal-500 data-[state=unchecked]:bg-teal-500/15",
  cyan: "data-[state=checked]:bg-cyan-500 data-[state=unchecked]:bg-cyan-500/15",
  sky: "data-[state=checked]:bg-sky-500 data-[state=unchecked]:bg-sky-500/15",
  blue: "data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-blue-500/15",
  indigo:
    "data-[state=checked]:bg-indigo-500 data-[state=unchecked]:bg-indigo-500/15",
  violet:
    "data-[state=checked]:bg-violet-500 data-[state=unchecked]:bg-violet-500/15",
  purple:
    "data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-purple-500/15",
  fuchsia:
    "data-[state=checked]:bg-fuchsia-500 data-[state=unchecked]:bg-fuchsia-500/15",
  pink: "data-[state=checked]:bg-pink-500 data-[state=unchecked]:bg-pink-500/15",
  rose: "data-[state=checked]:bg-rose-500 data-[state=unchecked]:bg-rose-500/15",
  neutral:
    "data-[state=checked]:bg-neutral-500 data-[state=unchecked]:bg-neutral-500/15",
  white: "data-[state=checked]:bg-white data-[state=unchecked]:bg-white/15",
};

const themeThumb: Record<Themes, string> = {
  red: "bg-red-50",
  orange: "bg-orange-50",
  amber: "bg-amber-50",
  yellow: "bg-yellow-50",
  lime: "bg-lime-50",
  green: "bg-green-50",
  emerald: "bg-emerald-50",
  teal: "bg-teal-50",
  cyan: "bg-cyan-50",
  sky: "bg-sky-50",
  blue: "bg-blue-50",
  indigo: "bg-indigo-50",
  violet: "bg-violet-50",
  purple: "bg-purple-50",
  fuchsia: "bg-fuchsia-50",
  pink: "bg-pink-50",
  rose: "bg-rose-50",
  neutral: "bg-neutral-50",
  white: "bg-white",
};

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    theme?: Themes;
  }
>(({ className, theme, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",

      "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      theme
        ? themeBg[theme]
        : "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        theme ? themeThumb[theme] : "bg-background",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
