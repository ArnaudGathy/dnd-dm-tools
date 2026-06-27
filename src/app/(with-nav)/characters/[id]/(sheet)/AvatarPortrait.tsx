"use client";

import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Hero portrait that reveals a larger preview on hover (after a short delay) so the
 * DM can inspect the art, while a click still opens the full-resolution original.
 */
export default function AvatarPortrait({ src, alt }: { src: string; alt: string }) {
  return (
    <TooltipProvider delayDuration={350}>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={src}
            className="relative block aspect-[3/4] w-40 shrink-0 overflow-hidden rounded-xl border border-border bg-muted transition-colors hover:border-muted-foreground/40 md:w-44"
          >
            <Image src={src} alt={alt} fill sizes="176px" className="object-cover" />
          </a>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={10}
          className="rounded-xl border-border bg-popover p-1.5 shadow-xl"
        >
          {/* Detail preview: `sizes="540px"` resolves to the ~1080px variant at 2× DPR
              (540×2), giving a sharp image without generating the full-size original. */}
          <div className="relative aspect-[3/4] w-96 overflow-hidden rounded-lg">
            <Image src={src} alt={alt} fill sizes="540px" quality={90} className="object-cover" />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
