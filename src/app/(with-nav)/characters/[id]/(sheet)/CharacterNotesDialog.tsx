"use client";

import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Check, FilePlus2, GripVertical, LoaderCircle, NotebookPen, Trash2 } from "lucide-react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import type { CharacterNote } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ToggleConfirmDialog from "@/components/ui/ToggleConfirmDialog";
import RichTextEditor from "@/components/richText/RichTextEditor";
import {
  createCharacterNote,
  deleteCharacterNote,
  renameCharacterNote,
  reorderCharacterNotes,
  updateCharacterNoteContent,
} from "@/lib/actions/characterNotes";
import { cn } from "@/lib/utils";
import { isCtrlChord, isPlainKey } from "@/utils/keyboard";

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" });

/** One entry of the note list. Only the grip starts a drag, so clicking the title
 *  still selects the note and touch users can scroll the horizontal strip. */
function SortableNoteItem({
  note,
  isActive,
  onSelect,
}: {
  note: CharacterNote;
  isActive: boolean;
  onSelect: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("group relative shrink-0", isDragging && "z-10 opacity-80 shadow-lg")}
    >
      <div
        className={cn(
          "flex w-44 items-center rounded-md border-l-2 transition-colors md:w-full",
          isActive
            ? "border-amber-500 bg-amber-500/10 text-foreground"
            : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground",
          isDragging && "bg-muted",
        )}
      >
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={`Déplacer « ${note.title} »`}
          className="flex cursor-grab touch-none items-center self-stretch pl-1 text-muted-foreground/50 hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </button>
        <button
          type="button"
          onClick={onSelect}
          aria-current={isActive ? "page" : undefined}
          className="flex min-w-0 flex-1 flex-col py-1.5 pl-1 pr-3 text-left"
        >
          <span className="truncate text-sm font-medium">{note.title}</span>
          <span className="text-tiny text-muted-foreground">{formatDate(note.updatedAt)}</span>
        </button>
      </div>
    </li>
  );
}

/**
 * Full-screen rich-text notes editor, reachable from every tab of the sheet via
 * the floating button, N or Ctrl+Q (Escape closes). A character holds several named
 * notes: the sidebar switches between them and reorders them by drag and drop, the
 * header renames/deletes the active one. Content autosaves while typing and is rendered read-only in the Bio tab.
 */
export default function CharacterNotesDialog({
  characterId,
  notes: serverNotes,
}: {
  characterId: number;
  notes: CharacterNote[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  // Newly created notes get their title field focused so they can be named right away.
  const [titleFocusNoteId, setTitleFocusNoteId] = useState<number | null>(null);
  // Order applied locally on drop, until the revalidated server props catch up.
  const [optimisticOrder, setOptimisticOrder] = useState<number[] | null>(null);

  const notes = optimisticOrder
    ? [...serverNotes].sort((a, b) => {
        const rank = (id: number) => {
          const index = optimisticOrder.indexOf(id);
          return index === -1 ? Infinity : index;
        };
        return rank(a.id) - rank(b.id);
      })
    : serverNotes;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Falls back to the first note when nothing is selected yet or the selection was deleted.
  const activeNote = notes.find((note) => note.id === activeNoteId) ?? notes[0] ?? null;

  const debouncedSave = useDebouncedCallback(async (noteId: number, html: string) => {
    const result = await updateCharacterNoteContent(characterId, noteId, html);
    if (result.error) {
      toast.error(result.error);
      setSaveState("idle");
      return;
    }
    setSaveState("saved");
  }, 800);

  const handleChange = (html: string) => {
    if (!activeNote) return;
    setSaveState("saving");
    debouncedSave(activeNote.id, html);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Don't lose the trailing keystrokes when closing mid-debounce.
      debouncedSave.flush();
    }
    setIsOpen(open);
  };

  const selectNote = async (noteId: number) => {
    if (noteId === activeNote?.id) return;
    // Persist the current note before its editor unmounts, so coming back shows fresh content.
    await debouncedSave.flush();
    setSaveState("idle");
    setActiveNoteId(noteId);
  };

  const handleCreate = async () => {
    setIsCreating(true);
    await debouncedSave.flush();
    const result = await createCharacterNote(characterId);
    setIsCreating(false);
    if (result.error || !result.noteId) {
      toast.error(result.error ?? "La création de la note a échoué.");
      return;
    }
    setSaveState("idle");
    setActiveNoteId(result.noteId);
    setTitleFocusNoteId(result.noteId);
  };

  const handleRename = async (note: CharacterNote, title: string) => {
    const trimmed = title.trim();
    if (trimmed === note.title) return;
    const result = await renameCharacterNote(characterId, note.id, trimmed);
    if (result.error) toast.error(result.error);
  };

  const handleDelete = async (note: CharacterNote) => {
    // Pending keystrokes always belong to the active note — the one being deleted.
    debouncedSave.cancel();
    const result = await deleteCharacterNote(characterId, note.id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setSaveState("idle");
    setActiveNoteId(null);
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const ids = notes.map((note) => note.id);
    const newOrder = arrayMove(ids, ids.indexOf(Number(active.id)), ids.indexOf(Number(over.id)));
    setOptimisticOrder(newOrder);
    const result = await reorderCharacterNotes(characterId, newOrder);
    if (result.error) toast.error(result.error);
    setOptimisticOrder(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // N opens the notes from anywhere on the sheet — except while typing, where it is text.
      if (!isOpen && isPlainKey(e, "n")) {
        e.preventDefault();
        handleOpenChange(true);
        return;
      }
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
          <TooltipContent side="left" className="flex items-center gap-2">
            Notes de partie
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-sans text-tiny text-muted-foreground">
              N
            </kbd>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Fills the viewport minus a 1rem gutter on every side, to maximize typing space. */}
      <DialogContent
        className="flex h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-none flex-col gap-3 outline-none"
        // No initial focus: Radix would otherwise focus the first control ("Nouvelle note").
        // Radix still focuses the container itself once the editor mounts (its FocusScope
        // refocuses the container when DOM nodes are removed while nothing is focused),
        // hence `outline-none` on this tabIndex=-1 wrapper.
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
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
            Sauvegarde automatique · visible dans l&apos;onglet Bio · glisser ⋮⋮ pour réordonner ·
            Échap pour fermer
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-3 md:flex-row">
          {/* Note list — horizontal strip on mobile, sidebar from md up */}
          <nav className="flex shrink-0 flex-col gap-2 md:w-60">
            <Button
              variant="outline"
              size="sm"
              className="justify-start gap-2"
              onClick={handleCreate}
              disabled={isCreating}
            >
              {isCreating ? <LoaderCircle className="animate-spin" /> : <FilePlus2 />}
              Nouvelle note
            </Button>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={notes.map((note) => note.id)} strategy={rectSortingStrategy}>
                <ul className="flex min-h-0 gap-1 overflow-x-auto md:flex-1 md:flex-col md:overflow-y-auto md:overflow-x-visible">
                  {notes.map((note) => (
                    <SortableNoteItem
                      key={note.id}
                      note={note}
                      isActive={note.id === activeNote?.id}
                      onSelect={() => selectNote(note.id)}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          </nav>

          {activeNote ? (
            <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-center gap-2">
                <Input
                  // Keyed by note: the field resets to the new note's title on switch.
                  key={activeNote.id}
                  defaultValue={activeNote.title}
                  maxLength={255}
                  aria-label="Titre de la note"
                  autoFocus={titleFocusNoteId === activeNote.id}
                  onFocus={(e) => titleFocusNoteId === activeNote.id && e.target.select()}
                  onBlur={(e) => {
                    setTitleFocusNoteId(null);
                    if (!e.target.value.trim()) {
                      e.target.value = activeNote.title;
                      return;
                    }
                    handleRename(activeNote, e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.currentTarget.blur();
                    }
                  }}
                  className="h-9 font-semibold"
                />
                <ToggleConfirmDialog
                  title="Supprimer cette note ?"
                  description={`« ${activeNote.title} » sera définitivement supprimée.`}
                  onConfirm={() => handleDelete(activeNote)}
                >
                  {(setConfirmOpen) => (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-red-400"
                      aria-label="Supprimer la note"
                      onClick={() => setConfirmOpen(true)}
                    >
                      <Trash2 />
                    </Button>
                  )}
                </ToggleConfirmDialog>
              </div>
              <RichTextEditor
                // The editor only reads `content` on mount — remount it per note.
                key={activeNote.id}
                content={activeNote.content}
                onChange={handleChange}
                className="min-h-0 flex-1"
              />
            </section>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border text-center">
              <p className="text-sm text-muted-foreground">Aucune note pour l&apos;instant.</p>
              <Button onClick={handleCreate} disabled={isCreating} className="gap-2">
                {isCreating ? <LoaderCircle className="animate-spin" /> : <FilePlus2 />}
                Créer une note
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
