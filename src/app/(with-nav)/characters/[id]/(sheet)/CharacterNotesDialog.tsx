"use client";

import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Check, LoaderCircle, NotebookPen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import RichTextEditor from "@/components/richText/RichTextEditor";
import { updateRichNotes } from "@/lib/actions/characters";
import { isCtrlChord } from "@/utils/keyboard";

/**
 * Full-screen rich-text notes editor, reachable from every tab of the sheet via
 * the floating button or Ctrl+Q (Escape closes). Content autosaves while typing
 * and is rendered read-only in the Bio tab.
 */
export default function CharacterNotesDialog({
  characterId,
  richNotes,
}: {
  characterId: number;
  richNotes: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  const debouncedSave = useDebouncedCallback(async (html: string) => {
    await updateRichNotes(characterId, html);
    setSaveState("saved");
  }, 800);

  const handleChange = (html: string) => {
    setSaveState("saving");
    debouncedSave(html);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Don't lose the trailing keystrokes when closing mid-debounce.
      debouncedSave.flush();
    }
    setIsOpen(open);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCtrlChord(e, "q")) {
        // Capture phase so the toggle also works while focus is inside the editor.
        e.preventDefault();
        e.stopPropagation();
        handleOpenChange(!isOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", handleKeyDown, { capture: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <TooltipProvider delayDuration={350}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                size="icon"
                className="fixed bottom-6 right-6 z-40 size-12 rounded-full shadow-lg"
                aria-label="Notes de partie"
              >
                <NotebookPen className="size-5" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="left">Notes de partie (Ctrl + Q)</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="flex h-[85vh] max-w-4xl flex-col gap-3">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <NotebookPen className="size-5 text-amber-400" />
            Notes de partie
            <span className="ml-1 inline-flex size-5 items-center justify-center">
              {saveState === "saving" && (
                <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
              )}
              {saveState === "saved" && <Check className="size-4 text-emerald-400" />}
            </span>
          </DialogTitle>
          <DialogDescription>
            Sauvegarde automatique · visible dans l&apos;onglet Bio · Échap pour fermer
          </DialogDescription>
        </DialogHeader>
        <RichTextEditor
          content={richNotes ?? ""}
          onChange={handleChange}
          className="min-h-0 flex-1"
        />
      </DialogContent>
    </Dialog>
  );
}
