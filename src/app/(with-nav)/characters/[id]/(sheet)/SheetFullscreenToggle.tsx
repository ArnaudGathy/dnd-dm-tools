"use client";

import { useEffect, useState } from "react";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { isCtrlChord } from "@/utils/keyboard";

/**
 * In-app fullscreen for the character sheet, toggled by the floating button or
 * Ctrl+S: sets `data-sheet-fullscreen` on <html>, which globals.css uses to
 * hide the navbar/breadcrumb and drop the main container constraints.
 * Unmounting (navigating away) restores everything.
 */
export default function SheetFullscreenToggle() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-sheet-fullscreen", isFullscreen);
    return () => document.documentElement.removeAttribute("data-sheet-fullscreen");
  }, [isFullscreen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCtrlChord(e, "s")) {
        // Capture phase + preventDefault: works while focus is inside an input
        // and blocks Chrome's Ctrl+S "save page" on non-mac platforms.
        e.preventDefault();
        e.stopPropagation();
        setIsFullscreen((current) => !current);
      }
    };
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, []);

  const Icon = isFullscreen ? Minimize : Maximize;
  const label = isFullscreen ? "Quitter le plein écran" : "Plein écran";

  return (
    <TooltipProvider delayDuration={350}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="secondary"
            className="fixed bottom-20 right-6 z-40 size-12 rounded-full shadow-lg"
            aria-label={label}
            onClick={() => setIsFullscreen((current) => !current)}
          >
            <Icon className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">{label} (Ctrl + S)</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
