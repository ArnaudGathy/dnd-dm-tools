"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

import { Themes } from "@/app/characters/[id]/(sheet)/(spells)/useRessouceStorage";

const themeTrack: Record<Themes, string> = {
  red: "bg-red-500/15",
  orange: "bg-orange-500/15",
  amber: "bg-amber-500/15",
  yellow: "bg-yellow-500/15",
  lime: "bg-lime-500/15",
  green: "bg-green-500/15",
  emerald: "bg-emerald-500/15",
  teal: "bg-teal-500/15",
  cyan: "bg-cyan-500/15",
  sky: "bg-sky-500/15",
  blue: "bg-blue-500/15",
  indigo: "bg-indigo-500/15",
  violet: "bg-violet-500/15",
  purple: "bg-purple-500/15",
  fuchsia: "bg-fuchsia-500/15",
  pink: "bg-pink-500/15",
  rose: "bg-rose-500/15",
  neutral: "bg-neutral-500/15",
  white: "bg-white/15",
};

const themeRange: Record<Themes, string> = {
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
};

const themeThumb: Record<Themes, string> = {
  red: "border-red-500",
  orange: "border-orange-500",
  amber: "border-amber-500",
  yellow: "border-yellow-500",
  lime: "border-lime-500",
  green: "border-green-500",
  emerald: "border-emerald-500",
  teal: "border-teal-500",
  cyan: "border-cyan-500",
  sky: "border-sky-500",
  blue: "border-blue-500",
  indigo: "border-indigo-500",
  violet: "border-violet-500",
  purple: "border-purple-500",
  fuchsia: "border-fuchsia-500",
  pink: "border-pink-500",
  rose: "border-rose-500",
  neutral: "border-neutral-500",
  white: "border-white",
};

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    theme?: Themes;
  }
>(({ className, theme, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        "relative h-2 w-full grow overflow-hidden rounded-full",
        theme ? themeTrack[theme] : "bg-muted-foreground/10",
      )}
    >
      <SliderPrimitive.Range
        className={cn(
          "absolute h-full",
          theme ? themeRange[theme] : "bg-primary",
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        "block h-5 w-5 rounded-full border-2 bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        theme ? themeThumb[theme] : "border-primary",
      )}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
